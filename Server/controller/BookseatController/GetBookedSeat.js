
import SeatBookSchema from "../../models/SeatBookSchema.js";


export async  function getbookseat (req , res) {
    try {
        const LockedSeatId = req.params.LockedSeatId
        if(!LockedSeatId) {
            return res.status(400).json({message : "lockedseatid not found"})
        }
    
        const lockedseat = await SeatBookSchema.find({_id : LockedSeatId})
        console.log(lockedseat)
          if(!lockedseat) {
            return res.status(400).json({message : "locked seat not found"})
          }

          return res.status(200).send(lockedseat)
    }catch(err) {
        return res.status(500).json({message : "error in getbookedseat"})
    }
}