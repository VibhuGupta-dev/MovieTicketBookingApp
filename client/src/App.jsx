import { MoviePage } from "./Page/MoviePage";
import { Routes, Route } from "react-router-dom";
import { MovieInfoPage } from "./Page/MovieInfoPage";
import { AllCinemaPage } from "./Page/AllCinemaPage";
import { AllcinemaMoviebased } from "./Page/AllCinemaMovie";
import { MovieHall } from "./Page/MovieHall";
import { BillPage } from "./Page/BillPage";
import PaymentPage from "./Page/PaymentPage";
import { Profile } from "./Page/Profile";
import { Allshows } from "./Page/Allshows";
import { OwnerPage } from "./Page/OwnerPage";
import { AdminPage } from "./Page/AdminPage";
import ProtectedRoute from "./Components/ProtectedRoute";
export default function App() {
  return (
    <div className="w-full min-h-screen bg-gray-600">
      <Routes>
        <Route path="/" element={<MoviePage />} />
        <Route path="/Movie/:id" element={<MovieInfoPage />} />
        <Route path="/cinema" element={<AllCinemaPage />} />
        <Route path="/:id/cinemas/:date" element={<AllcinemaMoviebased />} />
        <Route
          path="/:id/cinema/:cinemaId/:date/:timeId/:showId"
          element={<MovieHall />}
        />
        <Route
          path="/PayOut/:showId/:timeId/:bookingId"
          element={<BillPage />}
        />
        <Route path="/payment/:bookingId" element={<PaymentPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/:cinemahallID" element={<Allshows />} />
        <Route
          path="/ownerpage"
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminPage"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
