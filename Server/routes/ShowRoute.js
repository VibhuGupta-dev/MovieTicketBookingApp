import express from "express"
import { isownerloggedin } from "../middleware/IsOwnerLoggedIn"

const router = express.Router()

router.post('/addshow/:cinemahallId' , isownerloggedin , )