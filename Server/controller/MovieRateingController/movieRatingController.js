import mongoose from "mongoose";
import MovieRating from "../../models/MovieRatingSchema.js";
// Rate or update rating for a movie
export async function rateMovie(req, res) {
  try {
    const { rating, review } = req.body;
    const movieId = req.movieId;
    const userId = req.ratingUserId;

    if (!rating) {
      return res.status(400).json({ message: "rating is required" });
    }

    if (rating < 1 || rating > 10) {
      return res.status(400).json({ message: "rating must be between 1 and 10" });
    }

    if (review && review.length < 5) {
      return res.status(400).json({ message: "review must be at least 5 characters" });
    }

    // upsert = update if exists else create
    const movieRating = await MovieRating.findOneAndUpdate(
      { movieId, userId },
      { rating, review },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "movie rated & reviewed successfully",
      data: movieRating
    });

  } catch (error) {
    console.error(error);

    // duplicate key error (unique index)
    if (error.code === 11000) {
      return res.status(400).json({ message: "You already rated this movie" });
    }

    res.status(500).json({ message: "server error" });
  }
}

// Get average rating of a movie
export async function getMovieRating(req, res) {
  try {
    const movieId = req.params.movieId;

    const result = await MovieRating.aggregate([
      { $match: { movieId: new mongoose.Types.ObjectId(movieId) } },
      {
        $group: {
          _id: "$movieId",
          avgRating: { $avg: "$rating" },
          totalUsers: { $sum: 1 }
        }
      }
    ]);

    if (result.length === 0) {
      return res.status(200).json({ avgRating: 0, totalUsers: 0 });
    }

    res.status(200).json(result[0]);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}

// Get all reviews for a movie
export async function getMovieReviews(req, res) {
  try {
    const movieId = req.params.movieId;

    const reviews = await MovieRating.find({ movieId })
      .populate("userId", "name email") // populate user details
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: reviews.length,
      reviews
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}

// Delete user's rating
export async function deleteRating(req, res) {
  try {
    const movieId = req.movieId;
    const userId = req.ratingUserId;

    const deleted = await MovieRating.findOneAndDelete({ movieId, userId });

    if (!deleted) {
      return res.status(404).json({ message: "Rating not found" });
    }

    res.status(200).json({ message: "Rating deleted successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "server error" });
  }
}