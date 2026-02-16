import Cinema from "../../models/CinemaHallSchema.js";

export async function ReadcinemaWithLocation(req, res) {
  try {
    const { StateId, CityId } = req.query;

    if (!StateId || !CityId) {
      return res.status(400).json({ message: "both state and city needed" });
    }

    const cinema = await Cinema.find({ StateId, CityId });

    if (cinema.length === 0) {
      return res.status(404).json({ message: "no cinema found" });
    }

    return res.status(200).json(cinema);
  } catch (err) {
    return res.status(500).json({ message: "error in ReadcinemaWithLocation" });
  }
}
