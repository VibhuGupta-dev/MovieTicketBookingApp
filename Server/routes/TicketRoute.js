import express from "express"
import { calculateTotal } from "../controller/TicketBookingController/BookTicket.js"
import { isuserloggedin } from "../middleware/isUserLoggedIn.js"
import { getticket, getticketid } from "../controller/TicketBookingController/GetTicket.js"

const router = express.Router()

router.post('/api/bookticket/:movieId/:cinemahallId/:showId' , isuserloggedin , calculateTotal)
router.get('/api/getticket',isuserloggedin , getticket) 
router.get('/api/:ticketId' , isuserloggedin , getticketid)
export default router