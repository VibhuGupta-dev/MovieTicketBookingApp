import SeatBooking from "../models/SeatBooking.js";

export const createSeatBooking = async (req, res) => {
    try {
        
        const { ShowId, TimeSlotId } = req.params;

       
        const userId = req.userId

        const { seatsId } = req.body;

   
        if (!ShowId || !TimeSlotId || !userId) {
            return res.status(400).json({ message: "ShowId, TimeSlotId and userId are required" });
        }

        if (!seatsId || seatsId.length === 0) {
            return res.status(400).json({ message: "At least one seat is required" });
        }

        const conflictingBooking = await SeatBooking.findOne({
            ShowId,
            TimeSlotId,
            seatsId: { $in: seatsId },
            $or: [
                { isBooked: true },
                { isLocked: true, lockedUntil: { $gt: new Date() } }
            ]
        });

        if (conflictingBooking) {
            return res.status(409).json({ message: "One or more seats are already booked or locked" });
        }

        const now = new Date();
        const LOCK_DURATION_MS = 10 * 60 * 1000; 

        const newBooking = await SeatBooking.create({
            ShowId,
            TimeSlotId,
            userId,
            seatsId,
            isBooked: false,
            isLocked: true,
            lockedAt: now,
            lockedUntil: new Date(now.getTime() + LOCK_DURATION_MS),
        });

        return res.status(201).json({
            message: "Seats locked successfully",
            booking: newBooking,
        });

    } catch (err) {
        console.error("createSeatBooking error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};