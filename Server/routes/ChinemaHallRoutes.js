import express from "express";
import { Router } from "express";
import { addChinemaHall } from "../controller/ChinemaHallController/AddCinemaHall.js";
import { isownerloggedin } from "../middleware/IsOwnerLoggedIn.js";
import { deletecinemahall } from "../controller/ChinemaHallController/DeleteCinemaHall.js";
import { getcinemahall } from "../controller/ChinemaHallController/ReadChinemaHall.js";
import { updateStore } from "../controller/ChinemaHallController/UpdateCinemaHall.js";
import {ReadcinemaWithLocation} from "../controller/ChinemaHallController/ReadCinema_movie_location.js"
const router = express.Router()

router.post('/api/addchinemahall' , isownerloggedin , addChinemaHall)
router.delete('/api/deletecinemahall/:chinemahallID' , isownerloggedin , deletecinemahall)
router.get('/api/getcinemahall/:chinemahallID' , isownerloggedin , getcinemahall)
router.put('/api/updatecinemahall/:chinemahallID', isownerloggedin , updateStore )
router.get('/api/getcinemalocation' , ReadcinemaWithLocation)
export default router