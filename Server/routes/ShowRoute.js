import express from "express";
import { isownerloggedin } from "../middleware/IsOwnerLoggedIn.js";

import { addshow } from "../controller/Showcontroller/Addshow.js";
import { getShow } from "../controller/Showcontroller/GetShow.js";
import { updateShow } from "../controller/Showcontroller/UpdateShow.js";
import { deleteShow } from "../controller/Showcontroller/DeleteShow.js";

const router = express.Router();

router.post("/addshow/:cinemaId/:movieId", isownerloggedin, addshow);

router.get("/getshow/:MovieId/:date", getShow);

router.put("/updateshow/:showId", isownerloggedin, updateShow);

router.delete("/deleteshow/:showId", isownerloggedin, deleteShow);

export default router;
