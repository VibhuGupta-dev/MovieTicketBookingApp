

import Cinema from "../../models/CinemaHallSchema.js"

export async function getcinemahall(req, res) {
    try {
     
        const CinemahallID = req.params.cinemahallID

        if (!CinemahallID) {
            return res.status(400).json({ message: "CinemaHall ID not provided" })
        }

        const moviehall = await Cinema.findById(CinemahallID).populate({
            path: "MovieId.MovieId",
            model: "Movie",
            select: "MovieName MovieLength Moviegenre MovieType MovieLanguage MoviePhoto MovieBackgroundPhoto MovieDescription MovieReleaseDate MovieTrailer cast"
        })
       console.log(moviehall)
        if (!moviehall) {
            return res.status(404).json({ message: "Cinema hall not found" })
        }

        return res.status(200).json(moviehall)

    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Error in cinema hall read controller" })
    }
}