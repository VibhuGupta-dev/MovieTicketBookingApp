import Show from "../../models/ShowSchema.js"

export async function addshow(req , res) {
    try {
     const userId = req.userId
     const movieId = req.params.movieId
     if(!movieId) {
        return res.status(400).json({message : "movie id not there"})
     }
     const cinemaId = req.params.cinemaId
     if(!cinemaId) {
        return res.status(400).json({message : "cinema id not found"})
     }
     
    // AddShow.js — replace the destructuring and validation
const { showDate, timeSlots } = req.body;

if (!showDate) {
  return res.status(400).json({ message: "showDate is empty" });
}
if (!timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
  return res.status(400).json({ message: "timeSlots is empty" });
}

const slot = await Show.create({
  UserId: userId,
  movieId,
  cinemaId,
  showDate,
  timeSlots,   // ✅ array of { time: "10:00 AM" }
});
     if(!slot) { 
        return res.status(400).json({message : "slot not created"})
     }

     return res.status(200).send(slot)

    }catch(err) {
         return res.status(500).json({message : "error in add slot"})
    }
}