import mongoose from "mongoose";

const movieRatingSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    review: {
      type: String,
      trim: true,
      minlength: 5,
      maxlength: 500
    }
  },
  { timestamps: true }
);

movieRatingSchema.index({ movieId: 1, userId: 1 }, { unique: true });

export default mongoose.model("MovieRating", movieRatingSchema);