import Show from "../../models/ShowSchema.js";
import Cinema from "../../models/CinemaHallSchema.js";

export async function getShow(req, res) {
  try {
    const { MovieId, date } = req.params;
    const { StateId, CityId } = req.query;

    console.log("MovieId:", MovieId);
    console.log("date:", date);
    console.log("StateId:", StateId, "CityId:", CityId);

    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);

    const query = {
      movieId: MovieId,
      showDate: { $gte: startDate, $lte: endDate },
    };

    if (StateId && CityId) {
      const cinemas = await Cinema.find({ StateId, CityId }); 
      if(cinemas.length === 0) {
        return res.json({message : "not found" , cinemas})
      } 
      console.log("Cinemas found:", cinemas.length);
      console.log(cinemas , "dd")
      if (cinemas.length > 0) {
        const cinemaIds = cinemas.map((c) => c._id);
        query.cinemaId = { $in: cinemaIds };
      }
    }

    const shows = await Show.find(query).populate("cinemaId");
    if(!shows) {
      return res.status(400).json({message :  "show not found"})
    }
    console.log("Shows found:", shows.length);

    return res.status(200).json(shows); 

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "error in get show" });
  }
}

export async function getShowId(req , res) {
   try {
          const showId = req.params.showId

          if(!showId) {
              return res.status(400).json({message : "showid not found"})
          }
      
          const show = await Show.find({_id : showId})
          console.log(show)
            if(!show) {
              return res.status(400).json({message : "show not found"})
            }
  
            return res.status(200).send(show)
      }catch(err) {
          return res.status(500).json({message : "error in getshowid"})
      }
}