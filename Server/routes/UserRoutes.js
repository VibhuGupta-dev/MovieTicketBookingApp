import express, { Router } from "express"
import {registerUser , verifyOtp} from "../controller/AuthController/RegisterUserController.js"
const router = express.Router()

router.post('/api/register' , registerUser)
router.post('/api/verifyOTP' , verifyOtp)
export default router