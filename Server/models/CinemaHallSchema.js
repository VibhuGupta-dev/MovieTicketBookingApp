import mongoose from "mongoose";

const CinemaHallSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  row: Number,
  seatsPerRow: Number,

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

  logo: String,
}, { timestamps: true });

const Cinema = mongoose.model("Cinema", CinemaHallSchema);
export default Cinema;
