import mongoose from "mongoose";

const CinemaHallSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    cinemaHallName: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    locationLink: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    logo: {
      type: String
    }
  },
  { timestamps: true }
);

const Cinema = mongoose.model("Cinema", CinemaHallSchema);
export default Cinema;
