import express from "express"
//import { isuserloggedin } from "../middleware/isUserLoggedIn.js"
import { createSeatBooking } from "../controller/BookseatController/Bookseat.js"
import { getbookseat } from "../controller/BookseatController/GetBookedSeat.js"
import { deleteSeatBooking } from "../controller/BookseatController/DeleteSeat.js"

const router = express.Router()

router.post('/api/bookseat/:ShowId/:TimeSlotId', createSeatBooking)
router.get('/api/getbookedseat/:LockedSeatId' , getbookseat)
router.delete('/api/deletebookseat/:bookingId', deleteSeatBooking);
export default router