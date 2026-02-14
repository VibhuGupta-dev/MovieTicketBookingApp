import { isAdminloggedin } from "../middleware/isAdminLoggedIn.js";
import express from "express"
import { addmovie } from "../controller/MovieController/addmoviecontroller.js";
import { updatemovie } from "../controller/MovieController/Updatemoviecontroller.js";
import { getmovie,getallmovies } from "../controller/MovieController/getmoviecontroller.js";
import { deletemovie } from "../controller/MovieController/removemoviecontroller.js";
import { get } from "mongoose";

const router =  express.Router()

router.post('/api/addmovie' , isAdminloggedin , addmovie)
router.put('/api/updatemovie/:movieId' , isAdminloggedin , updatemovie)
router.get('/api/getmovie/:movieId' , getmovie)
router.get('/api/allmovie' , getallmovies )
router.delete('/api/delete/:movieId' , isAdminloggedin , deletemovie)
export default router