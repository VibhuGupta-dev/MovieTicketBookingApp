import Movie from "../../models/MovieSchema.js";
import { redis } from "../../App.js";

export async function getmovie(req, res) {
    try {
        const movieId = req.params.movieId;
        if (!movieId) {
            return res.status(400).json({ message: "no movieId" });
        }
        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "no movie found" });
        }
        return res.status(200).send(movie);
    } catch (err) {
        console.error("Error in getmovie:", err);
        return res.status(500).json({ message: "error in get movie" });
    }
}

export async function getallmovies(req, res) {
    try {

        const cacheExists = await redis.exists("movies");
        
        if (cacheExists) {
            console.log("redis hit");
            const movies = await redis.get("movies");
            return res.json({
                movies: JSON.parse(movies), 
            });
        }

        console.log("redis miss - fetching from DB");
        const movies = await Movie.find();

        if (!movies || movies.length === 0) {
            return res.status(404).json({ message: "no movies found" });
        }

        await redis.setex("movies", 300 , JSON.stringify(movies));

        return res.status(200).send(movies);
    } catch (err) {
        console.error("Error in getallmovies:", err);
        return res.status(500).json({ message: "error in get all movies" });
    }
}