import { MoviePage } from "./Page/MoviePage";
import { Routes, Route } from "react-router-dom";
import { MovieInfoPage } from "./Page/MovieInfoPage";
import { AllCinemaPage } from "./Page/AllCinemaPage";
import { AllcinemaMoviebased } from "./Page/AllCinemaMovie";

export default function App() {
  return (
    <div className="w-full min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<MoviePage />} />
        <Route path="/Movie/:id" element={<MovieInfoPage />} />
        <Route path="/cinema" element={<AllCinemaPage />} />
      <Route path="/:id/cinemas/:date" element={<AllcinemaMoviebased />} /> // ✅ lowercase :date
      </Routes>
    </div>
  );
}