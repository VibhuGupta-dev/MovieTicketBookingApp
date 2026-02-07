import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  MovieName: {
    type: String,
    required: true,
  },

  MovieLength: {
    type: Number,
    required: true,
  },

  Moviegenre: {
    type: String,
    required: true,
  },

  cast: [
    {
      ActorName: { type: String, required: true },
      ActorPhoto: { type: String, required: true },
      RoleInMovie: { type: String, required: true },
    },
  ],

  MovieTrailer: {
    type: String,
    required: true,
  },

  MovieReleaseDate: {
    type: Date,
    required: true,
  },

  MovieType: {
    type: String,
    enum: ["2d", "3d"],
    required: true,
  },

  MovieLanguage: {
    type: String,
  },

  MoviePhoto: {
    type: String,
  },

  MovieBackgroundPhoto: {
    type: String,
  },

  MovieDescription: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
