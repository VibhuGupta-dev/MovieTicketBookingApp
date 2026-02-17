import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Calendar from "../api/Dates";

export function AllcinemaMoviebased() {
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [show, setShow] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id, date } = useParams();

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
          },
        );
        setShow(response.data || []);
      } catch (err) {
        setError(err.message || "Failed to load shows");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShows();
  }, [id, selectedStateId, selectedCityId, date]);

  return (
    <>
      <Navbar
        setSelectedStateId={setSelectedStateId}
        setSelectedCityId={setSelectedCityId}
      />
      <div className="m-4 p-2">
        <Calendar />
        <div>
          {isLoading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!isLoading && show.length === 0 && (
            <p>No shows available for this date and location.</p>
          )}
          {show.map((showItem, index) => (
            <div key={showItem._id || index} className="border p-4 my-2 rounded">
              {showItem.cinemaId ? (
                <>
                
                  <h2>{showItem.cinemaId.cinemaHallName}</h2>
                  <p>{showItem.cinemaId.address}</p>
                  <p>Time: {showItem.timeSlot}</p>
                  <p>Price: ₹{showItem.pricePerSeat}</p>
                </>
              ) : (
                <p>No cinema info</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}