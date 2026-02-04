import express from "express";
import { Router } from "express";
import { addChinemaHall } from "../controller/ChinemaHallController/AddCinemaHall.js";
import { isUserloggedin } from "../middleware/isUserLoggedIn.js";
import { isownerloggedin } from "../middleware/IsOwnerLoggedIn.js";
const router = express.Router()

router.post('/api/addchinemahall' , isownerloggedin , addChinemaHall)

export default router