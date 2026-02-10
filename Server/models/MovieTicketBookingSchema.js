import mongoose from "mongoose";

const movieticketSchema = mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  MovieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },

  CinemaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cinema",
    required: true,
  },

  SeatIds: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Seat",
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "At least one seat must be selected",
    },
  },

  TimeSlotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TimeSlot",
    required: true,
  },

  isQRgenerated: {
    type: Boolean,
    default: false,
  },
  Amount : {
  type : Number
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  }
});

const ticket = mongoose.model("Ticket", movieticketSchema);

export default ticket;
