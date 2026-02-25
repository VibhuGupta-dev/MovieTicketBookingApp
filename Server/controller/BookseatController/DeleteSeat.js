// controller/SeatController/DeleteSeatBooking.js
import SeatBooking from "../../models/SeatBookSchema.js";

export async function deleteSeatBooking(req, res) {
  try {
    const { bookingId } = req.params;

    const deleted = await SeatBooking.findByIdAndDelete(bookingId);
    if (!deleted) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting booking", error: err.message });
  }
}