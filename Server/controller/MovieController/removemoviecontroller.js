import Movie from "../../models/MovieSchema.js"

export async function deletemovie(req , res) {
    try {
    const movieID = req.params.movieId
    if(!movieID) {
        return res.status(400).json({message : "movie id not there"})
    }
    const userID = req.userId
    if(!userID) {
        return res.status(400).json({message : "userID not there"})
    }
    const deletemovie  = await Movie.findByIdAndDelete(movieID)
    if(!deletemovie) { 
        return res.status(400).json({message : "movie not deleted"})
    }
    return res.status(200).send(deletemovie , {message : `movie deletd`})

    }catch(err) {
        return res.status(500).json({message : "error in delete movie"})
    }
}