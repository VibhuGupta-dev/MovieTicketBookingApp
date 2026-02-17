import Cinema from "../../models/CinemaHallSchema.js";

export async function ReadcinemaWithLocationAndMovieId(req, res) {
  try {
    const MovieId = req.params.MovieId;
    const { StateId, CityId } = req.query;

    if (!MovieId) {
      return res.status(400).json({ message: "movie id not there" });
    }

    const cinema = await Cinema.find({
      CityId,
      StateId,
      "MovieId.MovieId": MovieId   
    });

    res.status(200).json(cinema);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "error in ReadcinemaWithLocationAndMovieId" });
  }
}
