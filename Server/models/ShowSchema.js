import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },

  cinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema",
    required: true,
  },

  showDate: {
    type: Date,
    required: true,
  },
  ScreenNumber: {
    type: Number,
    required: true,
  },
  timeSlots: [
    {
      time: { type: String, required: true },
      bookedSeatIds: [{ type: mongoose.Schema.Types.ObjectId }],
    },
  ],
});

const Show = mongoose.model("Show", showSchema);
export default Show;
