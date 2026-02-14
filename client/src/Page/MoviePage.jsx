import Navbar from "../Components/Navbar";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

export function MoviePage() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMovies, setTotalMovies] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setCurrent(index);
  };

  // Handle touch events for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left
      nextSlide();
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right
      prevSlide();
    }
  };

  // Auto slide
  useEffect(() => {
    if (movies.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [movies, current, isAutoPlaying]);

  // Fetch movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/movie/api/allmovie"
        );
        setMovies(response.data || []);
        setTotalMovies(response.data.length);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (isLoading)
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
          <div className="text-center">
            <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading movies...</p>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-white">
          <div className="text-center max-w-md mx-4">
            <div className="text-6xl mb-4">🎬</div>
            <div className="text-red-600 text-2xl font-bold mb-2">Oops! Something went wrong</div>
            <p className="text-gray-600">{error.message || "Unable to load movies. Please try again later."}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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

      {/* Hero Slider Section */}
      <div 
        ref={sliderRef}
        className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden bg-black"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left Button - Hidden on Mobile */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 lg:h-14 lg:w-14 bg-white/20 backdrop-blur-md hover:bg-purple-600 border-2 border-white/30 hover:border-purple-600 text-white rounded-full shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <svg
            className="h-6 w-6 lg:h-7 lg:w-7 transform group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Slider Container */}
        <div
          className="flex transition-transform duration-1000 ease-out h-full"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {movies.map((movie, index) => (
            <div key={movie._id || index} className="min-w-full relative h-full">
              {/* Background Image with Parallax Effect */}
              <div className="absolute inset-0">
                <img
                  src={movie.MovieBackgroundPhoto || movie.MoviePhoto}
                  alt={movie.MovieName}
                  className="w-full h-full object-cover"
                  style={{
                    transform: current === index ? 'scale(1)' : 'scale(1)',
                    transition: 'transform 10s ease-out'
                  }}
                />
                {/* Mobile-optimized Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 md:via-black/80 to-black/70 md:to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex items-end md:items-center px-4 md:px-6 lg:px-20 pb-24 md:pb-0">
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-12 items-center md:items-end max-w-7xl w-full">
                  {/* Poster - Smaller on Mobile */}
                  <div className="relative group flex-shrink-0">
                    <img
                      src={movie.MoviePhoto}
                      alt={movie.MovieName}
                      className="w-32 h-48 sm:w-40 sm:h-60 md:w-48 md:h-72 lg:w-64 lg:h-96 object-cover rounded-xl md:rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 border-2 md:border-4 border-white/20"
                    />
                    {/* Rating Badge */}
                    {movie.rating && (
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-yellow-500 text-black font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3 md:w-4 md:h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="text-xs md:text-sm">{movie.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Movie Info */}
                  <div className="text-white max-w-2xl text-center md:text-left w-full">
                    {/* Title - Responsive Typography */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-black mb-2 md:mb-4 drop-shadow-2xl leading-tight line-clamp-2">
                      {movie.MovieName}
                    </h1>

                    {/* Meta Info - Stacked on Mobile */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-4 mb-4 md:mb-6">
                      {/* Genre */}
                      {movie.Moviegenre && (
                        <span className="bg-purple-600 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold shadow-lg">
                          {movie.Moviegenre}
                        </span>
                      )}

                      {/* Release Date */}
                      {movie.MovieReleaseDate && (
                        <span className="flex items-center gap-1 md:gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                          <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {new Date(movie.MovieReleaseDate).getFullYear()}
                        </span>
                      )}

                      {/* Duration */}
                      {movie.MovieDuration && (
                        <span className="flex items-center gap-1 md:gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
                          <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {movie.MovieDuration}
                        </span>
                      )}
                    </div>

                    {/* Description - Hidden on Small Mobile, Limited on Mobile */}
                    {movie.MovieDescription && (
                      <p className="hidden sm:block text-sm md:text-base lg:text-lg text-gray-200 mb-4 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-3 drop-shadow-lg">
                        {movie.MovieDescription}
                      </p>
                    )}

                    {/* Action Buttons - Stacked on Mobile */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
                      <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg md:rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 md:gap-3 group w-full sm:w-auto">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                        </svg>
                        <span className="text-base md:text-lg">Book Now</span>
                      </button>

                      <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-semibold py-3 px-6 md:py-4 md:px-8 rounded-lg md:rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 md:gap-3 w-full sm:w-auto">
                        <svg
                          className="w-5 h-5 md:w-6 md:h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-base md:text-lg">More Info</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Button - Hidden on Mobile */}
        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 lg:h-14 lg:w-14 bg-purple-600 hover:bg-purple-700 border-2 border-purple-600 text-white rounded-full shadow-2xl items-center justify-center transition-all duration-300 hover:scale-110 group"
        >
          <svg
            className="h-6 w-6 lg:h-7 lg:w-7 transform group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slide Indicators - Smaller on Mobile */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
          {movies.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`transition-all duration-300 rounded-full ${
                current === index
                  ? "bg-purple-600 w-8 md:w-12 h-2 md:h-3"
                  : "bg-white/40 hover:bg-white/60 w-2 md:w-3 h-2 md:h-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Movie Counter - Smaller on Mobile */}
        <div className="absolute top-4 md:top-8 right-4 md:right-8 z-20 bg-black/50 backdrop-blur-md text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold">
          {current + 1} / {totalMovies}
        </div>

        {/* Auto-play Toggle - Smaller on Mobile */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 md:top-8 left-4 md:left-8 z-20 bg-black/50 backdrop-blur-md hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition-all"
          title={isAutoPlaying ? "Pause" : "Play"}
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Mobile Swipe Hint - Only shown on first visit */}
        <div className="md:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 animate-pulse">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          Swipe to navigate
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>

      {/* Optional: Featured Movies Section Below - Responsive Grid */}
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-gray-900">
            All Movies ({totalMovies})
          </h2>
          {/* Add responsive grid of all movies here if needed */}
        </div>
      </div>
    </>
  );
}