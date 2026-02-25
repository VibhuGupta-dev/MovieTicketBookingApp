import express, { Router } from "express"
import {registerUser , verifyOtp} from "../controller/AuthController/RegisterUserController.js"
import { loginUser } from "../controller/AuthController/LoginUserController.js"
import { LogoutUser } from "../controller/AuthController/LogoutUserController.js"
import { forgotpass, verifyforogtpass } from "../controller/AuthController/ForgotPassword.js"
import User from "../models/UserSchema.js"
import jwt from "jsonwebtoken";


const router = express.Router()

router.post('/api/register' , registerUser)
router.post('/api/verifyOTP' , verifyOtp)
router.post('/api/login' , loginUser)
router.post('/api/logout' , LogoutUser)
router.post('/api/forgotpass' , forgotpass)
router.post("/api/veryfyforgototp" , verifyforogtpass)
router.get('/api/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not logged in" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
});
export default router