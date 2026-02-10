import express from "express"
import { calculateTotal } from "../controller/TicketBookingController/BookTicket.js"
import { isuserloggedin } from "../middleware/isUserLoggedIn.js"

const router = express.Router()

router.post('/api/bookticket/:movieId/:cinemahallId/:showId' , isuserloggedin , calculateTotal)

export default router