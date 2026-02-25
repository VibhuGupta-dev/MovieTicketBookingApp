import ticket from "../../models/MovieTicketBookingSchema.js";

export async function getticket(req, res) {
  try {
    const { ticketId } = req.query; // ✅ use query params for GET
    if (!ticketId) {
      return res.status(400).json({ message: "ticket id not there" });
    }
    const foundTicket = await ticket.findById(ticketId); // ✅ findById, not find
    if (!foundTicket) {
      return res.status(404).json({ message: "ticket not found" });
    }
    res.status(200).json({ ticket: foundTicket });

     await Show.findByIdAndUpdate(
      ticket.ShowId,
      {
        $push: {
          "timeSlots.$[slot].bookedSeatIds": { $each: ticket.SeatIds },
        },
      },
      {
        arrayFilters: [{ "slot._id": ticket.TimeSlotId }],
        new: true,
      }
    );
    
  } catch (err) {
    return res.status(500).json({ message: "err in get ticket", error: err.message });
  }
}