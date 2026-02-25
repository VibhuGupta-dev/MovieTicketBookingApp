import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API = "http://localhost:3000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState("idle");
  const [seatIds, setSeatIds] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [bookingFee, setBookingFee] = useState(0);
  const [ticketId, setTicketId] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [timerDisplay, setTimerDisplay] = useState("");
  const [timerExpired, setTimerExpired] = useState(false);

  
  useEffect(() => {
    const saved = localStorage.getItem("seatLock");
    if (!saved) {
      setTimerExpired(true)
      return;
    }
    const { lockedSeats, totalPrice, subtotal: sub, bookingFee: fee } = JSON.parse(saved);
    if (lockedSeats) setSeatIds(lockedSeats.map((s) => s._id ?? s));
    if (totalPrice) setTotal(totalPrice);
    if (sub) setSubtotal(sub);
    if (fee) setBookingFee(fee);
  }, []);

 
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

  async function handlePay() {
    if (timerExpired) return;
    setStep("loading");
    setErrorMsg("");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setErrorMsg("Failed to load Razorpay. Check your connection.");
      setStep("error");
      return;
    }

    try {
      const { data } = await axios.post(
        `${API}/payment/paymentorder/${bookingId}`,
        { seatId: seatIds },
        { withCredentials: true }
      );

      // ✅ Use backend amount as single source of truth
      setTotal(data.amount);
      setStep("paying");

      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount * 100,  // must match Razorpay order exactly
        currency: data.currency || "INR",
        name: "CineBook",
        description: "Movie Ticket Booking",
        order_id: data.orderId,
        theme: { color: "#4F46E5" },
        handler: async function (response) {
          await handleVerify(response, bookingId);
        },
        modal: {
          ondismiss: () => setStep("idle"),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setErrorMsg(response.error?.description || "Payment failed");
        setStep("error");
      });
      rzp.open();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Could not create order");
      setStep("error");
    }
  }

  async function handleVerify(response, showId) {
    setStep("verifying");
    try {
      const { data } = await axios.post(
        `${API}/payment/verify-payment/${showId}`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        { withCredentials: true }
      );

      if (data.success) {
        setTicketId(data.ticketId);
        setQrCode(data.qrCode);

        localStorage.removeItem("seatLock");
        setStep("success");
      } else {
        setErrorMsg("Payment verification failed");
        setStep("error");
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Verification error");
      setStep("error");
    }
  }

  // ════════════ TIMER EXPIRED ════════════
  if (timerExpired && step !== "success") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl px-8 py-10 max-w-sm w-full flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Session Expired</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Your seat reservation has expired. Please go back and select your seats again.
          </p>
          <button
            onClick={() => { localStorage.removeItem("seatLock"); navigate(-2); }}
            className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-2xl transition-all text-sm"
          >
            ← Select Seats Again
          </button>
        </div>
      </div>
    );
  }

  // ════════════ SUCCESS ════════════
  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-indigo-600 px-6 py-5 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-white text-xl font-bold tracking-tight">Booking Confirmed!</h2>
              <p className="text-indigo-200 text-sm mt-1">Your tickets are ready</p>
            </div>

            {/* Tear line */}
            <div className="flex items-center px-4">
              <div className="w-6 h-6 bg-gray-950 rounded-full -ml-3 flex-shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-gray-200 mx-1" />
              <div className="w-6 h-6 bg-gray-950 rounded-full -mr-3 flex-shrink-0" />
            </div>

            {/* QR Code */}
            <div className="px-6 py-5 flex flex-col items-center">
              {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-48 h-48 rounded-2xl border-4 border-gray-100 shadow-md" />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-400 text-sm">QR Loading…</p>
                </div>
              )}
              <p className="text-xs text-gray-400 mt-3 text-center">Show this QR at the cinema entrance</p>
            </div>

            <div className="px-6 pb-5 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Ticket ID</p>
              <p className="font-mono text-sm font-semibold text-gray-700 bg-gray-50 rounded-xl px-4 py-2 inline-block">
                #{String(ticketId).slice(-10).toUpperCase()}
              </p>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
              <span className="text-sm text-gray-500">Amount Paid</span>
              <span className="text-base font-bold text-gray-900">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button onClick={() => navigate("/")}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all text-sm tracking-wide">
              Back to Home
            </button>
            <button onClick={() => navigate("/bookings")}
              className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 font-medium rounded-2xl transition-all text-sm">
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ════════════ VERIFYING ════════════
  if (step === "verifying") {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-5 px-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-indigo-600/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-white font-semibold text-lg">Verifying Payment</p>
          <p className="text-gray-400 text-sm mt-1">Please wait, do not close this page</p>
        </div>
      </div>
    );
  }

  // ════════════ MAIN PAYMENT PAGE ════════════
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Timer banner */}
        {timerDisplay && !timerExpired && (
          <div className={`mb-5 rounded-2xl px-4 py-3 flex items-center justify-between
            ${parseInt(timerDisplay) === 0 && timerDisplay.startsWith("0:")
              ? "bg-red-500/10 border border-red-500/20"
              : "bg-amber-500/10 border border-amber-500/20"}`}>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-300">Seats reserved for</p>
            </div>
            <span className={`font-mono font-bold text-lg tabular-nums
              ${timerDisplay.startsWith("0:0") ? "text-red-400" : "text-amber-400"}`}>
              {timerDisplay}
            </span>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Complete Payment</h1>
          <p className="text-gray-400 text-sm mt-1">Secured by Razorpay</p>
        </div>

        {/* Payment Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Amount to Pay</p>
                <p className="text-3xl font-bold text-white">₹{total.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Seats</p>
                <p className="text-2xl font-bold text-indigo-400">{seatIds.length}</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 space-y-3 border-b border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Ticket price</span>
              <span className="text-gray-300 font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Booking fee (incl. GST)</span>
              <span className="text-gray-300 font-medium">₹{bookingFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-800">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-bold">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="px-6 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Payment Method</span>
              <span className="text-gray-300 font-medium flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                UPI / Card / Netbanking
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Security</span>
              <span className="text-green-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
                256-bit SSL Encrypted
              </span>
            </div>
          </div>

          {step === "error" && (
            <div className="mx-6 mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {errorMsg}
              </p>
            </div>
          )}

          <div className="px-6 pb-6">
            <button
              onClick={handlePay}
              disabled={step === "loading" || seatIds.length === 0 || timerExpired}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all duration-200 active:scale-[0.98] text-base tracking-wide flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/40"
            >
              {step === "loading" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Order…
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  Pay ₹{total.toLocaleString()}
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-5">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
          <p className="text-xs text-gray-600">Powered by Razorpay · PCI DSS Compliant</p>
        </div>

        <button onClick={() => navigate(-1)}
          className="w-full mt-4 py-3 text-sm text-gray-600 hover:text-gray-400 transition-colors">
          ← Go back
        </button>
      </div>
    </div>
  );
}