import Movie from "../../models/MovieSchema";

export async function getmovie(req , res) {
    try {
     const movieId = req.params.movieId
     if(!movieId) {
        return res.status(400).json({message : "no movieId"})
     }
     const userID = req.userID
     if(!userID) {
                return res.status(400).json({message : "no userid"})
     }
     const movie = await Movie.findById(movieId)
     if(!movie){
        return res.status(400).json({message : "no movie found"})
     }

     return res.status(201).send(movie)
     

    }catch(err){
        return res.status(500).json({message : "error in get movie"})

    }
}