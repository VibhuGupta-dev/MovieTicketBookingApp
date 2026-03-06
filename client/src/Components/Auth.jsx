// Auth.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = "http://localhost:3000/user";

export default function AuthBox({ onClose }) {

  const [screen, setScreen] = useState("signin");

  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ name: "", email: "", phoneNumber: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate()
  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Sign In ──
  async function handleSignIn(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/login`, signInForm, { withCredentials: true });
      console.log("LOGIN RESPONSE:", res.data);
      // ✅ Save token so navbar persists login across refreshes
      const token = res.data.token || res.data.accessToken || res.data.jwt;
      if (token) localStorage.setItem("token", token);
      const data = res.data.role
      if(data == "owner"){
         navigate("/ownerpage")
      }
      if(data == "Admin") {
        navigate('/AdminPage')
      }
      setSuccess("Logged in successfully!");
      setTimeout(() => onClose?.(res.data.user || true), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Sign Up → send OTP ──
  async function handleSignUp(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await axios.post(`${API}/api/register`, { ...signUpForm, role: "user" });
      setSuccess("OTP sent to your email!");
      setScreen("otp-signup");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Verify Signup OTP ──
  async function handleVerifySignupOtp(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/verifyOTP`, { email: signUpForm.email, otp }, { withCredentials: true });

      // ✅ Save token so navbar persists login across refreshes
      const token = res.data.token || res.data.accessToken || res.data.jwt;
      if (token) localStorage.setItem("token", token);

      setSuccess("Account created! You're now logged in.");
      setTimeout(() => onClose?.(res.data.user || true), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Forgot Password ──
  async function handleForgotPass(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await axios.post(`${API}/api/forgotpass`, { email: forgotEmail });
      setSuccess("OTP sent to your email!");
      setScreen("otp-forgot");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // ── Verify Forgot OTP ──
  async function handleVerifyForgotOtp(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await axios.post(`${API}/api/veryfyforgototp`, { email: forgotEmail, otp: forgotOtp, newpass: newPass });
      setSuccess("Password updated! Please sign in.");
      setTimeout(() => { setScreen("signin"); clearMessages(); }, 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-gray-800/70 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2";
  const btnCls   = "w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 tracking-wide shadow-lg shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative">

        {/* Close */}
        <button
          onClick={() => onClose?.()}
          className="absolute top-4 right-5 text-gray-600 hover:text-gray-300 text-2xl leading-none transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
        >×</button>

        {/* Avatar */}
        <div className="flex justify-center mb-5">
          <svg width="52" height="52" viewBox="0 0 200 200" fill="none"
            className="drop-shadow-[0_4px_16px_rgba(99,102,241,0.4)]">
            <circle cx="100" cy="100" r="95" stroke="#4F46E5" strokeWidth="10" fill="#111827" />
            <circle cx="100" cy="80" r="30" fill="#E5E7EB" />
            <path d="M50 150 C50 120, 150 120, 150 150 Z" fill="#E5E7EB" />
          </svg>
        </div>

        {/* ════════ SIGN IN ════════ */}
        {screen === "signin" && (
          <>
            <h2 className="text-center text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-center text-sm text-gray-500 mb-7">Sign in to continue with your booking</p>

            <div className="flex bg-gray-800/60 rounded-xl p-1 mb-7 border border-gray-700/50">
              <button className="flex-1 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white shadow">Sign In</button>
              <button onClick={() => { setScreen("signup"); clearMessages(); }}
                className="flex-1 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-gray-200 transition-all">
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" placeholder="hello@example.com" className={inputCls}
                  value={signInForm.email}
                  onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" placeholder="••••••••" className={inputCls}
                  value={signInForm.password}
                  onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })} required />
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => { setScreen("forgot"); clearMessages(); }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
                  Forgot password?
                </button>
              </div>

              {error   && <p className="text-xs text-red-400   bg-red-500/10   border border-red-500/20   rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{success}</p>}

              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Don't have an account?{" "}
              <span onClick={() => { setScreen("signup"); clearMessages(); }}
                className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Sign Up</span>
            </p>
          </>
        )}

        {/* ════════ SIGN UP ════════ */}
        {screen === "signup" && (
          <>
            <h2 className="text-center text-2xl font-bold text-white mb-1">Create account</h2>
            <p className="text-center text-sm text-gray-500 mb-7">Join us today — it's completely free</p>

            <div className="flex bg-gray-800/60 rounded-xl p-1 mb-7 border border-gray-700/50">
              <button onClick={() => { setScreen("signin"); clearMessages(); }}
                className="flex-1 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-gray-200 transition-all">
                Sign In
              </button>
              <button className="flex-1 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white shadow">Sign Up</button>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" placeholder="Jane Doe" className={inputCls}
                  value={signUpForm.name}
                  onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" placeholder="hello@example.com" className={inputCls}
                  value={signUpForm.email}
                  onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input type="tel" placeholder="+91 XXXXXXXXXX" className={inputCls}
                  value={signUpForm.phoneNumber}
                  onChange={(e) => setSignUpForm({ ...signUpForm, phoneNumber: e.target.value })} required />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input type="password" placeholder="••••••••" className={inputCls}
                  value={signUpForm.password}
                  onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })} required />
              </div>

              {error   && <p className="text-xs text-red-400   bg-red-500/10   border border-red-500/20   rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{success}</p>}

              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Sending OTP…" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Already have an account?{" "}
              <span onClick={() => { setScreen("signin"); clearMessages(); }}
                className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Sign In</span>
            </p>
          </>
        )}

        {/* ════════ OTP — SIGNUP ════════ */}
        {screen === "otp-signup" && (
          <>
            <h2 className="text-center text-2xl font-bold text-white mb-1">Verify Email</h2>
            <p className="text-center text-sm text-gray-500 mb-1">We sent a 4-digit OTP to</p>
            <p className="text-center text-sm font-semibold text-indigo-400 mb-8">{signUpForm.email}</p>

            <form onSubmit={handleVerifySignupOtp} className="space-y-4">
              <div>
                <label className={labelCls}>Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="- - - -"
                  className={`${inputCls} text-center text-2xl tracking-[0.5em] font-bold`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>

              {error   && <p className="text-xs text-red-400   bg-red-500/10   border border-red-500/20   rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{success}</p>}

              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Verifying…" : "Verify OTP"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-6">
              Wrong email?{" "}
              <span onClick={() => { setScreen("signup"); clearMessages(); setOtp(""); }}
                className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Go back</span>
            </p>
          </>
        )}

        {/* ════════ FORGOT PASSWORD ════════ */}
        {screen === "forgot" && (
          <>
            <button onClick={() => { setScreen("signin"); clearMessages(); }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sign In
            </button>

            <h2 className="text-2xl font-bold text-white mb-1">Forgot Password</h2>
            <p className="text-sm text-gray-500 mb-7">Enter your registered email to receive a reset OTP</p>

            <form onSubmit={handleForgotPass} className="space-y-4">
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" placeholder="hello@example.com" className={inputCls}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)} required />
              </div>

              {error   && <p className="text-xs text-red-400   bg-red-500/10   border border-red-500/20   rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{success}</p>}

              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Sending OTP…" : "Send Reset OTP"}
              </button>
            </form>
          </>
        )}

        {/* ════════ OTP — FORGOT PASSWORD ════════ */}
        {screen === "otp-forgot" && (
          <>
            <button onClick={() => { setScreen("forgot"); clearMessages(); }}
              className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-5 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <h2 className="text-2xl font-bold text-white mb-1">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-1">OTP sent to</p>
            <p className="text-sm font-semibold text-indigo-400 mb-7">{forgotEmail}</p>

            <form onSubmit={handleVerifyForgotOtp} className="space-y-5">
              <div>
                <label className={labelCls}>Enter OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="- - - -"
                  className={`${inputCls} text-center text-2xl tracking-[0.5em] font-bold`}
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value.replace(/\D/g, ""))}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>New Password</label>
                <input type="password" placeholder="••••••••" className={inputCls}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)} required />
              </div>

              {error   && <p className="text-xs text-red-400   bg-red-500/10   border border-red-500/20   rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">{success}</p>}

              <button type="submit" disabled={loading} className={btnCls}>
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}