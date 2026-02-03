import Cinema from "../../models/CinemaHallSchema.js";

export async function addChinemaHall(req , res) {
    try {
       const {cinemaHallName , description , locationLink , address , logo } = req.body;
       if(!cinemaHallName || !description || !locationLink || !address , !logo){
        return res.status(400).json({message : "all fields not filled"})
       }
       const userId = req.userId;
       const cinemaHall = await Cinema.create({
        userId : userId,
        cinemaHallName,
        description,
        locationLink,
        address,
        logo
       })
     if(!cinemaHall){
        return res.status(400).json({message : "chinema hall not created"})
     }
     return res.status(200).json({message : `"chienma hall created" name : ${cinemaHallName}`})
    }catch(err){
        return res.status(500).json({message :  "error in add chinemahall"})
    }
}