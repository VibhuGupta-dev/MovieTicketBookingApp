import ticket from "../../models/MovieTicketBookingSchema.js";

export async function getticket(req, res) {
  try {
    const { ticketId } = req.query;
    if (!ticketId) {
      return res.status(400).json({ message: "ticket id not there" });
    }
    const foundTicket = await ticket.findById(ticketId);
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
      },
    );
  } catch (err) {
    return res
      .status(500)
      .json({ message: "err in get ticket", error: err.message });
  }
}

export async function getticketid(req, res) {
  try {
    console.log("hey")
    const yticket = await ticket.findById(req.params.ticketId)
    
   console.log(yticket)
    if (!yticket) return res.status(404).json({ message: "Ticket not found" })
  

    res.json({ yticket })  // ✅ bas yahi enough hai
  } catch (err) {
    res.status(500).json({ message: "Failed", error: err.message })
  }
}