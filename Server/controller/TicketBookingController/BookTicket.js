import Cinema from "../../models/CinemaHallSchema.js";
import Movie from "../../models/MovieSchema.js";
import User from "../../models/UserSchema.js";
import ticket from "../../models/MovieTicketBookingSchema.js";
import { Server } from "socket.io";
import { server } from "../../App.js";

export function lockticket(req, res) {
  try {
    const SocketId = [];
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("user Connected", socket.id);
      SocketId.push(socket.id);
      console.log("active user", socket.id);

      socket.on("lockseat", (data) => {
        io.emit("seatlocked", data);
      });
    });

    return res.status(200).json({ message: "socket running" });
  } catch (err) {
    return res.status(500).json({ message: "error in lockticket" });
  }
}

export async function BookTicket(req, res) {
  try {
    const userID = req.userId;
    const movieId = req.params.movieId;

    if (!movieId) {
      return res.status(400).json({ message: "MOVIE ID NOT THERE" });
    }

    const cinemahallId = req.params.cinemahallId;
    if (!cinemahallId) {
      return res.status(400).json({ message: "cinemahallid ID NOT THERE" });
    }

    const timeslotId = req.params.timeslotId;
    if (!timeslotId) {
      return res.status(400).json({ message: "TimeSlotid ID NOT THERE" });
    }
    const seats = []
    const { seatId } = req.body
    if (!seatId) {
      return res.status(400).json({ message: "seat id require" });
    }

    const movie = await Movie.findById(movieId)
    if(!movie) { 
        return res.status(400).json({message : "movie not found"})
    }
    const cinema = await Cinema.findById(cinemahallId )
    if(!cinema) {
        return res.status(400).json({message : "cinema not found"})
    }
    const seat = cinema.seats.find(s => s._id.toString() === seatId)
    if(!seat){
        return res.status(400).json({message : "seat not found"})
    }
    if(seat.isBooked == true) {
     return req.status(400).json({message : "seat alreedy booked"})
    }

    seats.push(seatId)
    console.log(seats)
    
    


  
  } catch (err) {
    return res.status(500).json({ message: "error in Book ticket" });
  }
}
