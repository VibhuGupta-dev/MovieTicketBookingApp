import express, { Router } from "express"
import RegisterUserController from "../controller/AuthController/RegisterUserController.js"
const router = express.Router()

router.post('/api/register' , RegisterUserController)

export default router