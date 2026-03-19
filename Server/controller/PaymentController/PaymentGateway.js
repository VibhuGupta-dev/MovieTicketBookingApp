// controller/PaymentController/PaymentGateway.js
import Razorpay from "razorpay";
import SeatBooking from "../../models/SeatBookSchema.js";
import Show from "../../models/ShowSchema.js";
import Order from "../../models/OrderModel.js";
import Cinema from "../../models/CinemaHallSchema.js";


const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function createOrder(req, res) {
  try {
    const userId = req.userId;
    const bookingId = req.params.orderId;
    const { seatId } = req.body;
    console.log(seatId)
    if (!bookingId || !seatId || seatId.length === 0) {
      return res.status(400).json({ message: "data missing" });
    }

    const seatBooking = await SeatBooking.findById(bookingId);
    if (!seatBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const show = await Show.findById(seatBooking.ShowId);
    const cinemaId = show.cinemaId
    const screenNumber = show.ScreenNumber
    console.log(screenNumber)
 const cinema = await Cinema.findById(cinemaId);
const rate = cinema.seats[0].rate;



const specificSeat = cinema.seats.find(s => String(s._id) === String(seatId));
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }
   const seatlength = seatId.length
    const subtotal = rate * seatlength;
    const bookingFee = Math.round(subtotal * 0.24);
    const totalAmount = subtotal + bookingFee;
     console.log(totalAmount , bookingFee , subtotal , seatlength)
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    await Order.create({
      razorpayOrderId: razorpayOrder.id,
      userId,
      movieId: show.movieId,
      showId: seatBooking.ShowId,
      seatIds: seatId,
      amount: totalAmount,
      ScreenNumber : screenNumber,

      status: "pending",
    });

    return res.status(200).json({
      orderId: razorpayOrder.id,
      amount: totalAmount,
      subtotal,
      bookingFee,
      currency: "INR",
    });

  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ message: "Error creating order", error: err.message });
  }
}