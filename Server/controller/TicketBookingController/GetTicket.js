import ticket from "../../models/MovieTicketBookingSchema.js";
import Cinema from "../../models/CinemaHallSchema.js";
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
    const yticket = await ticket
      .findById(req.params.ticketId)
      .populate("ShowId")
      .populate("UserId", "name email")
    

    if (!yticket) return res.status(404).json({ message: "Ticket not found" })

    const cinema = await Cinema.findOne({
      "seats._id": { $in: yticket.SeatIds }
    })

    const bookedSeats = cinema
      ? cinema.seats
          .filter(seat =>
            yticket.SeatIds.map(id => id.toString()).includes(seat._id.toString())
          )
          .map(seat => ({ seatno: seat.seatno, rate: seat.rate }))
      : []

    res.json({
      yticket,
      bookedSeats,
      cinemaName: cinema?.cinemaHallName ?? null
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed", error: err.message })
  }
}