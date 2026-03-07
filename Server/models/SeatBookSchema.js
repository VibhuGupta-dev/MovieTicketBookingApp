import mongoose from "mongoose";

const seatBookingSchema = mongoose.Schema({
    ShowId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true,
    },
    TimeSlotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TimeSlot",
        required: true,
    },
    seatsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seat",
        }
    ],
    BookingRefrence: {
        type: String
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    isLocked: {
        type: Boolean,
        default: false,
    },
    lockedAt: {
        type: Date,
        default: null,
    },
    lockedUntil: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

seatBookingSchema.index(
    { lockedUntil: 1 },
    {
        expireAfterSeconds: 0,
        partialFilterExpression: { isBooked: false }
    }
);

export default mongoose.model("SeatBooking", seatBookingSchema);