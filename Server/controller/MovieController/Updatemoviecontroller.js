import Movie from "../../models/MovieSchema.js"

export async function updatemovie (req , res) {
    try {
      const {
      MovieName,
      MovieLength,
      Moviegenre,
      cast,
      MovieTrailer,
      MovieReleaseDate,
      MovieType,
      MovieLanguage,
      MoviePhoto,
      MovieBackgroundPhoto,
      MovieDescription} = req.body
    console.log( MovieName,
      MovieLength,
      Moviegenre,
      cast,
      MovieTrailer,
      MovieReleaseDate,
      MovieType,
      MovieLanguage,
      MoviePhoto,
      MovieBackgroundPhoto,
      MovieDescription)

    const movieId = req.params.movieId
    if(!movieId) {
        return res.status(400).json({message : "movieid not there"})
    }
    console.log(movieId)

    const userID = req.userId
    console.log(userID)
    if(!userID) {
        return res.status(400).json({message : "userid not there"})
    }
    const find = await Movie.findOne({userId : userID})
    console.log(find)
    const updatemovie = await Movie.findByIdAndUpdate(movieId , {
      MovieName,
      MovieLength,
      Moviegenre,
      cast,
      MovieTrailer,
      MovieReleaseDate,
      MovieType,
      MovieLanguage,
      MoviePhoto,
      MovieBackgroundPhoto,
      MovieDescription
    }, { new: true } )
    console.log(updatemovie)
    if(!updatemovie) {
        return res.status(400).json({message : "not updated"})
    }
         
    return res.status(200).send(updatemovie)

    }catch(err){
        return res.status(500).json({message : "error in updatemovie"})
    }
}