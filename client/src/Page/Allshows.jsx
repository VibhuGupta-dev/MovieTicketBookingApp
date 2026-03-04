import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import Navbar from "../Components/Navbar"
import { Footer } from "../Components/Footer"

export function Allshows() {
    const { cinemahallID } = useParams()
    console.log(cinemahallID)
    const [cinema, setCinema] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchCinema() {
            try {
                const { data } = await axios.get(
                    `http://localhost:3000/cinemahall/api/getcinemahall/${cinemahallID}`
                )
                console.log(data)
                setCinema(data)
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch cinema hall")
            } finally {
                setLoading(false)
            }
        }
        if (cinemahallID) fetchCinema()
    }, [cinemahallID])

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-4 border-purple-900 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-purple-400 mt-4 text-sm">Loading shows...</p>
            </div>
            <Footer />
        </>
    )

    if (error) return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black flex items-center justify-center">
                <p className="text-red-500 text-sm">⚠ {error}</p>
            </div>
            <Footer />
        </>
    )

    const movies = cinema?.MovieId?.map(m => m.MovieId).filter(Boolean) || []

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-black pb-16">

                {/* Hero */}
                <div className="bg-gradient-to-br from-black via-purple-950/30 to-black border-b border-purple-900/40 px-6 py-14 text-center">
                    <span className="inline-block px-4 py-1 rounded-full bg-purple-900/30 border border-purple-700 text-purple-400 text-xs font-semibold tracking-widest uppercase mb-4">
                        🎬 Now Showing
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
                        {cinema?.cinemaHallName || "Cinema Hall"}
                    </h1>
                    <p className="text-gray-400 text-sm mb-5">
                        {cinema?.address} · {cinema?.CityId}, {cinema?.StateId}
                    </p>
                    <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-300">
                        <span>🎥 {movies.length} Movies</span>
                        <span className="text-gray-700">|</span>
                        <span>💺 {cinema?.seats?.length || 0} Seats</span>
                        <span className="text-gray-700">|</span>
                        <span>🪑 {cinema?.row} Rows × {cinema?.seatsPerRow} per row</span>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="max-w-7xl mx-auto px-6 pt-12">
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                        All Shows
                    </h2>

                    {movies.length === 0 ? (
                        <div className="text-center py-24">
                            <p className="text-5xl mb-4">🎞</p>
                            <p className="text-gray-500">No shows available right now.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {movies.map(movie => (
                                <MovieCard key={movie._id} movie={movie} />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

function MovieCard({ movie }) {
    const releaseDate = movie.MovieReleaseDate
        ? new Date(movie.MovieReleaseDate).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
          })
        : "TBA"

    return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-purple-700 hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-200 cursor-pointer group">

            {/* Poster */}
            <div className="relative h-52 bg-neutral-800 overflow-hidden">
                {movie.MoviePhoto ? (
                    <img
                        src={movie.MoviePhoto}
                        alt={movie.MovieName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-purple-950 to-black">
                        🎬
                    </div>
                )}
                <span className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-purple-700/90 text-white text-xs font-bold rounded-md tracking-wider">
                    {movie.MovieType?.toUpperCase()}
                </span>
            </div>

            {/* Body */}
            <div className="p-4">
                <h3 className="text-white font-bold text-base mb-2.5 truncate">
                    {movie.MovieName}
                </h3>

                <div className="flex flex-wrap gap-1.5 mb-3">
                    {[movie.Moviegenre, movie.MovieLanguage, `⏱ ${movie.MovieLength} min`]
                        .filter(Boolean)
                        .map((tag, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-0.5 bg-neutral-800 border border-purple-900/60 text-purple-400 text-xs rounded-full font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                </div>

                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-2">
                    {movie.MovieDescription}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-xs">📅 {releaseDate}</span>
                    <button className="px-4 py-1.5 bg-gradient-to-r from-purple-700 to-purple-500 hover:opacity-85 text-white text-xs font-semibold rounded-lg transition-opacity">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    )
}