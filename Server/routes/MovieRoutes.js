import { isAdminloggedin } from "../middleware/isAdminLoggedIn.js";
import express from "express"
import { addmovie } from "../controller/MovieController/addmoviecontroller.js";
import { updatemovie } from "../controller/MovieController/Updatemoviecontroller.js";
import { getmovie } from "../controller/MovieController/getmoviecontroller.js";

const router =  express.Router()

router.post('/api/addmovie' , isAdminloggedin , addmovie)
router.put('/api/updatemovie/:movieId' , isAdminloggedin , updatemovie)
router.get('/api/getmovie/:movieId' , getmovie)
router.delete('/api/delete/:movieId')
export default router