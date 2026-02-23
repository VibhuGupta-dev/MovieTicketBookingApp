// Bookseat.js controller mein

import SeatBooking from "../../models/SeatBookSchema.js";

// ✅ Random booking reference generator
const generateBookingRef = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "BK-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref; // e.g. BK-A3X9KP2M
};

export const createSeatBooking = async (req, res) => {
  try {
    const { ShowId, TimeSlotId } = req.params;
    const { seatsId } = req.body;

    if (!ShowId || !TimeSlotId) {
      return res.status(400).json({ message: "ShowId and TimeSlotId are required" });
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

    // ✅ Generate unique ref — retry if duplicate exists
    let bookingRef;
    let isUnique = false;
    while (!isUnique) {
      bookingRef = generateBookingRef();
      const existing = await SeatBooking.findOne({ BookingRefrence: bookingRef });
      if (!existing) isUnique = true;
    }

    const newBooking = await SeatBooking.create({
      ShowId,
      TimeSlotId,
      seatsId,
      BookingRefrence: bookingRef, // ✅ save generated ref
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