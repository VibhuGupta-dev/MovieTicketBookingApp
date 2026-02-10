// controller/TicketBookingController/CreateOrder.js
import razorpayInstance from "../../utils/Razorpay.js";
import Show from "../../models/ShowSchema.js";

export async function createOrder(req, res) {
  try {
    const showId = req.params.showId
    const { seatId } = req.body;

    if (!showId || !seatId?.length)
      return res.status(400).json({ message: "data missing" });

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "show not found" });

    const totalAmount = seatId.length * show.pricePerSeat;

    const order = await razorpayInstance.orders.create({
      amount: totalAmount * 100, 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    return res.json({
      orderId: order.id,
      amount: totalAmount,
      currency: "INR"
    });
  } catch (err) {
    return res.status(500).json({ message: "error creating order" });
  }
}
