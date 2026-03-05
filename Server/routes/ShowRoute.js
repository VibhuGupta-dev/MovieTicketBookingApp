import express from "express";
import { isownerloggedin } from "../middleware/IsOwnerLoggedIn.js";

import { addshow } from "../controller/Showcontroller/Addshow.js";
import { getShow , getShowId} from "../controller/Showcontroller/GetShow.js";
import { updateShow } from "../controller/Showcontroller/UpdateShow.js";
import { deleteShow } from "../controller/Showcontroller/DeleteShow.js";
import Show from "../models/ShowSchema.js";
const router = express.Router();

router.post("/addshow/:cinemaId/:movieId", isownerloggedin, addshow);

router.get("/getshow/:MovieId/:date", getShow);

router.get("/getshow/:showId", getShowId)

router.put("/updateshow/:showId", isownerloggedin, updateShow);

router.delete("/deleteshow/:showId", isownerloggedin, deleteShow);
router.get("/getshowbycinema/:cinemaId", async (req, res) => {
  try {
    const { cinemaId } = req.params;
    
    const shows = await Show.find({ cinemaId })
      .populate("movieId", "MovieName MoviePhoto")  
      .sort({ showDate: 1 });

    return res.status(200).json(shows);
  } catch (err) {
    return res.status(500).json({ message: "error fetching shows" });
  }
}); 

export default router;
