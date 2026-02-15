import Movie from "../../models/MovieSchema.js";

export async function getmovie(req , res) {
    try {
     const movieId = req.params.movieId
     if(!movieId) {
        return res.status(400).json({message : "no movieId"})
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

export async function getallmovies(req , res) {
    try {
       const movie = await Movie.find()
       console.log(movie)
        if(!movie){
            return res.status(400).json({message : "no movie found"})
        }
            return res.status(201).send(movie)

    }catch(err){
       return res.status(500).json({message : "error in get all movie"})
    }
}