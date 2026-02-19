import mongoose from "mongoose";

const CinemaHallSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    MovieId: [
      {
        MovieId: { type: mongoose.Schema.Types.ObjectId },
      },
    ],
    row: Number,
    seatsPerRow: Number,
    StateId: {
      type: String,
      required: true,
    },
    CityId: {
      type: String,
      required: true,
    },
    seats: [
      {
        seatno: { type: String },
        rate: { type: Number },
      },
    ],
    cinemaHallName: String,
    description: String,
    locationLink: String,
    address: String,
    location: {
      latitude: String,
      longitude: String,
    },
    logo: String,
  },
  { timestamps: true },
);

const Cinema = mongoose.model("Cinema", CinemaHallSchema);
export default Cinema;