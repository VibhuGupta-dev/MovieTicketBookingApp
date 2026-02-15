import Navbar from "../Components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MovieInfoPage() {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    let mounted = true;

    const fetchMovie = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/movie/api/getmovie/${id}`
        );
        const data = response.data || {};
        if (mounted) {
          setMovie(data);
        }
      } catch (err) {
        console.error("Failed to fetch movie:", err);
        if (mounted) setError(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchMovie();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleBookSeats = () => {
    navigate('/cinema', { state: { movieId: id, movieName: movie?.MovieName } });
  };

  if (isLoading)
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Loading movie details...</p>
          </div>
        </div>
      </>
    );

  if (error || !movie)
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
          <div className="text-center max-w-md mx-4">
            <div className="text-5xl mb-4">🎬</div>
            <div className="text-gray-900 dark:text-gray-100 text-xl font-semibold mb-2">
              Unable to load movie
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {error?.message || "Please try again later."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-purple-700"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[450px] md:h-[550px] bg-gray-900 dark:bg-black">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={movie.MovieBackgroundPhoto || movie.MoviePhoto}
            alt={movie.MovieName}
            className="w-full h-full object-cover opacity-40 dark:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent dark:from-black dark:via-black/70"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 md:px-8 flex items-end pb-12">
          <div className="flex flex-col md:flex-row gap-8 items-end w-full">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <img
                src={movie.MoviePhoto}
                alt={movie.MovieName}
                className="w-44 h-64 md:w-52 md:h-80 object-cover rounded-lg shadow-2xl"
              />
            </div>

            {/* Movie Info */}
            <div className="text-white flex-1 pb-2">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {movie.MovieName}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
                {movie.Moviegenre && (
                  <span className="text-gray-300 dark:text-gray-400">{movie.Moviegenre}</span>
                )}
                
                {movie.MovieReleaseDate && (
                  <>
                    <span className="text-gray-500 dark:text-gray-600">•</span>
                    <span className="text-gray-300 dark:text-gray-400">
                      {new Date(movie.MovieReleaseDate).getFullYear()}
                    </span>
                  </>
                )}

                {movie.MovieLength && (
                  <>
                    <span className="text-gray-500 dark:text-gray-600">•</span>
                    <span className="text-gray-300 dark:text-gray-400">{movie.MovieLength} min</span>
                  </>
                )}

                {movie.MovieLanguage && (
                  <>
                    <span className="text-gray-500 dark:text-gray-600">•</span>
                    <span className="text-gray-300 dark:text-gray-400">{movie.MovieLanguage}</span>
                  </>
                )}

                {movie.MovieType && (
                  <>
                    <span className="text-gray-500 dark:text-gray-600">•</span>
                    <span className="text-gray-300 dark:text-gray-400 uppercase">{movie.MovieType}</span>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleBookSeats}
                  className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium transition-colors hover:bg-purple-700"
                >
                  Book Seats
                </button>

                {movie.MovieTrailer && (
                  <a
                    href={movie.MovieTrailer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-lg font-medium border border-white/20 transition-colors hover:bg-white/20"
                  >
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          
          {/* About Section */}
          {movie.MovieDescription && (
            <section className="mb-16">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">About</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
                {movie.MovieDescription}
              </p>
            </section>
          )}

          {/* Cast Section */}
      {/* Cast Section */}
{movie.cast && movie.cast.length > 0 && (
  <section className="mb-16">
    <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Cast</h2>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {movie.cast.map((actor, index) => (
        <div key={actor._id || index} className="text-center">
          <div className="mb-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
            {actor.ActorPhoto ? (
              <img
                src={actor.ActorPhoto}
                alt={actor.ActorName}
                className="w-full aspect-[2/3] object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const placeholder = document.createElement('div');
                  placeholder.className = 'w-full aspect-[2/3] flex items-center justify-center bg-gray-100 dark:bg-gray-800';
                  placeholder.innerHTML = `
                    <svg class="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  `;
                  e.target.parentElement.appendChild(placeholder);
                }}
              />
            ) : (
              <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
            {actor.ActorName}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {actor.RoleInMovie}
          </p>
        </div>
      ))}
    </div>
  </section>
)}
          {/* Details Section */}
          <section className="border-t border-gray-200 dark:border-gray-800 pt-12">
            <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-gray-100">Details</h2>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 max-w-4xl">
              {movie.MovieName && (
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Title</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm text-right">
                    {movie.MovieName}
                  </span>
                </div>
              )}

              {movie.Moviegenre && (
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Genre</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {movie.Moviegenre}
                  </span>
                </div>
              )}

              {movie.MovieLength && (
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Duration</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {movie.MovieLength} minutes
                  </span>
                </div>
              )}

              {movie.MovieReleaseDate && (
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Release Date</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {new Date(movie.MovieReleaseDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {movie.MovieLanguage && (
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Language</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm">
                    {movie.MovieLanguage}
                  </span>
                </div>
              )}

              {movie.MovieType && (
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Format</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium text-sm uppercase">
                    {movie.MovieType}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* CTA Section */}
          <div className="mt-16 bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-12 text-center transition-colors">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Ready to Watch?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Book your seats now for the best viewing experience
            </p>
            <button
              onClick={handleBookSeats}
              className="bg-purple-600 text-white px-10 py-3 rounded-lg font-medium transition-colors hover:bg-purple-700"
            >
              Book Seats Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}