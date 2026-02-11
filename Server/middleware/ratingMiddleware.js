export function attachMovieAndUser(req, res, next) {
  const movieId = req.params.movieId;
  const userId = req.userId; 
  if (!movieId) {
    return res.status(400).json({ message: "movieId missing in params" });
  }

  if (!userId) {
    return res.status(401).json({ message: "user not authenticated" });
  }

  req.movieId = movieId;
  req.ratingUserId = userId;

  next();
}