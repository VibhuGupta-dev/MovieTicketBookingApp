import Razorpay from "razorpay";
import razorpayInstance from "../../utils/Razorpay.js"
import Cinema from "../../models/CinemaHallSchema.js";
import Movie from "../../models/MovieSchema.js";
import Show from "../../models/ShowSchema.js";

export async function calculateTotal(req, res) {
  try {
    const { movieId, cinemahallId, showId } = req.params;
    const { seatId } = req.body;

    const cinema = await Cinema.findById(cinemahallId);
    const show = await Show.findById(showId);

    if (!cinema || !show) {
      return res.status(400).json({ message: "cinema or show not found" });
    }

    let seats = [];
    for (let id of seatId) {
      const seat = cinema.seats.find(s => s._id.toString() === id);
      if (!seat) return res.status(400).json({ message: "seat not found" });
      seats.push(id);
    }

    const totalPrice = seats.length * show.pricePerSeat;

    return res.json({
      seats: seats.length,
      pricePerSeat: show.pricePerSeat,
      totalPrice
    });

  } catch (err) {
    return res.status(500).json({ message: "error calculating total" });
  }
}

