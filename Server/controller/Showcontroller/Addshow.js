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
     
     const {showDate , timeSlot , pricePerSeat} = req.body
      if(!showDate || !timeSlot || !pricePerSeat) {
        return res.status(400).json({message  : "any of the field is empty"})
      }

     const slot = await Show.create({
        UserId : userId,
        movieId:movieId,
        cinemaId : cinemaId,
        showDate ,
        timeSlot ,
        pricePerSeat
     })
     if(!slot) { 
        return res.status(400).json({message : "slot not created"})
     }

     return res.status(200).send(slot)

    }catch(err) {
         return res.status(500).json({message : "error in add slot"})
    }
}