import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_BACKEND_URI

export default function AuthBox({ onClose }) {
  const [screen, setScreen] = useState("signin");
  const [signInForm, setSignInForm] = useState({ email: "", password: "" });
  const [signUpForm, setSignUpForm] = useState({ name: "", email: "", phoneNumber: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPass, setNewPass] = useState("");
  const [otp, setOtp] = useState("");
  const [otpHint, setOtpHint] = useState("");

  const [loading, setLoading] = useState(false);
  const [quickLoading, setQuickLoading] = useState(null); // "admin" | "owner" | null
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Quick Login (Admin / Owner) ──
  async function handleQuickLogin(role) {
    clearMessages();
    setQuickLoading(role);
    const credentials = role === "admin"
      ? { email: "vibhugupta962@gmail.com", password: "162216" }
      : { email: "vibhugupta022@gmail.com", password: "162216" };

    try {
      const res = await axios.post(`${API}/user/api/login`, credentials, { withCredentials: true });
      const token = res.data.token || res.data.accessToken || res.data.jwt;
      if (token) localStorage.setItem("token", token);
      setSuccess(`Logged in as ${role === "admin" ? "Admin" : "Owner"}!`);
      setTimeout(() => {
        onClose?.(res.data.user || true);
        if (role === "admin") navigate("/AdminPage");
        else navigate("/ownerpage");
      }, 800);
    } catch (err) {
      setError(err?.response?.data?.message || "Quick login failed. Try again.");
    } finally {
      setQuickLoading(null);
    }
  }

  // ── Sign In ──
  async function handleSignIn(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      const res = await axios.post(`${API}/user/api/login`, signInForm, { withCredentials: true });
      const token = res.data.token || res.data.accessToken || res.data.jwt;
      if (token) localStorage.setItem("token", token);
      const data = res.data.role;
      if (data == "owner") navigate("/ownerpage");
      if (data == "Admin") navigate('/AdminPage');
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
      const res = await axios.post(`${API}/user/api/register`, { ...signUpForm, role: "user" });
      if (res.data.otp) setOtpHint(`${res.data.otp}`);
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
      const res = await axios.post(`${API}/user/api/verifyOTP`, { email: signUpForm.email, otp }, { withCredentials: true });
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
      const res = await axios.post(`${API}/user/api/forgotpass`, { email: forgotEmail });
      if (res.data.otp) setOtpHint(`${res.data.otp}`);
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
      await axios.post(`${API}/user/api/veryfyforgototp`, { email: forgotEmail, otp: forgotOtp, newpass: newPass });
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

  const PrototypeBanner = () => (
    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2 mb-5">
      <span className="text-amber-400 text-base">⚠️</span>
      <p className="text-xs text-amber-400/90">
        <span className="font-semibold">Prototype Mode</span> — Email delivery is disabled. Your OTP will be shown on screen.
      </p>
    </div>
  );

  // ── Quick Access Panel (shown only on signin screen) ──
  const QuickAccessPanel = () => (
    <div className="mb-6 bg-gray-800/40 border border-gray-700/60 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-400 text-sm">🧪</span>
        <p className="text-xs font-semibold text-amber-400/90 uppercase tracking-widest">Prototype Quick Access</p>
      </div>
      <p className="text-xs text-gray-500 mb-3">Try the app as Admin or Owner — no credentials needed</p>
      <div className="flex gap-2">
        {/* Admin */}
        <button
          type="button"
          onClick={() => handleQuickLogin("admin")}
          disabled={quickLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 hover:border-rose-500/60 text-rose-300 hover:text-rose-200 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {quickLoading === "admin" ? (
            <div className="w-3.5 h-3.5 border-2 border-rose-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          )}
          Go as Admin
        </button>

        {/* Owner */}
        <button
          type="button"
          onClick={() => handleQuickLogin("owner")}
          disabled={quickLoading !== null}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 hover:text-emerald-200 text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {quickLoading === "owner" ? (
            <div className="w-3.5 h-3.5 border-2 border-emerald-300 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )}
          Go as Owner
        </button>
      </div>

      {/* Inline error/success for quick login */}
      {error && quickLoading === null && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-3">{error}</p>
      )}
      {success && quickLoading === null && (
        <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mt-3">{success}</p>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">

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

            {/* Quick Access */}
            <QuickAccessPanel />

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-700/60" />
              <span className="text-xs text-gray-600 font-medium">or sign in manually</span>
              <div className="flex-1 h-px bg-gray-700/60" />
            </div>

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
            <p className="text-center text-sm font-semibold text-indigo-400 mb-5">{signUpForm.email}</p>

            <PrototypeBanner />

            {otpHint && (
              <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/25 rounded-xl px-4 py-3 mb-5">
                <div>
                  <p className="text-xs text-indigo-400/70 uppercase tracking-widest font-semibold mb-0.5">Your OTP</p>
                  <p className="text-2xl font-bold tracking-[0.3em] text-indigo-300">{otpHint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp(otpHint)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all font-medium"
                >
                  Auto-fill
                </button>
              </div>
            )}

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
              <span onClick={() => { setScreen("signup"); clearMessages(); setOtp(""); setOtpHint(""); }}
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
            <p className="text-sm font-semibold text-indigo-400 mb-5">{forgotEmail}</p>

            <PrototypeBanner />

            {otpHint && (
              <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/25 rounded-xl px-4 py-3 mb-5">
                <div>
                  <p className="text-xs text-indigo-400/70 uppercase tracking-widest font-semibold mb-0.5">Your OTP</p>
                  <p className="text-2xl font-bold tracking-[0.3em] text-indigo-300">{otpHint}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotOtp(otpHint)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-all font-medium"
                >
                  Auto-fill
                </button>
              </div>
            )}

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