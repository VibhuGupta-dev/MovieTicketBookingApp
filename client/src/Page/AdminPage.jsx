import { useState, useEffect } from "react";
import axios from "axios";

const USER_API  = `${import.meta.env.VITE_BACKEND_URI}/user`;
const MOVIE_API = `${import.meta.env.VITE_BACKEND_URI}/movie`;

const EMPTY_MOVIE = {
  MovieName: "", MovieLength: "", Moviegenre: "", MovieTrailer: "",
  MovieReleaseDate: "", MovieType: "", MovieLanguage: "",
  MoviePhoto: "", MovieBackgroundPhoto: "", MovieDescription: "",
};
const EMPTY_ACTOR = { ActorName: "", ActorPhoto: "", RoleInMovie: "" };

// ── shared classes at module level ──
const inputCls = "w-full bg-gray-900 border border-gray-700/60 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200";
const labelCls = "block text-[10.5px] font-bold uppercase tracking-widest text-gray-500 mb-2";
const btnCls   = "w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all duration-200 tracking-wide shadow-lg shadow-indigo-900/40 disabled:opacity-40 disabled:cursor-not-allowed";

// ─────────────────────────────────────────────────────────────────────────────
// !! CRITICAL: MovieFields is defined OUTSIDE AdminPage so React never
//    recreates it on re-render — keeps input focus intact on every keystroke.
// ─────────────────────────────────────────────────────────────────────────────
function MovieFields({ form, onUpdate, castArr, onUpdateCast, onAddCast, onRemoveCast }) {
  return (
    <div className="space-y-8">

      {/* ── Basic Info ── */}
      <div>
        <SectionDivider label="Basic Info" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className={labelCls}>Movie Name <Req /></label>
            <input type="text" placeholder="e.g. Interstellar" className={inputCls}
              value={form.MovieName} onChange={(e) => onUpdate("MovieName", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Length (min) <Req /></label>
            <input type="number" placeholder="169" min="1" className={inputCls}
              value={form.MovieLength} onChange={(e) => onUpdate("MovieLength", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Genre <Req /></label>
            <input type="text" placeholder="e.g. Sci-Fi" className={inputCls}
              value={form.Moviegenre} onChange={(e) => onUpdate("Moviegenre", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Release Date <Req /></label>
            <input type="date" className={`${inputCls} [color-scheme:dark]`}
              value={form.MovieReleaseDate} onChange={(e) => onUpdate("MovieReleaseDate", e.target.value)} required />
          </div>
          <div>
            <label className={labelCls}>Movie Type <Req /></label>
            <select className={`${inputCls} cursor-pointer`}
              value={form.MovieType} onChange={(e) => onUpdate("MovieType", e.target.value)} required>
              <option value="" disabled className="bg-gray-900">Select type…</option>
              <option value="2d" className="bg-gray-900">2D</option>
              <option value="3d" className="bg-gray-900">3D</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <input type="text" placeholder="e.g. English" className={inputCls}
              value={form.MovieLanguage} onChange={(e) => onUpdate("MovieLanguage", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Trailer URL <Req /></label>
            <input type="url" placeholder="https://youtube.com/..." className={inputCls}
              value={form.MovieTrailer} onChange={(e) => onUpdate("MovieTrailer", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* ── Media ── */}
      <div>
        <SectionDivider label="Media" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Poster URL</label>
            <input type="url" placeholder="https://..." className={inputCls}
              value={form.MoviePhoto} onChange={(e) => onUpdate("MoviePhoto", e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Background URL</label>
            <input type="url" placeholder="https://..." className={inputCls}
              value={form.MovieBackgroundPhoto} onChange={(e) => onUpdate("MovieBackgroundPhoto", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Description <Req /></label>
            <textarea rows={3} placeholder="Short description…" className={`${inputCls} resize-none`}
              value={form.MovieDescription} onChange={(e) => onUpdate("MovieDescription", e.target.value)} required />
          </div>
        </div>
      </div>

      {/* ── Cast ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">Cast <Req /></span>
          <div className="flex-1 h-px bg-indigo-500/15" />
          <button type="button" onClick={onAddCast}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 text-xs font-semibold transition-all">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Actor
          </button>
        </div>
        <div className="space-y-3">
          {castArr.map((actor, idx) => (
            <div key={idx} className="group relative bg-gray-900/60 border border-gray-700/40 rounded-2xl p-4 hover:border-indigo-500/20 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-600/20 border border-indigo-500/25 flex items-center justify-center text-[9px] font-bold text-indigo-400">{idx + 1}</span>
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-gray-600">Actor</span>
                </div>
                {castArr.length > 1 && (
                  <button type="button" onClick={() => onRemoveCast(idx)}
                    className="w-6 h-6 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className={labelCls}>Actor Name</label>
                  <input type="text" placeholder="e.g. Tom Hanks" className={inputCls}
                    value={actor.ActorName} onChange={(e) => onUpdateCast(idx, "ActorName", e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Role in Movie</label>
                  <input type="text" placeholder="e.g. Cooper" className={inputCls}
                    value={actor.RoleInMovie} onChange={(e) => onUpdateCast(idx, "RoleInMovie", e.target.value)} required />
                </div>
                <div>
                  <label className={labelCls}>Actor Photo URL</label>
                  <input type="url" placeholder="https://..." className={inputCls}
                    value={actor.ActorPhoto} onChange={(e) => onUpdateCast(idx, "ActorPhoto", e.target.value)} required />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── tiny helpers (also outside) ──
function Req() { return <span className="text-red-500/70">*</span>; }

function SectionDivider({ label }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">{label}</span>
      <div className="flex-1 h-px bg-indigo-500/15" />
    </div>
  );
}

function Spinner({ label }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      {label}
    </span>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export function AdminPage() {
  // 0 = Make Owner | 1 = Add Movie | 2 = All Movies
  const [section, setSection] = useState(0);

  // ── Owner signup ──
  const [screen, setScreen]         = useState("signup");
  const [signUpForm, setSignUpForm]  = useState({ name: "", email: "", phoneNumber: "", password: "" });
  const [otp, setOtp]               = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Add Movie ──
  const [movieForm, setMovieForm]       = useState({ ...EMPTY_MOVIE });
  const [cast, setCast]                 = useState([{ ...EMPTY_ACTOR }]);
  const [movieLoading, setMovieLoading] = useState(false);
  const [movieError, setMovieError]     = useState("");
  const [movieSuccess, setMovieSuccess] = useState("");

  const updateMovie     = (f, v) => setMovieForm((p) => ({ ...p, [f]: v }));
  const updateCast      = (i, f, v) => setCast((p) => p.map((c, idx) => idx === i ? { ...c, [f]: v } : c));
  const addCastRow      = () => setCast((p) => [...p, { ...EMPTY_ACTOR }]);
  const removeCastRow   = (i) => setCast((p) => p.filter((_, idx) => idx !== i));

  // ── All Movies ──
  const [movies, setMovies]               = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [moviesError, setMoviesError]     = useState("");

  // ── Edit Modal ──
  const [editMovie, setEditMovie]       = useState(null);
  const [editForm, setEditForm]         = useState({ ...EMPTY_MOVIE });
  const [editCast, setEditCast]         = useState([{ ...EMPTY_ACTOR }]);
  const [editLoading, setEditLoading]   = useState(false);
  const [editError, setEditError]       = useState("");
  const [editSuccess, setEditSuccess]   = useState("");

  const updateEdit      = (f, v) => setEditForm((p) => ({ ...p, [f]: v }));
  const updateEditCast  = (i, f, v) => setEditCast((p) => p.map((c, idx) => idx === i ? { ...c, [f]: v } : c));
  const addEditCastRow  = () => setEditCast((p) => [...p, { ...EMPTY_ACTOR }]);
  const removeEditCastRow = (i) => setEditCast((p) => p.filter((_, idx) => idx !== i));

  // ── Delete confirm ──
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ── Auth handlers ──
  async function handleSignUp(e) {
    e.preventDefault(); clearMessages(); setLoading(true);
    try {
      await axios.post(`${USER_API}/api/register`, { ...signUpForm, role: "owner" });
      setSuccess("OTP sent to your email!"); setScreen("otp-signup");
    } catch (err) { setError(err?.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  }

  async function handleVerifySignupOtp(e) {
    e.preventDefault(); clearMessages(); setLoading(true);
    try {
      const res = await axios.post(`${USER_API}/api/verifyOTP`, { email: signUpForm.email, otp }, { withCredentials: true });
      console.log(res); setSuccess("Account created!"); setScreen("signup");
    } catch (err) { setError(err?.response?.data?.message || "OTP verification failed"); }
    finally { setLoading(false); }
  }

  // ── Movie handlers ──
  async function handleAddMovie(e) {
    e.preventDefault(); setMovieError(""); setMovieSuccess(""); setMovieLoading(true);
    try {
      const res = await axios.post(`${MOVIE_API}/api/addmovie`,
        { ...movieForm, MovieLength: Number(movieForm.MovieLength), cast },
        { withCredentials: true }
      );
      setMovieSuccess(res.data?.message || "Movie added successfully!");
      setMovieForm({ ...EMPTY_MOVIE });
      setCast([{ ...EMPTY_ACTOR }]);
    } catch (err) { setMovieError(err?.response?.data?.message || "Failed to add movie"); }
    finally { setMovieLoading(false); }
  }

  async function fetchMovies() {
    setMoviesLoading(true); setMoviesError("");
    try {
      const res = await axios.get(`${MOVIE_API}/api/allmovie`);
      setMovies(res.data || []);
    } catch (err) { setMoviesError(err?.response?.data?.message || "Failed to load movies"); }
    finally { setMoviesLoading(false); }
  }

  useEffect(() => { if (section === 2) fetchMovies(); }, [section]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${MOVIE_API}/api/delete/${deleteTarget._id}`, { withCredentials: true });
      setMovies((p) => p.filter((m) => m._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { alert(err?.response?.data?.message || "Delete failed"); }
    finally { setDeleteLoading(false); }
  }

  function openEdit(movie) {
    setEditMovie(movie); setEditError(""); setEditSuccess("");
    const date = movie.MovieReleaseDate ? movie.MovieReleaseDate.slice(0, 10) : "";
    setEditForm({
      MovieName: movie.MovieName || "", MovieLength: movie.MovieLength || "",
      Moviegenre: movie.Moviegenre || "", MovieTrailer: movie.MovieTrailer || "",
      MovieReleaseDate: date, MovieType: movie.MovieType || "",
      MovieLanguage: movie.MovieLanguage || "", MoviePhoto: movie.MoviePhoto || "",
      MovieBackgroundPhoto: movie.MovieBackgroundPhoto || "",
      MovieDescription: movie.MovieDescription || "",
    });
    setEditCast(movie.cast?.length ? movie.cast.map((c) => ({ ...c })) : [{ ...EMPTY_ACTOR }]);
  }

  async function handleUpdate(e) {
    e.preventDefault(); setEditError(""); setEditSuccess(""); setEditLoading(true);
    try {
      const res = await axios.put(`${MOVIE_API}/api/updatemovie/${editMovie._id}`,
        { ...editForm, MovieLength: Number(editForm.MovieLength), cast: editCast },
        { withCredentials: true }
      );
      setEditSuccess("Movie updated!");
      setMovies((p) => p.map((m) => m._id === editMovie._id ? res.data : m));
    } catch (err) { setEditError(err?.response?.data?.message || "Update failed"); }
    finally { setEditLoading(false); }
  }

  // ─────────────────────────── RENDER ──────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-[#070b14] flex flex-col items-center overflow-x-hidden">

      {/* bg blobs */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[100px]" />
      </div>
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "56px 56px" }} />

      <div className="relative z-10 flex flex-col items-center w-full px-4 pt-10 pb-16">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-indigo-400">Control Panel</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-200 to-indigo-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-xs text-gray-600 tracking-wide">Manage owners &amp; content from one place</p>
        </div>

        {/* 3-way Toggle */}
        <div className="inline-flex items-center bg-[#0e1120] border border-indigo-500/15 rounded-full p-1.5 cursor-pointer select-none mb-8 shadow-xl shadow-black/30 backdrop-blur-md">
          {[["Make An Owner", 0], ["Add A Movie", 1], ["All Movies", 2]].map(([label, idx]) => (
            <span key={idx} onClick={() => setSection(idx)}
              className={`px-5 py-2 rounded-full text-[12.5px] font-semibold tracking-wide transition-all duration-300 ${
                section === idx ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/50" : "text-gray-500 hover:text-gray-400"
              }`}>
              {label}
            </span>
          ))}
        </div>

        <div className="w-full flex justify-center">

          {/* ══════════════ MAKE AN OWNER ══════════════ */}
          {section === 0 && (
            <div className="w-full max-w-md">
              <div className="w-full bg-[#0a0e1a]/80 border border-white/[0.06] rounded-3xl shadow-2xl shadow-black/60 p-8 backdrop-blur-xl ring-1 ring-inset ring-white/[0.04]">

                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-xl scale-125" />
                    <svg width="56" height="56" viewBox="0 0 200 200" fill="none" className="relative drop-shadow-[0_4px_20px_rgba(99,102,241,0.5)]">
                      <circle cx="100" cy="100" r="95" stroke="#4F46E5" strokeWidth="10" fill="#111827" />
                      <circle cx="100" cy="80" r="30" fill="#E5E7EB" />
                      <path d="M50 150 C50 120, 150 120, 150 150 Z" fill="#E5E7EB" />
                    </svg>
                  </div>
                </div>

                {screen === "signup" && (
                  <>
                    <h2 className="text-center text-2xl font-bold text-white tracking-tight mb-1">Create Owner Account</h2>
                    <p className="text-center text-xs text-gray-600 mb-6">Fill in the details below to register a new owner</p>
                    <div className="flex bg-gray-800/40 rounded-xl p-1 mb-6 border border-gray-700/40">
                      <button className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white shadow shadow-indigo-900/40 tracking-wide">Make an Owner</button>
                    </div>
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div><label className={labelCls}>Full Name</label>
                        <input type="text" placeholder="Jane Doe" className={inputCls} value={signUpForm.name} onChange={(e) => setSignUpForm({ ...signUpForm, name: e.target.value })} required /></div>
                      <div><label className={labelCls}>Email</label>
                        <input type="email" placeholder="hello@example.com" className={inputCls} value={signUpForm.email} onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })} required /></div>
                      <div><label className={labelCls}>Phone Number</label>
                        <input type="tel" placeholder="+91 XXXXXXXXXX" className={inputCls} value={signUpForm.phoneNumber} onChange={(e) => setSignUpForm({ ...signUpForm, phoneNumber: e.target.value })} required /></div>
                      <div><label className={labelCls}>Password</label>
                        <input type="password" placeholder="••••••••" className={inputCls} value={signUpForm.password} onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })} required /></div>
                      {error   && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{error}</p>}
                      {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{success}</p>}
                      <button type="submit" disabled={loading} className={btnCls}>{loading ? "Sending OTP…" : "Create Account"}</button>
                    </form>
                  </>
                )}

                {screen === "otp-signup" && (
                  <>
                    <h2 className="text-center text-2xl font-bold text-white tracking-tight mb-1">Verify Email</h2>
                    <p className="text-center text-sm text-gray-500 mb-1">We sent a 4-digit OTP to</p>
                    <p className="text-center text-sm font-semibold text-indigo-400 mb-8">{signUpForm.email}</p>
                    <form onSubmit={handleVerifySignupOtp} className="space-y-4">
                      <div><label className={labelCls}>Enter OTP</label>
                        <input type="text" inputMode="numeric" maxLength={4} placeholder="- - - -"
                          className={`${inputCls} text-center text-2xl tracking-[0.5em] font-bold`}
                          value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required /></div>
                      {error   && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{error}</p>}
                      {success && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{success}</p>}
                      <button type="submit" disabled={loading} className={btnCls}>{loading ? "Verifying…" : "Verify OTP"}</button>
                    </form>
                    <p className="text-center text-xs text-gray-600 mt-6">Wrong email?{" "}
                      <span onClick={() => { setScreen("signup"); clearMessages(); setOtp(""); }} className="text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">Go back</span>
                    </p>
                  </>
                )}

                {screen === "forgot" && (
                  <>
                    <button onClick={() => { setScreen("signin"); clearMessages(); }} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                      Back to Sign In
                    </button>
                    <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Forgot Password</h2>
                    <p className="text-sm text-gray-500 mb-7 leading-relaxed">Enter your registered email to receive a reset OTP</p>
                  </>
                )}

                {screen === "otp-forgot" && (
                  <button onClick={() => { setScreen("forgot"); clearMessages(); }} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-6 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back
                  </button>
                )}

              </div>
            </div>
          )}

          {/* ══════════════ ADD A MOVIE ══════════════ */}
          {section === 1 && (
            <div className="w-full max-w-2xl">
              <div className="w-full bg-[#0a0e1a]/80 border border-white/[0.06] rounded-3xl shadow-2xl shadow-black/60 p-8 backdrop-blur-xl ring-1 ring-inset ring-white/[0.04]">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Add New Movie</h2>
                    <p className="text-xs text-gray-600 mt-0.5">Fill all required fields and add cast members</p>
                  </div>
                </div>

                <form onSubmit={handleAddMovie}>
                  <MovieFields
                    form={movieForm}    onUpdate={updateMovie}
                    castArr={cast}      onUpdateCast={updateCast}
                    onAddCast={addCastRow} onRemoveCast={removeCastRow}
                  />
                  <div className="mt-6 space-y-3">
                    {movieError   && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{movieError}</p>}
                    {movieSuccess && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{movieSuccess}</p>}
                    <button type="submit" disabled={movieLoading} className={btnCls}>
                      {movieLoading ? <Spinner label="Adding Movie…" /> : "Add Movie"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ══════════════ ALL MOVIES ══════════════ */}
          {section === 2 && (
            <div className="w-full max-w-5xl">
              <div className="w-full bg-[#0a0e1a]/80 border border-white/[0.06] rounded-3xl shadow-2xl shadow-black/60 p-8 backdrop-blur-xl ring-1 ring-inset ring-white/[0.04]">

                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight">All Movies</h2>
                      <p className="text-xs text-gray-600 mt-0.5">{movies.length} movie{movies.length !== 1 ? "s" : ""} in database</p>
                    </div>
                  </div>
                  <button onClick={fetchMovies}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 text-xs font-semibold transition-all">
                    <svg className={`w-3.5 h-3.5 ${moviesLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                {moviesLoading && (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    <span className="text-sm text-gray-600">Loading movies…</span>
                  </div>
                )}

                {moviesError && !moviesLoading && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{moviesError}</p>
                )}

                {!moviesLoading && !moviesError && movies.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gray-800/60 border border-gray-700/40 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600">No movies found</p>
                  </div>
                )}

                {!moviesLoading && movies.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {movies.map((movie) => (
                      <div key={movie._id}
                        className="group relative bg-gray-900/60 border border-gray-700/40 rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20">

                        <div className="relative h-40 bg-gray-800/80 overflow-hidden">
                          {movie.MovieBackgroundPhoto || movie.MoviePhoto ? (
                            <img src={movie.MovieBackgroundPhoto || movie.MoviePhoto} alt={movie.MovieName}
                              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4" />
                              </svg>
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-indigo-300 border border-indigo-500/30">
                              {movie.MovieType || "—"}
                            </span>
                          </div>
                          {movie.MoviePhoto && (
                            <div className="absolute bottom-2 right-2 w-8 h-10 rounded-md overflow-hidden border border-white/10 shadow-lg">
                              <img src={movie.MoviePhoto} alt="" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-sm font-bold text-white truncate mb-1">{movie.MovieName}</h3>
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {movie.Moviegenre && <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-600/15 border border-indigo-500/20 text-indigo-400 font-medium">{movie.Moviegenre}</span>}
                            {movie.MovieLength && <span className="text-[10px] text-gray-600 font-medium">{movie.MovieLength} min</span>}
                            {movie.MovieLanguage && <span className="text-[10px] text-gray-600 font-medium">{movie.MovieLanguage}</span>}
                          </div>
                          {movie.MovieDescription && (
                            <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">{movie.MovieDescription}</p>
                          )}
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(movie)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 hover:bg-indigo-600/25 text-xs font-semibold transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button onClick={() => setDeleteTarget(movie)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════ EDIT MODAL ══════════════ */}
      {editMovie && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl bg-[#0a0e1a] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/80 p-8 my-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Edit Movie</h2>
                  <p className="text-xs text-gray-600 mt-0.5 truncate max-w-[220px]">{editMovie.MovieName}</p>
                </div>
              </div>
              <button onClick={() => setEditMovie(null)}
                className="w-8 h-8 rounded-xl bg-gray-800 border border-gray-700/50 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-700 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate}>
              <MovieFields
                form={editForm}       onUpdate={updateEdit}
                castArr={editCast}    onUpdateCast={updateEditCast}
                onAddCast={addEditCastRow} onRemoveCast={removeEditCastRow}
              />
              <div className="mt-6 space-y-3">
                {editError   && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">{editError}</p>}
                {editSuccess && <p className="text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2.5">{editSuccess}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditMovie(null)}
                    className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700/60 text-gray-400 text-sm font-semibold rounded-xl transition-all">
                    Cancel
                  </button>
                  <button type="submit" disabled={editLoading} className={`flex-1 ${btnCls}`}>
                    {editLoading ? <Spinner label="Saving…" /> : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ DELETE CONFIRM ══════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-[#0a0e1a] border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/80 p-8">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
            </div>
            <h3 className="text-center text-lg font-bold text-white mb-1">Delete Movie?</h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="text-white font-semibold">"{deleteTarget.MovieName}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700/60 text-gray-400 text-sm font-semibold rounded-xl transition-all">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-red-900/40">
                {deleteLoading ? <Spinner label="Deleting…" /> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}