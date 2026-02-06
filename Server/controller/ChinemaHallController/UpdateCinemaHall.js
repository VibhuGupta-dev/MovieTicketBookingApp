import Cinema from "../../models/CinemaHallSchema.js";

 export async function updateStore(req , res) {
    try {
       const userId  = req.userId
       if(!userId){
        return res.status(400).json({message : "userID not founr"})
       }
       const movieid = req.params.chinemahallID

       if(!movieid) {
        return res.stauts(400).json({message : "movieid not there"})
       }

       const update = await Cinema.findOneAndUpdate({userId : userId , _id : movieid} , {
        cinemaHallName,
        description,
        locationLink,
        address,
        logo
       })

       if(!update) {
        return res.status(400).json({"message" : "not find updated"})
       }

     return res.status(200).json(update)
     
    }catch(err) {
        return res.status(500).json({message : "error in update function"})
    }
 }