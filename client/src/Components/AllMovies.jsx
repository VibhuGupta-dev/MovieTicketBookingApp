import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AllMovies() {
 
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleOnClick = (id) => {
    navigate(`/Movie/${id}`);
  };

  useEffect(() => {
    let mounted = true;

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/movie/api/allmovie"
        );
        const data = response.data || [];
        console.log(data);
        if (mounted) {
          setMovies(data);
          
        }
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchMovies();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) 
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        Loading movies...
      </div>
    );

  if (error) 
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        Failed to load movies.
      </div>
    );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {movies.map((movie, index) => (
        <div
          key={movie._id || index}
          onClick={() => handleOnClick(movie._id)}
          className="cursor-pointer group"
        >
          <div className="relative mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <img
              className="w-full aspect-[2/3] object-cover transition-transform group-hover:scale-105"
              src={movie.MoviePhoto}
              alt={movie.title || movie.MovieName || "Movie poster"}
            />
          </div>
          
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {movie.title || movie.MovieName || "Untitled"}
          </h2>
          
          <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{movie.Moviegenre || "Genre"}</span>
            <span>•</span>
            <span>{movie.MovieLanguage}</span>
          </div>
        </div>
      ))}
    </div>
  );
}