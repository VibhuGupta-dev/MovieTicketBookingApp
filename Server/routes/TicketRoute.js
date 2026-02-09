import express from "express"
import { BookTicket } from "../controller/TicketBookingController/BookTicket.js"
import { isuserloggedin } from "../middleware/isUserLoggedIn.js"

const router = express.Router()

router.post('/api/bookticket/:movieId/:cinemahallId/:timeslotId/:seatId' , isuserloggedin , BookTicket)

export default router