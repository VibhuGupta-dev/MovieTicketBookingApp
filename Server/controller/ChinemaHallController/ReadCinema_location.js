import { redis } from "../../App.js";
import Cinema from "../../models/CinemaHallSchema.js";

export async function ReadcinemaWithLocation(req, res) {
  try {
    const { StateId, CityId } = req.query;

    const cacheExists = await redis.exists(`cinema_${StateId}_${CityId}`);
    if (cacheExists) {
      console.log("redis hit");
      const cinemas = await redis.get(`cinema_${StateId}_${CityId}`);
      console.log(cinemas);
      return res.status(200).json(JSON.parse(cinemas));
    }

    if (!StateId || !CityId) {
      return res.status(400).json({ message: "both state and city needed" });
    }

    const cinema = await Cinema.find({ StateId, CityId }).populate("MovieId");

    if (cinema.length === 0) {
      return res.status(404).json({ message: "no cinema found" });
    }
   await redis.setex(`cinema_${StateId}_${CityId}` , 300 , JSON.stringify(cinema))
    return res.status(200).json(cinema);
  } catch (err) {
    return res.status(500).json({ message: "error in ReadcinemaWithLocation" });
  }
}
