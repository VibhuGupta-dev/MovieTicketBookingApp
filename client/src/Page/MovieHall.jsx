import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { connectWS } from "../api/ws";

const ROW_LABELS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const LOCK_DURATION = 10 * 60;

export function MovieHall() {
    const socket = useRef(null);
    const timerRef = useRef(null);
    const [seats, setSeats] = useState([]);
    const [seatsPerRow, setSeatsPerRow] = useState(20);
    const [hallName, setHallName] = useState("Movie Hall");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [rate, setRate] = useState(0);
    const [socketReady, setSocketReady] = useState(false);
    const [lockedByMe, setLockedByMe] = useState([]);
    const [timeLeft, setTimeLeft] = useState(null);
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [totalprice, setTotalprice] = useState(0);
    const [bookinid, setBookingId] = useState('');
    const { cinemaId, date, timeId, showId } = useParams();
    const navigate = useNavigate();

    const userId = "698ac9f71158649a28d9a9dd";
    const totalPrice = selectedSeats.length * (rate ?? 0);

    // 1. Restore from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("seatLock");
        if (saved) {
            try {
                const { lockedSeats, expiresAt, totalPrice: savedPrice, bookingId } = JSON.parse(saved);
                const secondsLeft = Math.floor((expiresAt - Date.now()) / 1000);
                if (secondsLeft > 0) {
                    setLockedByMe(lockedSeats);
                    setTimeLeft(secondsLeft);
                    setBookingConfirmed(true);
                    setTotalprice(savedPrice ?? 0);
                    setBookingId(bookingId ?? ''); // ✅ restore bookingId
                } else {
                    localStorage.removeItem("seatLock");
                }
            } catch {
                localStorage.removeItem("seatLock");
            }
        }
    }, []);

    // 2. Fetch cinema hall + show bookedSeatIds
    useEffect(() => {
        if (!cinemaId || !showId || !timeId) return;
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const cinemaRes = await axios.get(
                    `http://localhost:3000/cinemahall/api/getcinemahall/${cinemaId}`
                );
                const hallData = Array.isArray(cinemaRes.data)
                    ? cinemaRes.data[0]
                    : cinemaRes.data;
                let seatsData = hallData?.seats ?? [];
                setSeatsPerRow(hallData?.seatsPerRow ?? 20);
                setHallName(hallData?.cinemaHallName ?? "Movie Hall");
                setRate(seatsData[0]?.rate ?? 0);

                const showRes = await axios.get(
                    `http://localhost:3000/show/getshow/${showId}`
                );
                const showData = Array.isArray(showRes.data) ? showRes.data[0] : showRes.data;
                const timeSlot = showData?.timeSlots?.find(
                    (slot) => String(slot._id) === String(timeId)
                );
                const bookedSeatIds = timeSlot?.bookedSeatIds?.map(String) ?? [];

                seatsData = seatsData.map((seat) => ({
                    ...seat,
                    isBooked: bookedSeatIds.includes(String(seat._id)),
                }));

                setSeats(seatsData);
            } catch (err) {
                setError(err?.message || "Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [cinemaId, showId, timeId]);

    // 3. Connect socket
    useEffect(() => {
        socket.current = connectWS();
        setSocketReady(true);
        return () => socket.current.disconnect();
    }, []);

    // 4. Socket listeners
    useEffect(() => {
        if (!socketReady || !socket.current) return;

        socket.current.on("seatLocked", (seatId) => {
            setSeats((prev) =>
                prev.map((seat) =>
                    seat._id === seatId ? { ...seat, locked: true } : seat
                )
            );
        });

        socket.current.on("seatUnlocked", (seatId) => {
            setSeats((prev) =>
                prev.map((seat) =>
                    seat._id === seatId ? { ...seat, locked: false } : seat
                )
            );
            setLockedByMe((prev) => {
                const updated = prev.filter((id) => id !== seatId);
                if (updated.length === 0) {
                    setTimeLeft(null);
                    setBookingConfirmed(false);
                    setTotalprice(0);
                    localStorage.removeItem("seatLock");
                }
                return updated;
            });
        });

        socket.current.on("lockResponse", ({ seatId, success }) => {
            if (!success) {
                alert(`Seat is already locked by someone else.`);
                setSelectedSeats((prev) => prev.filter((id) => id !== seatId));
            }
        });

        socket.current.on("seatBooked", (bookedSeatIds) => {
            setSeats((prev) =>
                prev.map((seat) =>
                    bookedSeatIds.map(String).includes(String(seat._id))
                        ? { ...seat, isBooked: true, locked: false }
                        : seat
                )
            );
        });

        return () => {
            socket.current.off("seatLocked");
            socket.current.off("seatUnlocked");
            socket.current.off("lockResponse");
            socket.current.off("seatBooked");
        };
    }, [socketReady]);

    // 5. Countdown timer
    useEffect(() => {
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            setTimeLeft(null);
            setBookingConfirmed(false);
            setLockedByMe([]);
            setSelectedSeats([]);
            setTotalprice(0);
            setBookingId('');
            localStorage.removeItem("seatLock");
            alert("Your seat reservation has expired!");
            return;
        }
        timerRef.current = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearTimeout(timerRef.current);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const toggleSeat = (seatKey, isBooked) => {
        if (isBooked || bookingConfirmed) return;
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
        if (!socket.current || selectedSeats.length === 0) return;
        try {
            const response = await axios.post(
                `http://localhost:3000/seat/api/bookseat/${showId}/${timeId}`,
                { seatsId: selectedSeats }
            );
            const bookingData = response.data.booking;
            const bookingId = bookingData._id;

            setBookingId(bookingId); // ✅ state mein set karo

            selectedSeats.forEach((seatId) => {
                socket.current.emit("lockSeat", { seatId, userId });
            });

            const expiresAt = Date.now() + LOCK_DURATION * 1000;
            const subtotal = selectedSeats.length * rate;
            const bookingFee = Math.round(subtotal * 0.1);
            const total = subtotal + bookingFee;

            localStorage.setItem(
                "seatLock",
                JSON.stringify({
                    lockedSeats: selectedSeats,
                    expiresAt,
                    totalPrice: total,
                    subtotal,
                    bookingFee,
                    bookingId, // ✅ localStorage mein bhi save
                })
            );

            setLockedByMe(selectedSeats);
            setTimeLeft(LOCK_DURATION);
            setTotalprice(total);
            setBookingConfirmed(true);

            navigate(`/PayOut/${showId}/${timeId}/${bookingId}`);
        } catch (err) {
            console.error("Booking failed:", err);
            alert(err?.response?.data?.message || "Booking failed. Please try again.");
        }
    };

    const handleCancelLock = async () => {
        if (!socket.current) return;

        // ✅ localStorage se parse karke bookingId lo
        const saved = localStorage.getItem("seatLock");
        const bookingId = saved ? JSON.parse(saved).bookingId : null;

        // Socket se seats unlock karo
        lockedByMe.forEach((seatId) => socket.current.emit("unlockSeat", { seatId }));

        // Backend se SeatBooking delete karo
        if (bookingId) {
            try {
                await axios.delete(`http://localhost:3000/seat/api/deletebookseat/${bookingId}`);
            } catch (err) {
                console.error("Failed to delete booking:", err);
            }
        }

        // State reset
        setLockedByMe([]);
        setSelectedSeats([]);
        setTimeLeft(null);
        setTotalprice(0);
        setBookingConfirmed(false);
        setBookingId(''); // ✅ reset
        localStorage.removeItem("seatLock");
    };

    const rows = [];
    for (let i = 0; i < seats.length; i += seatsPerRow) {
        rows.push(seats.slice(i, i + seatsPerRow));
    }
    const aisleAfter = Math.floor(seatsPerRow / 2) - 1;

    if (isLoading)
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-purple-500 tracking-widest text-sm uppercase">Loading seats…</p>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500 text-lg">⚠ {error}</p>
            </div>
        );

    return (
        <>
            {/* Back Button */}
            <div
                onClick={() => navigate(-1)}
                className="bg-gray-50 px-6 pt-6 pb-2 flex items-center gap-2 cursor-pointer group"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-500 group-hover:text-purple-500 transition-colors duration-150"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-base font-medium text-gray-500 group-hover:text-purple-500 transition-colors duration-150">
                    Back
                </span>
            </div>

            <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center pb-32 px-4 pt-4 relative overflow-x-hidden">

                {/* Header */}
                <div className="text-center mb-8 z-10 bg-white rounded-2xl px-10 py-5 border border-gray-200 shadow-sm w-full max-w-lg">
                    <p className="text-purple-500 text-xs tracking-[0.25em] uppercase mb-1 font-medium">
                        {date} &nbsp;·&nbsp;
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-widest uppercase">
                        {hallName}
                    </h1>
                    <div className="mt-3 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
                </div>

                {/* Countdown Banner */}
                {bookingConfirmed && timeLeft !== null && (
                    <div className="w-full max-w-lg mb-6 bg-purple-50 border border-purple-200 rounded-2xl px-6 py-4 flex items-center justify-between shadow-sm">
                        <div>
                            <p className="text-purple-700 text-xs uppercase tracking-widest font-semibold mb-1">
                                Seats reserved — complete payment
                            </p>
                            <p className="text-gray-500 text-xs">Your seats are locked for other users</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className={`text-2xl font-bold tabular-nums ${timeLeft <= 60 ? "text-red-500" : "text-purple-600"}`}>
                                {formatTime(timeLeft)}
                            </span>
                            <button
                                onClick={handleCancelLock}
                                className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Screen */}
                <div className="w-full max-w-3xl flex flex-col items-center mb-8 z-10 mt-4">
                    <div className="w-3/4 h-1.5 rounded-full bg-purple-400 shadow-[0_0_16px_rgba(168,85,247,0.4)]" />
                    <p className="text-xs tracking-[0.4em] text-purple-400 uppercase mt-2 font-medium">Screen</p>
                    <div
                        style={{
                            width: "75%",
                            height: "16px",
                            background: "linear-gradient(to bottom, rgba(168,85,247,0.15), transparent)",
                            clipPath: "polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)",
                        }}
                    />
                </div>

                {/* Rate */}
                <div className="p-5 text-xl font-bold">Seats : ₹{rate}</div>

                {/* Seat Grid */}
                <div className="flex flex-col gap-1.5 z-10 overflow-x-auto w-full items-center bg-gray-50 rounded-2xl shadow-sm p-6">
                    {rows.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-1">
                            <span className="text-purple-400 text-xs w-5 text-center font-mono font-semibold">
                                {ROW_LABELS[rowIdx] ?? rowIdx + 1}
                            </span>
                            {row.map((seat, idx) => {
                                const seatKey = seat._id;
                                const label = seat?.seatNo ?? seat?.number ?? seat?.label ?? `${idx + 1}`;
                                const isBooked = seat?.isBooked || seat?.locked || false;
                                const isSelected = selectedSeats.includes(seatKey);
                                const isLockedByMe = lockedByMe.includes(seatKey);

                                let seatClass =
                                    "relative flex-shrink-0 w-7 h-6 md:w-8 md:h-7 rounded-t-md text-[9px] font-semibold transition-all duration-150 border-b-2 cursor-pointer outline outline-1 ";

                                if (isLockedByMe) {
                                    seatClass += "bg-orange-400 border-b-orange-600 outline-orange-500 text-white cursor-not-allowed";
                                } else if (isBooked) {
                                    seatClass += "bg-gray-100 border-b-gray-300 outline-gray-300 text-gray-300 cursor-not-allowed";
                                } else if (isSelected) {
                                    seatClass += "bg-purple-500 border-b-purple-600 outline-purple-700 text-white scale-110";
                                } else {
                                    seatClass += "bg-white border-b-gray-500 outline-gray-300 text-gray-500 hover:bg-purple-50 hover:outline-purple-300 hover:border-b-purple-300 hover:text-purple-600 hover:scale-105";
                                }

                                return (
                                    <React.Fragment key={seatKey}>
                                        <button
                                            className={seatClass}
                                            disabled={isBooked || isLockedByMe || bookingConfirmed}
                                            onClick={() => toggleSeat(seatKey, isBooked)}
                                            title={
                                                isLockedByMe
                                                    ? "Locked by you"
                                                    : isBooked
                                                    ? "Already booked"
                                                    : `Row ${ROW_LABELS[rowIdx]} · Seat ${label}`
                                            }
                                        >
                                            {label}
                                        </button>
                                        {idx === aisleAfter && <div className="w-4" />}
                                    </React.Fragment>
                                );
                            })}
                            <span className="text-purple-400 text-xs w-5 text-center font-mono font-semibold">
                                {ROW_LABELS[rowIdx] ?? rowIdx + 1}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-6 z-10 bg-white border border-gray-200 rounded-xl px-6 py-3 shadow-sm flex-wrap justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-t-sm bg-white outline outline-1 outline-gray-300 border-b-2 border-b-gray-300" />
                        <span className="text-gray-500 text-xs">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-t-sm bg-purple-500 outline outline-1 outline-purple-700 border-b-2 border-b-purple-800" />
                        <span className="text-gray-500 text-xs">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-t-sm bg-orange-400 outline outline-1 outline-orange-500 border-b-2 border-b-orange-600" />
                        <span className="text-gray-500 text-xs">Locked by you</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-4 rounded-t-sm bg-gray-100 outline outline-1 outline-gray-300 border-b-2 border-b-gray-300" />
                        <span className="text-gray-500 text-xs">Booked</span>
                    </div>
                </div>

                {/* Bottom Bar - Before booking confirmed */}
                {!bookingConfirmed && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-purple-500 text-xs uppercase tracking-widest font-medium">
                                {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} selected
                            </p>
                            <p className="text-gray-900 text-2xl font-bold">₹{totalPrice.toLocaleString()}</p>
                        </div>
                        <button
                            onClick={handleConfirmBooking}
                            disabled={selectedSeats.length === 0}
                            className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl tracking-wide uppercase text-sm border border-purple-600 shadow-md transition-all duration-150"
                        >
                            Confirm Booking →
                        </button>
                    </div>
                )}

                {/* Bottom Bar - After booking confirmed */}
                {bookingConfirmed && lockedByMe.length > 0 && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between shadow-lg">
                        <div>
                            <p className="text-orange-500 text-xs uppercase tracking-widest font-medium">
                                {lockedByMe.length} seat{lockedByMe.length > 1 ? "s" : ""} locked · expires in {formatTime(timeLeft)}
                            </p>
                            <p className="text-gray-900 text-2xl font-bold">₹{totalprice.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelLock}
                                className="text-sm text-gray-400 hover:text-red-500 underline transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => navigate(`/PayOut/${showId}/${timeId}/${bookinid}`)} // ✅ state se aa raha hai
                                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl tracking-wide uppercase text-sm border border-green-600 shadow-md transition-all duration-150"
                            >
                                Pay Now →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}