// ============================================
// ALTERNATIVE: AllCinemaPage.jsx (using GET method)
// ============================================
import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";

export function AllCinemaPage() {
  console.log("🎥 AllCinemaPage: Component rendering");

  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("🔍 AllCinemaPage: setSelectedStateId type =", typeof setSelectedStateId);
  console.log("🔍 AllCinemaPage: setSelectedCityId type =", typeof setSelectedCityId);
  console.log("📍 AllCinemaPage: Current selectedStateId =", selectedStateId);
  console.log("📍 AllCinemaPage: Current selectedCityId =", selectedCityId);

  useEffect(() => {
    if (!selectedStateId || !selectedCityId) {
      console.log("⏸️ AllCinemaPage: Waiting for state/city selection...");
      return;
    }

    console.log("🌐 AllCinemaPage: Fetching cinemas...");
    console.log("   → State ID:", selectedStateId);
    console.log("   → City ID:", selectedCityId);

    const fetchCinemas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // ===== CHANGED: Using GET with query params =====
        const response = await axios.get(
          "http://localhost:3000/cinemahall/api/getcinemalocation",
          {
            params: {  // Query parameters ke liye
              StateId: selectedStateId,
              CityId: selectedCityId,
            }
          }
        );

        console.log("✅ AllCinemaPage: Cinemas fetched successfully!");
        console.log("   → Response:", response.data);
        console.log("   → Total cinemas:", response.data?.length || 0);

        setCinemas(response.data || []);
      } catch (err) {
        console.error("❌ AllCinemaPage: Failed to fetch cinemas:", err);
        console.error("   → Error message:", err.message);
        console.error("   → Error response:", err.response?.data);

        setError(err.message || "Failed to load cinemas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCinemas();
  }, [selectedStateId, selectedCityId]);

  console.log("🎨 AllCinemaPage: Rendering with", cinemas.length, "cinemas");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        setSelectedStateId={setSelectedStateId}
        setSelectedCityId={setSelectedCityId}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          All Cinemas
        </h1>

        {selectedStateId && selectedCityId && (
          <div className="bg-purple-100 border-l-4 border-purple-600 p-4 mb-6 rounded">
            <p className="text-purple-800 font-medium">
              📍 Showing cinemas for State ID: <strong>{selectedStateId}</strong> | City ID: <strong>{selectedCityId}</strong>
            </p>
          </div>
        )}

        {!selectedStateId || !selectedCityId ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-yellow-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <p className="text-yellow-800 font-medium">
                Please select a state and city from the navbar to view cinemas
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">
                Loading cinemas...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <div>
                <p className="text-red-800 font-bold">Error loading cinemas</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : cinemas.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Cinemas Found</h3>
            <p className="text-gray-500">
              There are no cinemas available in the selected location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cinemas.map((cinema, index) => (
              <div
                key={cinema._id || index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {cinema.cinemaHallName || `Cinema ${index + 1}`}
                  </h3>
                  
                  {cinema.address && (
                    <p className="text-gray-600 text-sm mb-4">
                      📍 {cinema.address}
                    </p>
                  )}

                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
                    View Shows
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}