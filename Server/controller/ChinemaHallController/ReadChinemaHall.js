import Cinema from "../../models/CinemaHallSchema.js"

export async function getcinemahall (req , res) {
    try{
        const userID = req.userId
        if(!userID){
            return res.status(400).json({message : "user id not found"})
        }
        const movieID = req.params.chinemahallID
        if(!movieID) {
            return res.status(400).json({message : "moovieId Not there"})
        }
        const moviehall = await Cinema.find({userId : userID })
        if(!moviehall) {
             return res.status(400).json({message : "movie hall not found"})
        }
        return res.status(200).send(moviehall)
    }catch(err){
      return res.status(500).json({message : " error in movie hall read controller"})
    }
}