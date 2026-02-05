import Cinema from "../../models/CinemaHallSchema.js"

export async function deletecinemahall(req , res) {

    try {
        const cinemahall = req.params.chinemahallID
        if(!cinemahall) {
            return res.status(400).json({message : "cinemahallID not there"})
        }
        const userID = req.userId 
        console.log(cinemahall , userID)

        const findcinemahall = await Cinema.findOneAndDelete({_id : cinemahall })
        
         if(!cinemahall){
            return res.status(400).json({message : "cinemahallID is not there in params"})
         }

         return res.status(200).json({message : "cinemahall deleted "})

    }catch(err){
        return res.status(500).json({message : "error in deletecinma hall"})
    }
}

