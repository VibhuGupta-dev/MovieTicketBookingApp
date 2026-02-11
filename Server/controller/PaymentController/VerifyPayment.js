// controller/TicketBookingController/VerifyPayment.js
import crypto from "crypto";
import Order from "../../models/OrderModel.js";
import Ticket from "../../models/MovieTicketBookingSchema.js";
import { io } from "../../App.js"; 
import User from "../../models/UserSchema.js";
import { generateQR } from "../../utils/qrgenrate.js";

export async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "payment data missing" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "invalid signature" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ message: "order not found" });

    if (order.status === "paid") {
      return res.json({ success: true, message: "already verified" });
    }


    const ticket = await Ticket.create({
      UserId: order.userId,
      ShowId: order.showId,
      SeatIds: order.seatIds,
      TimeSlotId: order.timeSlotId,
      Amount: order.amount,
      isQRgenerated: false
    });


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


    order.status = "paid";
    order.paymentId = razorpay_payment_id;
    await order.save();


    io.emit("seatBooked", order.seatIds);


    const userId = req.userId;
    const user = await User.findById(userId);
    user.orderHistory.push(order._id);
    await user.save();

    return res.json({
      success: true,
      ticketId: ticket._id,
      qrCode: qrImage
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "payment verification failed" });
  }
}
