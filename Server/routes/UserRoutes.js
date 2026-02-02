import express, { Router } from "express"
import {registerUser , verifyOtp} from "../controller/AuthController/RegisterUserController.js"
import { loginUser } from "../controller/AuthController/LoginUserController.js"
import { LogoutUser } from "../controller/AuthController/LogoutUserController.js"
import { forgotpass, verifyforogtpass } from "../controller/AuthController/ForgotPassword.js"
const router = express.Router()

router.post('/api/register' , registerUser)
router.post('/api/verifyOTP' , verifyOtp)
router.post('/api/login' , loginUser)
router.post('/api/logout' , LogoutUser)
router.post('/api/forgotpass' , forgotpass)
router.post("/api/veryfyforgototp" , verifyforogtpass)

export default router