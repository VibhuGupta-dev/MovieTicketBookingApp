import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export function BillPage() {
  const { showId, bookingId } = useParams();
  const navigate = useNavigate();

  // Movie
  const [movieName,    setMovieName]    = useState("—");
  const [movieGenre,   setMovieGenre]   = useState("—");
  const [movieLang,    setMovieLang]    = useState("—");
  const [movieFormat,  setMovieFormat]  = useState("2D");
  const [posterUrl,    setPosterUrl]    = useState(null);
  const [bgPhoto,      setBgPhoto]      = useState(null);

  // Show
  const [showDate,     setShowDate]     = useState("—");
  const [pricePerSeat, setPricePerSeat] = useState(0);
  const [timeSlots,    setTimeSlots]    = useState([]);

  // Cinema Hall
  const [cinemaId,     setCinemaId]     = useState("");
  const [cinemaName,   setCinemaName]   = useState("—");
  const [cinemaAddr,   setCinemaAddr]   = useState("—");
  const [hallSeats,    setHallSeats]    = useState([]);

  // Booking
  const [bookingRef,   setBookingRef]   = useState("—");
  const [seatIds,      setSeatIds]      = useState([]);
  const [seatCount,    setSeatCount]    = useState(0);
  const [bookedSeats,  setBookedSeats]  = useState([]);

  // Pricing
  const [subtotal,     setSubtotal]     = useState(0);
  const [bookingFee,   setBookingFee]   = useState(0);
  const [total,        setTotal]        = useState(0);

  // UI
  const [movieId,      setMovieId]      = useState("");
  const [loading,      setLoading]      = useState(true);
  const [orderOpen,    setOrderOpen]    = useState(false);
  const [feeOpen,      setFeeOpen]      = useState(false);
  const [timerDisplay, setTimerDisplay] = useState("10:00");
  const [timerExpired, setTimerExpired] = useState(false);

  // ── 1. Fetch booking + show together ──
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [bookingRes, showRes] = await Promise.all([
          axios.get(`http://localhost:3000/seat/api/getbookedseat/${bookingId}`),
          axios.get(`http://localhost:3000/show/getshow/${showId}`),
        ]);

        // ── Show ──
        const showArr = Array.isArray(showRes.data) ? showRes.data : [showRes.data];
        const show = showArr[0];

        const rawDate = show?.showDate ?? null;
        setShowDate(
          rawDate
            ? new Date(rawDate).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })
            : "—"
        );
        setPricePerSeat(show?.pricePerSeat ?? 0);
        setTimeSlots(show?.timeSlots ?? []);
        if (show?.movieId)  setMovieId(String(show.movieId));
        if (show?.cinemaId) setCinemaId(String(show.cinemaId));

        // ── Booking — define first, then use ──
        const bookingArr = Array.isArray(bookingRes.data) ? bookingRes.data : [bookingRes.data];
        const booking = bookingArr[0]; // ✅ defined here

        // ✅ Now safely use booking
        setBookingRef(
          booking?.BookingRefrence ??
          booking?._id?.toString().slice(-10).toUpperCase() ??
          "—"
        );

        const seats = booking?.seatsId ?? [];
        setSeatIds(seats.map(String));
        setSeatCount(seats.length);

        // Subtotal from show price
        const rate  = show?.pricePerSeat ?? 0;
        const count = seats.length;
        const sub   = count * rate;
        const fee   = Math.round(sub * 0.24);
        setSubtotal(sub);
        setBookingFee(fee);
        setTotal(sub + fee);

      } catch (err) {
        console.error("fetchAll error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [bookingId, showId]);

  // ── 2. Fetch movie ──
  useEffect(() => {
    if (!movieId) return;
    let mounted = true;
    const fetchMovie = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/movie/api/getmovie/${movieId}`);
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!mounted) return;
        setMovieName(data?.MovieName ?? "—");
        setMovieGenre(data?.Moviegenre ?? "—");
        setMovieLang(data?.MovieLanguage ?? "—");
        setMovieFormat((data?.MovieType ?? "2D").toUpperCase());
        setPosterUrl(data?.MoviePhoto ?? null);
        setBgPhoto(data?.MovieBackgroundPhoto ?? null);
      } catch (err) {
        console.error("fetchMovie error:", err);
      }
    };
    fetchMovie();
    return () => { mounted = false; };
  }, [movieId]);

  // ── 3. Fetch cinema hall ──
  useEffect(() => {
    if (!cinemaId) return;
    let mounted = true;
    const fetchCinema = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/cinemahall/api/getcinemahall/${cinemaId}`
        );
        const data = res.data;
        const hallData = Array.isArray(data) ? data[0] : data;
        if (!mounted) return;
        setCinemaName(hallData?.cinemaHallName ?? "—");
        setCinemaAddr(hallData?.address ?? hallData?.CityId ?? "—");
        const seats = Array.isArray(hallData?.seats) ? hallData.seats : [];
        setHallSeats(seats);
      } catch (err) {
        console.error("fetchCinema error:", err);
      }
    };
    fetchCinema();
    return () => { mounted = false; };
  }, [cinemaId]);

  // ── 4. Match booked seatIds with hall seats ──
  useEffect(() => {
    if (hallSeats.length === 0 || seatIds.length === 0) return;

    const matched = seatIds.map((id, i) => {
      const found = hallSeats.find((s) => String(s._id) === id);
      return found ?? hallSeats[i] ?? { seatno: `Seat ${i + 1}`, rate: pricePerSeat };
    });

    setBookedSeats(matched);

    const actualSubtotal = matched.reduce((sum, s) => sum + (s.rate ?? pricePerSeat), 0);
    const actualFee = Math.round(actualSubtotal * 0.24);
    setSubtotal(actualSubtotal);
    setBookingFee(actualFee);
    setTotal(actualSubtotal + actualFee);
  }, [hallSeats, seatIds, pricePerSeat]);

  // ── 5. Live countdown timer ──
  useEffect(() => {
    const saved = localStorage.getItem("seatLock");
    if (!saved) {
      setTimerExpired(true);
      return;
    }
    const { expiresAt } = JSON.parse(saved);

    const tick = () => {
      const left = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      const m = Math.floor(left / 60);
      const s = String(left % 60).padStart(2, "0");
      setTimerDisplay(`${m}:${s}`);
      if (left === 0) {
        localStorage.removeItem("seatLock");
        setTimerExpired(true);
        clearInterval(id);
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ══ EXPIRED POPUP ══ */}
      {timerExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl px-8 py-10 mx-4 max-w-sm w-full flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Time Expired!</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Your seat reservation has expired. Please go back and select your seats again to continue booking.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("seatLock");
                navigate(-2);
              }}
              className="w-full bg-gray-900 hover:bg-gray-700 active:scale-95 text-white font-semibold py-3.5 rounded-2xl transition-all duration-150 text-sm tracking-wide"
            >
              ← Select Seats Again
            </button>
          </div>
        </div>
      )}

      {/* ── Top navbar ── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-base font-semibold text-gray-900">Review your booking</h1>
          <div className="w-12" />
        </div>
      </div>

      {/* ── Timer banner ── */}
      <div className={`border-b py-2.5 text-center transition-colors ${timerExpired ? "bg-red-50 border-red-100" : "bg-purple-50 border-purple-100"}`}>
        <p className={`text-sm ${timerExpired ? "text-red-600 font-bold" : "text-purple-700"}`}>
          {timerExpired
            ? "⏱ Session expired — please select seats again"
            : <>Complete your booking in <span className="font-bold text-purple-800">{timerDisplay} mins</span></>
          }
        </p>
      </div>

      {/* ── Background hero ── */}
      {bgPhoto && (
        <div className="relative w-full h-32 overflow-hidden">
          <img src={bgPhoto} alt="bg" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50" />
        </div>
      )}

      {/* ── Main 2-col layout ── */}
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6 items-start">

        {/* ══ LEFT COLUMN ══ */}
        <div className="flex-1 flex flex-col gap-4">

          {/* Movie info card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{movieName}</h2>
              <p className="text-sm text-gray-500 mb-1">{movieGenre} · {movieLang} · {movieFormat}</p>
              <p className="text-sm text-gray-500">{cinemaName}</p>
              {cinemaAddr !== "—" && (
                <p className="text-xs text-gray-400 mt-0.5">{cinemaAddr}</p>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{showDate}</p>
                {timeSlots.length > 0 && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {timeSlots.map((t) => t?.startTime ?? t?.time ?? "").filter(Boolean).join(" · ")}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {seatCount} ticket{seatCount > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {bookedSeats.length > 0
                      ? bookedSeats.map((s) => s.seatno).join(", ")
                      : seatIds.map((_, i) => `Seat ${i + 1}`).join(", ")
                    }
                  </p>
                  <p className="text-sm text-gray-500">{cinemaName}</p>
                </div>
                <p className="text-sm font-bold text-gray-900">₹{subtotal.toLocaleString()}</p>
              </div>
            </div>

            {/* Poster */}
            <div className="flex-shrink-0 w-16 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
              {posterUrl ? (
                <img src={posterUrl} alt="poster" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation */}
          <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-800">Cancellation available</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Booking ref */}
          <div className="bg-white rounded-2xl border border-gray-200 px-5 py-4">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Booking Reference</p>
            <p className="font-mono text-gray-800 font-semibold tracking-wider"># {bookingRef}</p>
          </div>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="w-full lg:w-80 flex flex-col gap-4">

          {/* Payment summary */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Payment summary</h3>
            </div>

            {/* Order amount */}
            <div className="px-5 py-4 border-b border-gray-100">
              <button className="w-full flex items-center justify-between" onClick={() => setOrderOpen((p) => !p)}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-700">Order amount</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${orderOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">₹{subtotal.toLocaleString()}</span>
              </button>
              {orderOpen && (
                <div className="mt-3 space-y-2 pl-1">
                  {bookedSeats.length > 0
                    ? bookedSeats.map((seat, i) => (
                        <div key={i} className="flex justify-between text-xs text-gray-500">
                          <span>Seat {seat.seatno}</span>
                          <span>₹{(seat.rate ?? pricePerSeat).toLocaleString()}</span>
                        </div>
                      ))
                    : (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{seatCount} × Ticket @ ₹{pricePerSeat}</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                      )
                  }
                </div>
              )}
            </div>

            {/* Booking charge */}
            <div className="px-5 py-4 border-b border-gray-100">
              <button className="w-full flex items-center justify-between" onClick={() => setFeeOpen((p) => !p)}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-700">Booking charge (incl. of GST)</span>
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${feeOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">₹{bookingFee.toLocaleString()}</span>
              </button>
              {feeOpen && (
                <div className="mt-3 space-y-2 pl-1">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Internet handling fee</span>
                    <span>₹{Math.round(bookingFee * 0.7).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>GST</span>
                    <span>₹{Math.round(bookingFee * 0.3).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>

            {/* To be paid */}
            <div className="px-5 py-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">To be paid</span>
                <span className="text-base font-bold text-gray-900">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Your details */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Your details</h3>
              <button className="text-sm text-gray-900 underline underline-offset-2 font-medium">Edit</button>
            </div>
            <div className="px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">User Name</p>
                <p className="text-xs text-gray-500 mt-0.5">+91-XXXXXXXXXX</p>
              </div>
            </div>
          </div>

          {/* Proceed to Pay — desktop */}
          <button
            disabled={timerExpired}
            onClick={() => alert("Proceeding to payment!")}
            className="hidden lg:flex w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-5 py-4 items-center justify-between transition-colors"
          >
            <div className="text-left">
              <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Total</p>
            </div>
            <span className="text-sm font-semibold tracking-wide">Proceed To Pay →</span>
          </button>
        </div>
      </div>

      {/* ── Mobile sticky Pay button ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-30">
        <button
          disabled={timerExpired}
          onClick={() => alert("Proceeding to payment!")}
          className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl px-5 py-4 flex items-center justify-between transition-colors"
        >
          <div className="text-left">
            <p className="text-lg font-bold">₹{total.toLocaleString()}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Total</p>
          </div>
          <span className="text-sm font-semibold tracking-wide">Proceed To Pay →</span>
        </button>
      </div>

    </div>
  );
}