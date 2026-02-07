import { isAdminloggedin } from "../middleware/isAdminLoggedIn.js";
import express from "express"
import { addmovie } from "../controller/MovieController/addmoviecontroller.js";
import { updatemovie } from "../controller/MovieController/Updatemoviecontroller.js";

const router =  express.Router()

router.post('/api/addmovie' , isAdminloggedin , addmovie)
router.put('/api/updatemovie/:movieId' , isAdminloggedin , updatemovie)
export default router