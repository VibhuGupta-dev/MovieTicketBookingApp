import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "../api/Dates";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export function AllcinemaMoviebased() {
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id, date } = useParams();
  const navigate = useNavigate();

  const handleTimeSlotClick = (time, cinemaId) => {
    navigate(`/${id}/cinema/${cinemaId}/${date}/${time}`);
  };

  useEffect(() => {
    if (!selectedStateId || !selectedCityId) return;

    const fetchShows = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/show/getshow/${id}/${date}`,
          {
            params: {
              StateId: selectedStateId,
              CityId: selectedCityId,
            },
          }
        );

        const data = response.data || [];
        const uniqueShows = Array.from(
          new Map(data.map((item) => [item.cinemaId?._id, item])).values()
        );

        setShows(uniqueShows);
      } catch (err) {
        setError(err.message || "Failed to load shows");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, [id, date, selectedStateId, selectedCityId]);

  return (
    <>
      <Navbar
        setSelectedStateId={setSelectedStateId}
        setSelectedCityId={setSelectedCityId}
      />

      <div className="min-h-screen bg-purple-50">
        <div className="max-w-3xl mx-auto px-4 py-8">

          {/* Calendar */}
          <div className="mb-6">
            <Calendar />
          </div>

          {/* Section heading */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-purple-700 font-semibold text-sm tracking-widest uppercase">
              🎬 Select a Showtime
            </span>
            <div className="flex-1 h-px bg-purple-200" />
          </div>

          {/* Loading Skeletons */}
          {isLoading && (
            <SkeletonTheme baseColor="#f3e8ff" highlightColor="#e9d5ff">
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-purple-100 p-5"
                  >
                    {/* Name + badge row */}
                    <div className="flex items-start justify-between mb-3">
                      <Skeleton width={220} height={22} borderRadius={8} />
                      <Skeleton width={90} height={22} borderRadius={999} />
                    </div>

                    {/* Sub-label */}
                    <Skeleton width={130} height={11} borderRadius={6} />

                    <div className="h-px bg-purple-50 my-4" />

                    {/* Time slot pills */}
                    <div className="flex gap-2 flex-wrap">
                      {[80, 72, 88, 76].map((w, j) => (
                        <Skeleton key={j} width={w} height={32} borderRadius={999} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SkeletonTheme>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-500 rounded-xl px-4 py-3 text-sm flex items-center gap-2 mb-4">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && shows.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-purple-200 rounded-2xl bg-white">
              <p className="text-4xl mb-3">🎭</p>
              <p className="text-purple-400 text-sm">
                No shows available for this date and location.
              </p>
            </div>
          )}

          {/* Cinema cards */}
          {!isLoading && (
            <div className="flex flex-col gap-4">
              {shows.map((showItem, index) => (
                <div
                  key={showItem._id || index}
                  className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 hover:shadow-md hover:border-purple-300 transition-all duration-200"
                >
                  {showItem.cinemaId ? (
                    <>
                      <div className="flex items-start justify-between mb-1">
                        <h2 className="text-gray-800 font-bold text-lg leading-tight">
                          {showItem.cinemaId.cinemaHallName}
                        </h2>
                        <span className="text-xs bg-purple-100 text-purple-600 font-medium px-3 py-1 rounded-full whitespace-nowrap ml-3">
                          Now Showing
                        </span>
                      </div>

                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                        Available Showtimes
                      </p>

                      <div className="h-px bg-purple-50 mb-4" />

                      <div className="flex flex-wrap gap-2">
                        {showItem.timeSlots?.map((slot, i) => (
                          <button
                            key={i}
                            onClick={() =>
                              handleTimeSlotClick(slot.time, showItem.cinemaId._id)
                            }
                            className="px-4 py-1.5 rounded-full border border-purple-200 text-purple-700 text-sm font-medium bg-purple-50 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all duration-150 active:scale-95"
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Cinema information unavailable
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}