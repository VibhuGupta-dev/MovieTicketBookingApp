
import crypto from "crypto";
import Order from "../../models/OrderModel.js";
import Ticket from "../../models/MovieTicketBookingSchema.js";
import SeatBooking from "../../models/SeatBookSchema.js";
import User from "../../models/UserSchema.js";
import Show from "../../models/ShowSchema.js"; // ✅ add karo
import { io } from "../../App.js";
import { generateQR } from "../../utils/qrgenrate.js";

const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const userId = req.userId;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment data missing" });
    }

    // ── Step 1: Verify signature ──
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // ── Step 2: Find Order ──
    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ── Step 3: Already paid check ──
    if (order.status === "paid") {
      const existingTicket = await Ticket.findOne({ ShowId: order.showId, UserId: order.userId });
      return res.json({
        success: true,
        message: "Already verified",
        ticketId: existingTicket?._id,
        qrCode: existingTicket?.qrCode ?? null,
      });
    }

    // ── Step 4: Get TimeSlotId from SeatBooking ──
    const seatBooking = await SeatBooking.findOne({ ShowId: order.showId });
    const timeSlotId = seatBooking?.TimeSlotId ?? null;

    // ── Step 5: Create Ticket ──
    const ticket = await Ticket.create({
      UserId: order.userId,
      ShowId: order.showId,
      SeatIds: order.seatIds,
      TimeSlotId: timeSlotId,
      Amount: order.amount,
      isQRgenerated: false,
    });

    // ── Step 6: Generate QR ──
    const qrData = {
      ticketId: ticket._id,
      userId: ticket.UserId,
      showId: ticket.ShowId,
      seatIds: ticket.SeatIds,
      timeSlotId: ticket.TimeSlotId,
      amount: ticket.Amount,
    };

    const qrImage = await generateQR(qrData);
    ticket.qrCode = qrImage;
    ticket.isQRgenerated = true;
    await ticket.save();

    // ── Step 7: Update Order ──
    order.status = "paid";
    order.paymentId = razorpay_payment_id;
    await order.save();

   
    if (timeSlotId) {
 
await Show.findByIdAndUpdate(
  order.showId,
  {
    $addToSet: {  
      "timeSlots.$[slot].bookedSeatIds": { $each: order.seatIds },
    },
  },
  {
    arrayFilters: [{ "slot._id": ticket.TimeSlotId }],
    new: true,
  }
);
    }

 
    if (seatBooking) {
      seatBooking.isBooked = true;
      seatBooking.isLocked = false;
      seatBooking.lockedAt = null;
      seatBooking.lockedUntil = null;
      await seatBooking.save();
    }

  
    io.emit("seatBooked", order.seatIds);

    await User.findByIdAndUpdate(userId, {
      $push: { orderHistory: { orderId: order._id, totalAmount: order.amount, status: "paid" } },
    });

    return res.status(200).json({
      success: true,
      ticketId: ticket._id,
      qrCode: qrImage,
    });

  } catch (err) {
    console.error("verifyPayment error:", err);
    return res.status(500).json({ message: "Payment verification failed", error: err.message });
  }
}