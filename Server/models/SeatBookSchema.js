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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    seatsId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Seat",
        }
    ],
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

export default mongoose.model("SeatBooking", seatBookingSchema);