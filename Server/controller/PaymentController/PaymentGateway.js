// controller/TicketBookingController/CreateOrder.js
import razorpayInstance from "../../utils/Razorpay.js";
import Show from "../../models/ShowSchema.js";
import Order from "../../models/OrderModel.js"

export async function createOrder(req, res) {
  try {
    const userId = req.userId; 
    const showId = req.params.showId;
    const { seatId } = req.body;

    if (!showId || !seatId || seatId.length === 0) {
      return res.status(400).json({ message: "data missing" });
    }

    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "show not found" });

    const totalAmount = seatId.length * show.pricePerSeat;

    
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: totalAmount * 100, 
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });


    await Order.create({
      razorpayOrderId: razorpayOrder.id,
      userId,
      showId,
      seatIds: seatId,
      amount: totalAmount,
      status: "pending"
    });

    return res.json({
      orderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error creating order" });
  }
}
