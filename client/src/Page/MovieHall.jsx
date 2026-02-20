import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function MovieHall() {
    const [seats, setSeats] = useState([]);
    const [seatsPerRow, setSeatsPerRow] = useState(20);
    const [hallName, setHallName] = useState("Movie Hall");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { cinemaId, date, time } = useParams();

    useEffect(() => {
        if (!cinemaId) return;
        const fetchCinema = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `http://localhost:3000/cinemahall/api/getcinemahall/${cinemaId}`
                );
                const data = response.data;
                const hallData = Array.isArray(data) ? data[0] : data;
                const seatsData = hallData?.seats ?? [];
                setSeats(Array.isArray(seatsData) ? seatsData : []);
                setSeatsPerRow(hallData?.seatsPerRow ?? 20);
                setHallName(hallData?.cinemaHallName ?? "Movie Hall");
            } catch (err) {
                setError(err?.message || "Failed to load Cinema");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCinema();
    }, [cinemaId]);

    const toggleSeat = (seatKey, isBooked) => {
        if (isBooked) return;

        const isAlreadySelected = selectedSeats.includes(seatKey);

        if (!isAlreadySelected && selectedSeats.length >= 10) {
            alert("You cannot select more than 10 seats.");
            return;
        }

        setSelectedSeats((prev) =>
            isAlreadySelected ? prev.filter((s) => s !== seatKey) : [...prev, seatKey]
        );
    };

    const handleConfirmBooking = async () => {
        try {
            console.log("Booking seat IDs:", selectedSeats);
            await axios.post(`http://localhost:3000/booking/api/book`, {
                seatIds: selectedSeats,
                cinemaId,
                date,
                time,
            });
            alert("Booking confirmed!");
            setSelectedSeats([]);
        } catch (err) {
            alert("Booking failed: " + (err?.message || "Unknown error"));
        }
    };

    // Chunk flat seats array into rows
    const rows = [];
    for (let i = 0; i < seats.length; i += seatsPerRow) {
        rows.push(seats.slice(i, i + seatsPerRow));
    }

    const totalPrice = selectedSeats.length * 250;
    const aisleAfter = Math.floor(seatsPerRow / 2) - 1;

    if (isLoading) return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-transparent animate-spin" />
            <p className="text-yellow-400 tracking-widest text-sm uppercase">Loading seats…</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-red-400 text-lg">⚠ {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center pb-32 px-4 pt-8 relative overflow-x-hidden">

            {/* Header */}
            <div className="text-center mb-8 z-10">
                <p className="text-yellow-400 text-xs tracking-[0.25em] uppercase mb-1">
                    {date} &nbsp;·&nbsp; {time}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-widest uppercase">
                    {hallName}
                </h1>
                <div className="mt-2 h-px w-48 mx-auto from-transparent via-white to-transparent" />
            </div>

            {/* Screen */}
            <div className="w-full max-w-3xl flex flex-col items-center mb-10 z-10">
                <div className="w-3/4 h-3 rounded-full bg-white opacity-20 blur-xl mb-1" />
                <div className="w-3/4 h-1 rounded-sm opacity-90 shadow-[0_0_24px_4px_rgba(253,224,71,0.5)]" />
                <p className="text-xs tracking-[0.4em] text-gray-500 uppercase mt-2">Screen</p>
                <div
                    className="mt-1 opacity-10"
                    style={{
                        width: "75%",
                        height: "18px",
                        background: "linear-gradient(to bottom, rgba(253,224,71,0.4), transparent)",
                        clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)",
                    }}
                />
            </div>

            {/* Seat Grid */}
            <div className="flex flex-col gap-1.5 z-10 overflow-x-auto w-full items-center">
                {rows.map((row, rowIdx) => (
                    <div key={rowIdx} className="flex items-center gap-1">

                        {/* Row label left */}
                        <span className="text-gray-500 text-xs w-5 text-center font-mono">
                            {ROW_LABELS[rowIdx] ?? rowIdx + 1}
                        </span>

                        {/* Seats */}
                        {row.map((seat, idx) => {
                            const seatKey = seat?.id ?? `${rowIdx}-${idx}`;
                            const label = seat?.seatNo ?? seat?.number ?? seat?.label ?? `${idx + 1}`;
                            const isBooked = seat?.locked ?? seat?.isBooked ?? false;
                            const isSelected = selectedSeats.includes(seatKey);

                            let seatClass =
                                "relative flex-shrink-0 w-7 h-6 md:w-8 md:h-7 rounded-t-md text-[9px] font-semibold transition-all duration-150 border-b-2 cursor-pointer ";

                            if (isBooked) {
                                seatClass += "bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed";
                            } else if (isSelected) {
                                seatClass += "bg-yellow-400 border-yellow-600 text-gray-900 scale-110 shadow-[0_0_8px_2px_rgba(253,224,71,0.5)]";
                            } else {
                                seatClass += "bg-gray-700 border-gray-500 text-gray-300 hover:bg-gray-500 hover:scale-105";
                            }

                            return (
                                <React.Fragment key={seatKey}>
                                    <button
                                        className={seatClass}
                                        disabled={isBooked}
                                        onClick={() => toggleSeat(seatKey, isBooked)}
                                        title={`Row ${ROW_LABELS[rowIdx]} · Seat ${label}`}
                                    >
                                        {label}
                                    </button>
                                    {/* Aisle gap in the middle */}
                                    {idx === aisleAfter && (
                                        <div className="w-4" />
                                    )}
                                </React.Fragment>
                            );
                        })}

                        {/* Row label right */}
                        <span className="text-gray-500 text-xs w-5 text-center font-mono">
                            {ROW_LABELS[rowIdx] ?? rowIdx + 1}
                        </span>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex gap-6 mt-8 z-10">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-4 rounded-t-sm bg-gray-700 border-b-2 border-gray-500" />
                    <span className="text-gray-400 text-xs">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-4 rounded-t-sm bg-yellow-400 border-b-2 border-yellow-600" />
                    <span className="text-gray-400 text-xs">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-4 rounded-t-sm bg-gray-800 border-b-2 border-gray-700" />
                    <span className="text-gray-400 text-xs">Booked</span>
                </div>
            </div>

            {/* Booking bar */}
            {selectedSeats.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 px-6 py-4 flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.6)]">
                    <div>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">
                            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                        </p>
                        <p className="text-yellow-400 text-2xl font-bold">
                            ₹{totalPrice.toLocaleString()}
                        </p>
                    </div>
                    <button
                        onClick={handleConfirmBooking}
                        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-lg tracking-wide uppercase text-sm transition-all duration-150 shadow-[0_0_16px_rgba(253,224,71,0.4)] hover:shadow-[0_0_24px_rgba(253,224,71,0.6)]"
                    >
                        Confirm Booking →
                    </button>
                </div>
            )}
        </div>
    );
}