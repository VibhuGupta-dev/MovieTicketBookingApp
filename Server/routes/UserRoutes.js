import express from "express"
import { registerUser, verifyOtp } from "../controller/AuthController/RegisterUserController.js"
import { loginUser } from "../controller/AuthController/LoginUserController.js"
import { LogoutUser } from "../controller/AuthController/LogoutUserController.js"
import { forgotpass, verifyforogtpass } from "../controller/AuthController/ForgotPassword.js"
import User from "../models/UserSchema.js"
import { isuserloggedin } from "../middleware/isUserLoggedIn.js"
import Ticket from "../models/MovieTicketBookingSchema.js"  // ✅ new

const router = express.Router()

router.post('/api/register', registerUser)
router.post('/api/verifyOTP', verifyOtp)
router.post('/api/login', loginUser)
router.post('/api/logout', LogoutUser)
router.post('/api/forgotpass', forgotpass)
router.post("/api/veryfyforgototp", verifyforogtpass)

router.get('/api/me', isuserloggedin, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password")
    res.json({ user })
  } catch {
    res.status(401).json({ message: "Invalid token" })
  }
})

// ✅ Ticket fetch route
router.get('/api/ticket/:ticketId', isuserloggedin, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId)
      .populate("ShowId", "title")
      .populate("SeatIds", "seatNumber")

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" })
    }

    if (ticket.UserId.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    res.json({ ticket })
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ticket", error: err.message })
  }
})

export default router