import Cinema from "../../models/CinemaHallSchema.js"

export async function getcinemahall (req , res) {
    try{
       
        const CinemahallID = req.params.cinemahallID
        if(!CinemahallID) {
            return res.status(400).json({message : "moovieId Not there"})
        }
        const moviehall = await Cinema.find({_id : CinemahallID})
        if(!moviehall) {
             return res.status(400).json({message : "movie hall not found"})
        }
        return res.status(200).send(moviehall)
    }catch(err){
      return res.status(500).json({message : " error in movie hall read controller"})
    }
}