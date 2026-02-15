import Navbar from "./Components/Navbar";
import { MoviePage } from "./Page/MoviePage";
import { Routes, Route } from "react-router-dom";
import { MovieInfoPage } from "./Page/MovieInfoPage";
import { AllCinemaPage } from "./Page/AllCinemaPage";
import { ThemeProvider } from "./Components/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <div className="w-full min-h-screen bg-white dark:bg-gray-900 transition-colors">
        <Routes>
          <Route path="/" element={<MoviePage />} />
          <Route path="/Movie/:id" element={<MovieInfoPage />} />
          <Route path="/cinema" element={<AllCinemaPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}