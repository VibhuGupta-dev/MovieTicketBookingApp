import { MoviePage } from "./Page/MoviePage";
import { Routes, Route } from "react-router-dom";
import { MovieInfoPage } from "./Page/MovieInfoPage";
import { AllCinemaPage } from "./Page/AllCinemaPage";
import { AllcinemaMoviebased } from "./Page/AllCinemaMovie";
import { MovieHall } from "./Page/MovieHall";


export default function App() {
  return (
    <div className="w-full min-h-screen bg-gray-600">
      <Routes>
        <Route path="/" element={<MoviePage />} />
        <Route path="/Movie/:id" element={<MovieInfoPage />} />
        <Route path="/cinema" element={<AllCinemaPage />} />
        <Route path="/:id/cinemas/:date" element={<AllcinemaMoviebased />} /> 
        <Route path="/:id/cinema/:cinemaId/:date/:time" element={<MovieHall />} />
      </Routes>
    </div>
  );
}