import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000";

function getToken() { return localStorage.getItem("token"); }
function authHeaders() {
  return { headers: { Authorization: `Bearer ${getToken()}` }, withCredentials: true };
}

// ── SVG Icons ─────────────────────────────────────────────
const Icons = {
  Film: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  ),
  Seat: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M5 10a2 2 0 012-2h10a2 2 0 012 2v6H5v-6zM3 16h18v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM8 8V6a4 4 0 018 0v2" />
    </svg>
  ),
  Movie: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
    </svg>
  ),
  Check: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Edit: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Plus: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Close: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Back: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  Location: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Clock: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Theater: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 22V12h6v10" />
    </svg>
  ),
  Warning: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  ChevronDown: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Search: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

// ── StatCard ──────────────────────────────────────────────
function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-xs uppercase tracking-widest">{label}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ── EditModal ─────────────────────────────────────────────
function EditModal({ cinema, onClose, onSaved }) {
  const [form, setForm] = useState({
    cinemaHallName: cinema.cinemaHallName || "",
    description: cinema.description || "",
    address: cinema.address || "",
    locationLink: cinema.locationLink || "",
    logo: cinema.logo || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      await axios.put(`${API}/cinemahall/api/updatecinemahall/${cinema._id}`, form, authHeaders());
      onSaved();
    } catch (err) { setError(err?.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
          {Icons.Close("h-4 w-4")}
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">{Icons.Edit("h-5 w-5")}</div>
          <div>
            <h2 className="text-white font-bold text-lg">Edit Cinema</h2>
            <p className="text-gray-500 text-xs">{cinema.cinemaHallName}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className={labelCls}>Cinema Name</label><input name="cinemaHallName" value={form.cinemaHallName} onChange={handleChange} className={inputCls} required /></div>
          <div><label className={labelCls}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} /></div>
          <div><label className={labelCls}>Address</label><input name="address" value={form.address} onChange={handleChange} className={inputCls} /></div>
          <div><label className={labelCls}>Location Link</label><input name="locationLink" value={form.locationLink} onChange={handleChange} className={inputCls} placeholder="https://maps.google.com/..." /></div>
          <div><label className={labelCls}>Logo URL</label><input name="logo" value={form.logo} onChange={handleChange} className={inputCls} placeholder="https://..." /></div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── DeleteModal ───────────────────────────────────────────
function DeleteModal({ cinema, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true); setError("");
    try {
      await axios.delete(`${API}/cinemahall/api/deletecinemahall/${cinema._id}`, authHeaders());
      onDeleted();
    } catch (err) { setError(err?.response?.data?.message || "Delete failed"); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
          {Icons.Close("h-4 w-4")}
        </button>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-16 w-16 bg-red-500/15 rounded-2xl flex items-center justify-center text-red-400 mb-4">{Icons.Trash("h-8 w-8")}</div>
          <h2 className="text-white font-bold text-xl mb-2">Delete Cinema?</h2>
          <p className="text-gray-400 text-sm">This will permanently delete <span className="text-white font-semibold">"{cinema.cinemaHallName}"</span>. This action cannot be undone.</p>
        </div>
        {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
          <button onClick={handleDelete} disabled={loading} className="flex-1 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-red-900/30">
            {loading ? "Deleting…" : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CinemaCard ────────────────────────────────────────────
function CinemaCard({ cinema, onEdit, onDelete, onManageShows }) {
  const totalSeats = cinema.seats?.length || 0;
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-200 group">
      <div className="relative h-40 bg-gray-800 overflow-hidden">
        {cinema.logo
          ? <img src={cinema.logo} alt={cinema.cinemaHallName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-gray-700">{Icons.Theater("h-16 w-16 opacity-40")}</div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button onClick={() => onEdit(cinema)} title="Edit"
            className="h-8 w-8 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors shadow-lg">
            {Icons.Edit("h-3.5 w-3.5")}
          </button>
          <button onClick={() => onDelete(cinema)} title="Delete"
            className="h-8 w-8 bg-red-600/90 hover:bg-red-500 text-white rounded-lg flex items-center justify-center backdrop-blur-sm transition-colors shadow-lg">
            {Icons.Trash("h-3.5 w-3.5")}
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-white font-bold text-base truncate mb-1">{cinema.cinemaHallName}</h3>
        <p className="text-gray-500 text-xs truncate mb-3">{cinema.address || "No address set"}</p>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">{cinema.description || "No description"}</p>
        <div className="flex items-center gap-3 mb-4">
          {[["Rows", cinema.row || 0], ["Per Row", cinema.seatsPerRow || 0], ["Seats", totalSeats]].map(([lbl, val]) => (
            <div key={lbl} className="flex-1 bg-gray-800 rounded-xl px-3 py-2 text-center">
              <p className="text-indigo-400 text-sm font-bold">{val}</p>
              <p className="text-gray-500 text-xs">{lbl}</p>
            </div>
          ))}
        </div>
        {cinema.locationLink && (
          <a href={cinema.locationLink} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors truncate mb-4">
            {Icons.Location("h-3.5 w-3.5 flex-shrink-0")}
            <span className="truncate">View on Maps</span>
          </a>
        )}
        <div className="flex gap-2 mb-2">
          <button onClick={() => onManageShows(cinema)}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 hover:text-purple-300 text-xs font-semibold rounded-xl transition-all border border-purple-600/20 hover:border-purple-600/40">
            {Icons.Film("h-3.5 w-3.5")} Manage Shows
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(cinema)}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 hover:text-indigo-300 text-xs font-semibold rounded-xl transition-all border border-indigo-600/20 hover:border-indigo-600/40">
            {Icons.Edit("h-3.5 w-3.5")} Edit
          </button>
          <button onClick={() => onDelete(cinema)}
            className="flex-1 py-2.5 flex items-center justify-center gap-1.5 bg-red-600/10 hover:bg-red-600/25 text-red-400 hover:text-red-300 text-xs font-semibold rounded-xl transition-all border border-red-600/20 hover:border-red-600/40">
            {Icons.Trash("h-3.5 w-3.5")} Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AddCinemaModal ────────────────────────────────────────
function AddCinemaModal({ onClose, onAdded }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    cinemaHallName: "", description: "", address: "", locationLink: "", logo: "",
    StateId: "", CityId: "", row: "", seatsPerRow: "", RatePerSeat: "",
    location: { latitude: "", longitude: "" },
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const [statesLoading, setStatesLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_CITY_API;
  const BASE_URL = "https://api.countrystatecity.in/v1";

  useEffect(() => {
    setStatesLoading(true);
    fetch(`${BASE_URL}/countries/IN/states`, { headers: { "X-CSCAPI-KEY": API_KEY } })
      .then((r) => r.json()).then((d) => setStates(Array.isArray(d) ? d : []))
      .catch(() => setStates([])).finally(() => setStatesLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedState) return;
    setCities([]); setSelectedCity(null); setForm((f) => ({ ...f, CityId: "" }));
    setCitiesLoading(true);
    fetch(`${BASE_URL}/countries/IN/states/${selectedState.iso2}/cities`, { headers: { "X-CSCAPI-KEY": API_KEY } })
      .then((r) => r.json()).then((d) => setCities(Array.isArray(d) ? d : []))
      .catch(() => setCities([])).finally(() => setCitiesLoading(false));
  }, [selectedState]);

  const handleStateSelect = (s) => { setSelectedState(s); setForm((f) => ({ ...f, StateId: String(s.id), CityId: "" })); setStateOpen(false); setStateSearch(""); setCitySearch(""); };
  const handleCitySelect = (c) => { setSelectedCity(c); setForm((f) => ({ ...f, CityId: String(c.id) })); setCityOpen(false); setCitySearch(""); };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "latitude" || name === "longitude") setForm((f) => ({ ...f, location: { ...f.location, [name]: value } }));
    else setForm((f) => ({ ...f, [name]: value }));
  };
  const handleSubmit = async () => {
    setLoading(true); setError("");
    try { await axios.post(`${API}/cinemahall/api/addchinemahall`, form, authHeaders()); onAdded(); }
    catch (err) { setError(err?.response?.data?.message || "Failed to add cinema"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5";
  const selectBtnCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none transition-all flex items-center justify-between cursor-pointer hover:border-gray-600";

  const filteredStates = states.filter((s) => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  const filteredCities = cities.filter((c) => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  const step1Valid = form.cinemaHallName && form.description && form.address && form.StateId && form.CityId && form.logo;
  const rows = parseInt(form.row) || 0;
  const cols = parseInt(form.seatsPerRow) || 0;
  const totalPreview = rows * cols;

  const SearchDropdown = ({ open, items, selected, keyField, labelField, onSelect, emptyMsg }) =>
    open ? (
      <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
        <div className="max-h-48 overflow-y-auto">
          {items.length === 0
            ? <p className="text-gray-500 text-xs text-center py-4">{emptyMsg}</p>
            : items.map((item) => (
              <button key={item[keyField]} type="button" onClick={() => onSelect(item)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${selected?.[keyField] === item[keyField] ? "bg-indigo-600/30 text-indigo-300" : "text-gray-300 hover:bg-gray-700"}`}>
                {item[labelField]}
                {selected?.[keyField] === item[keyField] && Icons.Check("h-3.5 w-3.5 text-indigo-400")}
              </button>
            ))
          }
        </div>
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-8 pt-7 pb-5 z-10">
          <button onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
            {Icons.Close("h-4 w-4")}
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-green-600/20 rounded-xl flex items-center justify-center text-green-400">{Icons.Plus("h-5 w-5")}</div>
            <div>
              <h2 className="text-white font-bold text-lg">Add New Cinema</h2>
              <p className="text-gray-500 text-xs">Step {step} of 2 — {step === 1 ? "Basic Info" : "Layout & Pricing"}</p>
            </div>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: step === 1 ? "50%" : "100%" }} />
          </div>
        </div>

        <div className="px-8 py-6">
          {step === 1 && (
            <div className="space-y-4">
              <div><label className={labelCls}>Cinema Name *</label><input name="cinemaHallName" value={form.cinemaHallName} onChange={handleChange} placeholder="e.g. Star Cineplex" className={inputCls} /></div>
              <div><label className={labelCls}>Description *</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe your cinema hall…" className={`${inputCls} resize-none`} /></div>

              {/* State */}
              <div>
                <label className={labelCls}>State *</label>
                <div className="relative">
                  <button type="button" onClick={() => { setStateOpen((o) => !o); setCityOpen(false); }} className={selectBtnCls}>
                    <span className={selectedState ? "text-gray-200" : "text-gray-600"}>{selectedState ? selectedState.name : statesLoading ? "Loading states…" : "Select a state"}</span>
                    {Icons.ChevronDown(`h-4 w-4 text-gray-500 transition-transform ${stateOpen ? "rotate-180" : ""}`)}
                  </button>
                  {stateOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                      <div className="p-2 border-b border-gray-700 flex items-center gap-2 px-3">
                        {Icons.Search("h-4 w-4 text-gray-500 flex-shrink-0")}
                        <input autoFocus value={stateSearch} onChange={(e) => setStateSearch(e.target.value)} placeholder="Search state…" className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none" />
                      </div>
                      <SearchDropdown open={true} items={filteredStates} selected={selectedState} keyField="iso2" labelField="name" onSelect={handleStateSelect} emptyMsg="No states found" />
                    </div>
                  )}
                </div>
              </div>

              {/* City */}
              <div>
                <label className={labelCls}>City *</label>
                <div className="relative">
                  <button type="button" onClick={() => { if (selectedState) { setCityOpen((o) => !o); setStateOpen(false); } }}
                    disabled={!selectedState} className={`${selectBtnCls} ${!selectedState ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <span className={selectedCity ? "text-gray-200" : "text-gray-600"}>{!selectedState ? "Select a state first" : citiesLoading ? "Loading cities…" : selectedCity ? selectedCity.name : "Select a city"}</span>
                    {Icons.ChevronDown(`h-4 w-4 text-gray-500 transition-transform ${cityOpen ? "rotate-180" : ""}`)}
                  </button>
                  {cityOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                      <div className="p-2 border-b border-gray-700 flex items-center gap-2 px-3">
                        {Icons.Search("h-4 w-4 text-gray-500 flex-shrink-0")}
                        <input autoFocus value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Search city…" className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none" />
                      </div>
                      <SearchDropdown open={true} items={filteredCities} selected={selectedCity} keyField="id" labelField="name" onSelect={handleCitySelect} emptyMsg="No cities found" />
                    </div>
                  )}
                </div>
              </div>

              <div><label className={labelCls}>Address *</label><input name="address" value={form.address} onChange={handleChange} placeholder="Full street address" className={inputCls} /></div>
              <div><label className={labelCls}>Google Maps Link</label><input name="locationLink" value={form.locationLink} onChange={handleChange} placeholder="https://maps.google.com/…" className={inputCls} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelCls}>Latitude</label><input name="latitude" value={form.location.latitude} onChange={handleChange} placeholder="18.9220" className={inputCls} /></div>
                <div><label className={labelCls}>Longitude</label><input name="longitude" value={form.location.longitude} onChange={handleChange} placeholder="72.8347" className={inputCls} /></div>
              </div>
              <div>
                <label className={labelCls}>Logo URL *</label>
                <input name="logo" value={form.logo} onChange={handleChange} placeholder="https://…/logo.png" className={inputCls} />
                {form.logo && (
                  <div className="mt-2 h-16 w-16 rounded-xl overflow-hidden border border-gray-700">
                    <img src={form.logo} alt="preview" className="h-full w-full object-cover" onError={(e) => (e.target.style.display = "none")} />
                  </div>
                )}
              </div>
              <button onClick={() => setStep(2)} disabled={!step1Valid}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30 mt-2">
                Next: Layout & Pricing →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[["row","Rows *","10","1","50"],["seatsPerRow","Seats/Row *","15","1",""],["RatePerSeat","Rate (₹) *","200","1",""]].map(([name,lbl,ph,min,max]) => (
                  <div key={name}><label className={labelCls}>{lbl}</label><input name={name} type="number" min={min} max={max||undefined} value={form[name]} onChange={handleChange} placeholder={ph} className={inputCls} /></div>
                ))}
              </div>
              {totalPreview > 0 && (
                <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Seat Preview</p>
                  <div className="flex flex-col items-center gap-1 max-h-36 overflow-hidden">
                    {Array.from({ length: Math.min(rows, 8) }).map((_, r) => (
                      <div key={r} className="flex gap-1">
                        {Array.from({ length: Math.min(cols, 20) }).map((_, c) => <div key={c} className="h-2.5 w-2.5 rounded-sm bg-indigo-500/60" />)}
                        {cols > 20 && <span className="text-gray-600 text-xs self-center">+{cols - 20}</span>}
                      </div>
                    ))}
                    {rows > 8 && <p className="text-gray-600 text-xs mt-1">+{rows - 8} more rows…</p>}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                    <span className="text-gray-400 text-xs">Total seats</span>
                    <span className="text-indigo-400 font-bold text-sm">{totalPreview}</span>
                  </div>
                  {form.RatePerSeat && (
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-xs">Max revenue</span>
                      <span className="text-green-400 font-bold text-sm">₹{(totalPreview * parseInt(form.RatePerSeat)).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
              {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                  {Icons.Back("h-4 w-4")} Back
                </button>
                <button onClick={handleSubmit} disabled={loading || !form.row || !form.seatsPerRow || !form.RatePerSeat}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-green-900/30 flex items-center justify-center gap-2">
                  {loading ? "Creating…" : <>{Icons.Check("h-4 w-4")} Create Cinema</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── AddShowModal ──────────────────────────────────────────
function AddShowModal({ cinema, onClose, onAdded }) {
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieSearch, setMovieSearch] = useState("");
  const [movieOpen, setMovieOpen] = useState(false);
  const [form, setForm] = useState({ showDate: "" });
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeInput, setTimeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`${API}/movie/api/allmovie`, authHeaders())
      .then((r) => setMovies(r.data?.movies || r.data || []))
      .catch(() => setMovies([]))
      .finally(() => setMoviesLoading(false));
  }, []);

  const addTimeSlot = () => { const t = timeInput.trim(); if (t && !timeSlots.includes(t)) { setTimeSlots((p) => [...p, t]); setTimeInput(""); } };
  const removeTimeSlot = (t) => setTimeSlots((p) => p.filter((x) => x !== t));

  const handleSubmit = async () => {
    if (!selectedMovie || !form.showDate || timeSlots.length === 0) { setError("Please fill all fields and add at least one time slot."); return; }
    setLoading(true); setError("");
    try {
      await axios.post(`${API}/show/addshow/${cinema._id}/${selectedMovie._id}`,
        { showDate: form.showDate, timeSlots: timeSlots.map((t) => ({ time: t })) }, authHeaders());
      onAdded();
    } catch (err) { setError(err?.response?.data?.message || "Failed to add show"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5";
  const filteredMovies = movies.filter((m) => (m.MovieName || "").toLowerCase().includes(movieSearch.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
          {Icons.Close("h-4 w-4")}
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">{Icons.Film("h-5 w-5")}</div>
          <div><h2 className="text-white font-bold text-lg">Add Show</h2><p className="text-gray-500 text-xs">{cinema.cinemaHallName}</p></div>
        </div>

        <div className="space-y-4">
          {/* Movie picker */}
          <div>
            <label className={labelCls}>Movie *</label>
            <div className="relative">
              <button type="button" onClick={() => setMovieOpen((o) => !o)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm outline-none transition-all flex items-center justify-between cursor-pointer hover:border-gray-600">
                <span className={selectedMovie ? "text-gray-200" : "text-gray-600"}>{moviesLoading ? "Loading movies…" : selectedMovie ? selectedMovie.MovieName : "Select a movie"}</span>
                {Icons.ChevronDown(`h-4 w-4 text-gray-500 transition-transform ${movieOpen ? "rotate-180" : ""}`)}
              </button>
              {movieOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <div className="p-2 border-b border-gray-700 flex items-center gap-2 px-3">
                    {Icons.Search("h-4 w-4 text-gray-500 flex-shrink-0")}
                    <input autoFocus value={movieSearch} onChange={(e) => setMovieSearch(e.target.value)} placeholder="Search movie…" className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 outline-none" />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredMovies.length === 0
                      ? <p className="text-gray-500 text-xs text-center py-4">No movies found</p>
                      : filteredMovies.map((m) => (
                        <button key={m._id} type="button" onClick={() => { setSelectedMovie(m); setMovieOpen(false); setMovieSearch(""); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-3 ${selectedMovie?._id === m._id ? "bg-purple-600/30 text-purple-300" : "text-gray-300 hover:bg-gray-700"}`}>
                          {m.MoviePhoto
                            ? <img src={m.MoviePhoto} className="h-8 w-6 object-cover rounded flex-shrink-0" />
                            : <div className="h-8 w-6 bg-gray-700 rounded flex-shrink-0 flex items-center justify-center text-gray-500">{Icons.Film("h-3 w-3")}</div>
                          }
                          <span>{m.MovieName}</span>
                          {selectedMovie?._id === m._id && Icons.Check("h-3.5 w-3.5 text-purple-400 ml-auto")}
                        </button>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className={labelCls}>Show Date *</label>
            <input type="date" value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })}
              min={new Date().toISOString().split("T")[0]} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>Time Slots * <span className="normal-case text-gray-600 font-normal">(e.g. 10:00 AM)</span></label>
            <div className="flex gap-2 mb-2">
              <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTimeSlot()} className={`${inputCls} flex-1`} />
              <button type="button" onClick={addTimeSlot}
                className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5">
                {Icons.Plus("h-4 w-4")} Add
              </button>
            </div>
            {timeSlots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {timeSlots.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 border border-purple-600/30 text-purple-300 text-xs rounded-lg">
                    {Icons.Clock("h-3 w-3")} {t}
                    <button onClick={() => removeTimeSlot(t)} className="text-purple-400 hover:text-red-400 transition-colors">{Icons.Close("h-3 w-3")}</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/30">
              {loading ? "Adding…" : "Add Show"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EditShowModal ─────────────────────────────────────────
function EditShowModal({ show, onClose, onSaved }) {
  const [form, setForm] = useState({
    showDate: show.showDate ? new Date(show.showDate).toISOString().split("T")[0] : "",
    timeSlots: show.timeSlots ? show.timeSlots.map((t) => t.time || t) : [],
  });
  const [timeInput, setTimeInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTimeSlot = () => { const t = timeInput.trim(); if (t && !form.timeSlots.includes(t)) { setForm((f) => ({ ...f, timeSlots: [...f.timeSlots, t] })); setTimeInput(""); } };
  const removeTimeSlot = (t) => setForm((f) => ({ ...f, timeSlots: f.timeSlots.filter((x) => x !== t) }));

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try { await axios.put(`${API}/show/updateshow/${show._id}`, form, authHeaders()); onSaved(); }
    catch (err) { setError(err?.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  const inputCls = "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all";
  const labelCls = "block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/70 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose}
          className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors">
          {Icons.Close("h-4 w-4")}
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">{Icons.Edit("h-5 w-5")}</div>
          <div><h2 className="text-white font-bold text-lg">Edit Show</h2><p className="text-gray-500 text-xs">{new Date(show.showDate).toDateString()}</p></div>
        </div>
        <div className="space-y-4">
          <div><label className={labelCls}>Show Date *</label><input type="date" value={form.showDate} onChange={(e) => setForm({ ...form, showDate: e.target.value })} className={inputCls} /></div>
          <div>
            <label className={labelCls}>Time Slots</label>
            <div className="flex gap-2 mb-2">
              <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTimeSlot()} className={`${inputCls} flex-1`} />
              <button type="button" onClick={addTimeSlot}
                className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5">
                {Icons.Plus("h-4 w-4")} Add
              </button>
            </div>
            {form.timeSlots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.timeSlots.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 text-xs rounded-lg">
                    {Icons.Clock("h-3 w-3")} {t}
                    <button onClick={() => removeTimeSlot(t)} className="text-indigo-400 hover:text-red-400 transition-colors">{Icons.Close("h-3 w-3")}</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {error && <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ShowsPanel ────────────────────────────────────────────
function ShowsPanel({ cinema, onClose }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState("");

  const fetchShows = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/show/getshowbycinema/${cinema._id}`, authHeaders());
      setShows(res.data || []);
    } catch { setShows([]); setError("Could not load shows."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchShows(); }, [cinema._id]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleDelete = async (showId) => {
    setDeleteLoading(true);
    try { await axios.delete(`${API}/show/deleteshow/${showId}`, authHeaders()); showToast("Show deleted"); setDeleteTarget(null); fetchShows(); }
    catch { showToast("Failed to delete show"); }
    finally { setDeleteLoading(false); }
  };

  const grouped = shows.reduce((acc, show) => {
    const date = new Date(show.showDate).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(show);
    return acc;
  }, {});

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-md bg-black/70 px-0 sm:px-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="w-full sm:max-w-2xl bg-gray-900 border border-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl relative max-h-[90vh] flex flex-col">

          {toast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-gray-800 border border-gray-700 text-white text-xs px-4 py-2 rounded-xl shadow-xl whitespace-nowrap flex items-center gap-2">
              {Icons.Check("h-3.5 w-3.5 text-green-400")} {toast}
            </div>
          )}

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-400">{Icons.Film("h-5 w-5")}</div>
              <div><h2 className="text-white font-bold text-base">Shows</h2><p className="text-gray-500 text-xs">{cinema.cinemaHallName}</p></div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all">
                {Icons.Plus("h-3.5 w-3.5")} Add Show
              </button>
              <button onClick={onClose}
                className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-xl transition-all">
                {Icons.Close("h-4 w-4")}
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-purple-500" />
                <p className="text-gray-500 text-sm">Loading shows…</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                {Icons.Warning("h-10 w-10 text-red-400 opacity-60")}
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : shows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                {Icons.Film("h-14 w-14 text-gray-700")}
                <p className="text-gray-400 text-sm font-medium">No shows scheduled</p>
                <button onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all mt-1">
                  {Icons.Plus("h-3.5 w-3.5")} Schedule First Show
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(grouped).map(([date, dateShows]) => (
                  <div key={date}>
                    <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="h-px flex-1 bg-gray-800" />{date}<span className="h-px flex-1 bg-gray-800" />
                    </p>
                    <div className="space-y-3">
                      {dateShows.map((show) => (
                        <div key={show._id} className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-semibold truncate mb-2">{show.movieId?.MovieName || "Unknown Movie"}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {(show.timeSlots || []).map((slot, i) => (
                                <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-purple-600/20 border border-purple-600/30 text-purple-300 text-xs rounded-lg">
                                  {Icons.Clock("h-3 w-3")} {slot.time || slot}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => setEditTarget(show)} title="Edit"
                              className="h-8 w-8 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 rounded-lg flex items-center justify-center transition-colors">
                              {Icons.Edit("h-3.5 w-3.5")}
                            </button>
                            <button onClick={() => setDeleteTarget(show._id)} title="Delete"
                              className="h-8 w-8 bg-red-600/10 hover:bg-red-600/30 text-red-400 rounded-lg flex items-center justify-center transition-colors">
                              {Icons.Trash("h-3.5 w-3.5")}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm bg-black/50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="h-14 w-14 bg-red-500/15 rounded-2xl flex items-center justify-center text-red-400 mb-3">{Icons.Trash("h-7 w-7")}</div>
              <h3 className="text-white font-bold mb-1">Delete Show?</h3>
              <p className="text-gray-400 text-sm">This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl transition-all">Cancel</button>
              <button onClick={() => handleDelete(deleteTarget)} disabled={deleteLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all">
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && <AddShowModal cinema={cinema} onClose={() => setShowAddModal(false)} onAdded={() => { setShowAddModal(false); showToast("Show added!"); fetchShows(); }} />}
      {editTarget && <EditShowModal show={editTarget} onClose={() => setEditTarget(null)} onSaved={() => { setEditTarget(null); showToast("Show updated!"); fetchShows(); }} />}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────
export function OwnerPage() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showsTarget, setShowsTarget] = useState(null);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();

  const fetchCinemas = async () => {
    setLoading(true); setError("");
    try {
      const token = getToken();
      if (!token) { navigate("/"); return; }
      const res = await axios.get(`${API}/cinemahall/api/mycinemas`, authHeaders());
      setCinemas(res.data?.cinemas || []);
    } catch { setError("Failed to load your cinemas."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCinemas(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const handleEditSaved = () => { setEditTarget(null); showToast("Cinema updated!"); fetchCinemas(); };
  const handleDeleted   = () => { setDeleteTarget(null); showToast("Cinema deleted."); fetchCinemas(); };
  const handleAdded     = () => { setShowAdd(false); showToast("Cinema added successfully!"); fetchCinemas(); };

  const totalSeats  = cinemas.reduce((acc, c) => acc + (c.seats?.length || 0), 0);
  const totalMovies = cinemas.reduce((acc, c) => acc + (c.MovieId?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-gray-800 border border-gray-700 text-white text-sm px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          {Icons.Check("h-4 w-4 text-green-400")} {toast}
        </div>
      )}

      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")}
              className="h-9 w-9 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all">
              {Icons.Back("h-4 w-4")}
            </button>
            <div>
              <h1 className="text-white font-bold text-lg leading-tight">Owner Dashboard</h1>
              <p className="text-gray-500 text-xs">Manage your cinema halls</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:block">{cinemas.length} cinema{cinemas.length !== 1 ? "s" : ""}</span>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
              {Icons.Plus("h-4 w-4")}
              <span className="hidden sm:inline">Add Cinema</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Cinemas"     value={cinemas.length} icon={Icons.Theater("h-6 w-6")} color="bg-indigo-500/15 text-indigo-400" />
          <StatCard label="Total Seats" value={totalSeats}     icon={Icons.Seat("h-6 w-6")}    color="bg-purple-500/15 text-purple-400" />
          <StatCard label="Movies"      value={totalMovies}    icon={Icons.Movie("h-6 w-6")}   color="bg-pink-500/15 text-pink-400" />
          <StatCard label="Status"      value="Active"         icon={Icons.Check("h-6 w-6")}   color="bg-green-500/15 text-green-400" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-indigo-500" />
            <p className="text-gray-500 text-sm">Loading your cinemas…</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            {Icons.Warning("h-12 w-12 text-red-400 opacity-60")}
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={fetchCinemas} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition-all">Try Again</button>
          </div>
        ) : cinemas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            {Icons.Theater("h-20 w-20 text-gray-700")}
            <p className="text-gray-400 text-base font-medium">No cinemas yet</p>
            <p className="text-gray-600 text-sm mb-2">Get started by adding your first cinema hall.</p>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-indigo-900/30">
              {Icons.Plus("h-4 w-4")} Add Your First Cinema
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-300 font-semibold text-sm uppercase tracking-widest">Your Cinema Halls</h2>
              <button onClick={() => setShowAdd(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400 hover:text-indigo-300 text-xs font-semibold rounded-lg transition-all border border-indigo-600/20">
                {Icons.Plus("h-3.5 w-3.5")} Add Cinema
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cinemas.map((cinema) => (
                <CinemaCard key={cinema._id} cinema={cinema}
                  onEdit={setEditTarget} onDelete={setDeleteTarget} onManageShows={setShowsTarget} />
              ))}
            </div>
          </>
        )}
      </div>

      {showsTarget  && <ShowsPanel cinema={showsTarget} onClose={() => setShowsTarget(null)} />}
      {showAdd      && <AddCinemaModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
      {editTarget   && <EditModal cinema={editTarget} onClose={() => setEditTarget(null)} onSaved={handleEditSaved} />}
      {deleteTarget && <DeleteModal cinema={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} />}
    </div>
  );
}