import express from "express"
//import { isuserloggedin } from "../middleware/isUserLoggedIn.js"
import { createSeatBooking } from "../controller/BookseatController/Bookseat.js"
import { getbookseat } from "../controller/BookseatController/GetBookedSeat.js"
import { deleteSeatBooking } from "../controller/BookseatController/DeleteSeat.js"
import { isuserloggedin } from "../middleware/isUserLoggedIn.js"
const router = express.Router()

router.post('/api/bookseat/:ShowId/:TimeSlotId' ,isuserloggedin ,  createSeatBooking)
router.get('/api/getbookedseat/:LockedSeatId'  , getbookseat)
router.delete('/api/deletebookseat/:bookingId',isuserloggedin , deleteSeatBooking);
export default router