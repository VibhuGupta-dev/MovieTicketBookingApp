import express from "express"
import { isuserloggedin } from "../middleware/isUserLoggedIn"
import { createSeatBooking } from "../controller/BookseatController/Bookseat"

const router = express.Router()

router.post('/api/bookseat/:ShowId/TimeSlotId' , isuserloggedin , createSeatBooking )

export default router