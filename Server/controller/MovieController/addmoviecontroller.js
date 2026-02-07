import Movie from "../../models/MovieSchema.js";

export async function addmovie(req, res) {
  try {
    console.log("hey")
    const {
      MovieName,
      MovieLength,
      Moviegenre,
      cast,   
      MovieTrailer,
      MovieReleaseDate,
      MovieType,
      MovieLanguage,
      MoviePhoto,
      MovieBackgroundPhoto,
      MovieDescription,
    } = req.body;
    if (!MovieName || !MovieLength || !Moviegenre || !cast || !MovieTrailer || !MovieReleaseDate || !MovieType || !MovieDescription) {
  return res.status(400).json({ message: "all fields not filled" });
}
console.log( MovieName,
      MovieLength,
      Moviegenre,
      cast,   
      MovieTrailer,
      MovieReleaseDate,
      MovieType,
      MovieLanguage,
      MoviePhoto,
      MovieBackgroundPhoto,
      MovieDescription)

    const userID = req.userId; 

    if (!userID) {
      return res.status(403).json({ message: "Only admin can add movie" });
    }

    const movie = await Movie.create({
      userId: userID,
      MovieName,
      MovieLength,
      Moviegenre,
      cast,
      MovieTrailer,
      MovieReleaseDate,
      MovieType,
      MovieLanguage,
      MoviePhoto,
      MovieBackgroundPhoto,
      MovieDescription,
    });

    if (!movie) {
      return res.status(400).json({ message: "Movie not added" });
    }

    return res.status(201).json({
      message: "Movie added successfully",
      movie,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error in addmovie", error: err.message });
  }
}
