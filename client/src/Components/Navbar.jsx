// Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Ristrict.png";
import locationIcon from "../assets/location.png";
import { getCitiesByState, getStatesByCountry, testApiKey } from "../api/GetStatesByCountry";
import AuthBox from "./Auth";

const API = "http://localhost:3000/user";

export default function Navbar({ setSelectedStateId, setSelectedCityId }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState(() => {
    const saved = localStorage.getItem("selectedState");
    return saved ? JSON.parse(saved) : { name: "Maharashtra", iso2: "MH" };
  });

  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem("selectedCity") || "Mumbai";
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cities");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Auth State ──
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user info when logged in
  useEffect(() => {
    if (isLoggedIn) {
      axios
        .get("http://localhost:3000/user/api/me", { withCredentials: true })
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  // Sync login state across tabs
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // ── Profile Button Click ──
  const handleProfileClick = () => {
    if (isLoggedIn) {
      setProfileMenuOpen((prev) => !prev);
    } else {
      setShowAuth(true);
    }
  };

  // ── Logout ──
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post(`${API}/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.log(err);
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setProfileMenuOpen(false);
      setLogoutLoading(false);
      navigate("/");
    }
  };

  // ── Auth Close ──
  const handleAuthClose = (loggedInUser) => {
    setShowAuth(false);
    if (loggedInUser) setIsLoggedIn(true);
  };

  // ── Active Nav ──
  const getActiveBar = () => {
    const path = location.pathname;
    if (path.includes("/cinema")) return "Cinemas";
    if (path.includes("/offer")) return "Offers";
    return "Movies";
  };
  const activeBar = getActiveBar();

  const handleNavigate = (page) => {
    if (page === "Movies") navigate("/");
    else if (page === "Cinemas") navigate("/cinema");
    else if (page === "Offers") navigate("/offers");
    else navigate("/");
  };

  // ── Location API ──
  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true);
      setError(null);
      const isValid = await testApiKey();
      if (!isValid) { setError("API key is invalid."); setLoading(false); return; }
      const statesData = await getStatesByCountry("IN");
      if (statesData?.length > 0) {
        setStates(statesData);
        const savedState = localStorage.getItem("selectedState");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          const stateExists = statesData.find((s) => s.iso2 === parsedState.iso2);
          if (stateExists) {
            setSelectedState(parsedState);
            if (setSelectedStateId && parsedState.id) setSelectedStateId(parsedState.id);
          } else {
            const mh = statesData.find((s) => s.iso2 === "MH") || statesData[0];
            setSelectedState(mh);
            localStorage.setItem("selectedState", JSON.stringify(mh));
          }
        } else {
          const mh = statesData.find((s) => s.iso2 === "MH") || statesData[0];
          setSelectedState(mh);
          localStorage.setItem("selectedState", JSON.stringify(mh));
        }
      } else {
        setError("No states found for India.");
      }
      setLoading(false);
    };
    initializeLocation();
  }, []);

  useEffect(() => {
    if (!selectedState?.iso2) return;
    const fetchCities = async () => {
      setLoading(true);
      const citiesData = await getCitiesByState("IN", selectedState.iso2);
      setCities(citiesData || []);
      const savedCity = localStorage.getItem("selectedCity");
      if (savedCity && citiesData?.length > 0) {
        const cityExists = citiesData.find((c) => c.name === savedCity);
        if (cityExists) {
          setSelectedCity(savedCity);
          if (setSelectedCityId && cityExists.id) setSelectedCityId(cityExists.id);
        } else {
          const first = citiesData[0];
          setSelectedCity(first.name);
          localStorage.setItem("selectedCity", first.name);
          if (setSelectedCityId && first.id) setSelectedCityId(first.id);
        }
      } else if (citiesData?.length > 0) {
        const first = citiesData[0];
        setSelectedCity(first.name);
        localStorage.setItem("selectedCity", first.name);
        if (setSelectedCityId && first.id) setSelectedCityId(first.id);
      }
      setLoading(false);
    };
    fetchCities();
  }, [selectedState?.iso2]);

  // Close location dropdown on outside click (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };
    if (window.innerWidth >= 768) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    if (setSelectedStateId) setSelectedStateId(state.id);
    localStorage.setItem("selectedState", JSON.stringify(state));
    setActiveTab("cities");
    setSearchTerm("");
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.name);
    if (setSelectedCityId) setSelectedCityId(city.id);
    localStorage.setItem("selectedCity", city.name);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
    if (!isDropdownOpen) { setActiveTab("cities"); setSearchTerm(""); }
  };

  const handleRetry = async () => {
    setLoading(true); setError(null);
    const isValid = await testApiKey();
    if (!isValid) { setError("API key is invalid."); setLoading(false); return; }
    const statesData = await getStatesByCountry("IN");
    if (statesData?.length > 0) {
      setStates(statesData);
      const mh = statesData.find((s) => s.iso2 === "MH") || statesData[0];
      setSelectedState(mh);
      localStorage.setItem("selectedState", JSON.stringify(mh));
    } else { setError("No states found."); }
    setLoading(false);
  };

  const filteredCities = cities.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredStates = states.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // ── Profile Button (no dropdown inside) ──
  const ProfileButton = ({ iconSize = "h-6 w-6", btnSize = "h-10 w-10" }) => (
    <button
      onClick={handleProfileClick}
      title={isLoggedIn ? "Account" : "Sign In"}
      className={`flex items-center justify-center ${btnSize} rounded-full transition-all duration-200 ${
        isLoggedIn
          ? "bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/20"
          : "hover:bg-gray-100 active:bg-gray-200"
      }`}
    >
      <svg
        className={`${iconSize} ${isLoggedIn ? "text-white" : "text-gray-700"}`}
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </button>
  );

  // ── Location Dropdown Content ──
  const DropdownContent = () => (
    <>
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab("cities")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "cities" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600 hover:text-gray-900"
          }`}>Cities</button>
        <button onClick={() => setActiveTab("states")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "states" ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-600 hover:text-gray-900"
          }`}>Change State</button>
      </div>

      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder={`Search ${activeTab === "cities" ? "city" : "state"}...`}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent" />
            <p className="mt-2 text-sm text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button onClick={handleRetry} className="text-purple-600 text-sm hover:text-purple-700 font-medium">Try Again</button>
          </div>
        ) : activeTab === "cities" ? (
          <div className="py-2">
            {filteredCities.length > 0 ? filteredCities.map((city) => (
              <button key={city.id} onClick={() => handleCitySelect(city)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 active:bg-purple-100 transition-colors flex items-center justify-between ${
                  selectedCity === city.name ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700"
                }`}>
                <span>{city.name}</span>
                {selectedCity === city.name && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )) : (
              <div className="p-8 text-center text-gray-500 text-sm">{searchTerm ? "No cities found" : "No cities available"}</div>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filteredStates.length > 0 ? filteredStates.map((state) => (
              <button key={state.iso2} onClick={() => handleStateSelect(state)}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 active:bg-purple-100 transition-colors flex items-center justify-between ${
                  selectedState.iso2 === state.iso2 ? "bg-purple-100 text-purple-700 font-medium" : "text-gray-700"
                }`}>
                <span>{state.name}</span>
                {selectedState.iso2 === state.iso2 && (
                  <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            )) : (
              <div className="p-8 text-center text-gray-500 text-sm">{searchTerm ? "No states found" : "No states available"}</div>
            )}
          </div>
        )}
      </div>
    </>
  );

  // ── Render ──
  return (
    <>
      <header className="navbar bg-white border-b border-gray-100">

        {/* ══ Mobile ══ */}
        <div className="md:hidden">
          <div className="flex items-center justify-between px-4 h-24">
            <div className="pt-3 py-1 h-full cursor-pointer" onClick={() => handleNavigate("Movies")}>
              <img src={logo} alt="Ristrict Logo" className="h-full w-auto object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleDropdownToggle}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
                <img src={locationIcon} alt="Location" className="h-4 w-4 opacity-70" />
                <span className="text-xs font-semibold text-gray-900">{selectedCity}</span>
                <svg className={`h-3 w-3 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <ProfileButton iconSize="h-5 w-5" btnSize="h-9 w-9" />
            </div>
          </div>

          <div className="px-4 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search movie, cinema and shows"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
            </div>
          </div>

          <nav className="flex items-center border-t border-gray-100">
            {["Movies", "Cinemas", "Offers"].map((tab) => (
              <button key={tab} onClick={() => handleNavigate(tab)}
                className={`flex-1 text-center py-3 text-sm font-medium transition-all border-r border-gray-100 relative last:border-r-0 ${
                  activeBar === tab ? "text-purple-600 bg-purple-50" : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                }`}>
                {tab}
                {activeBar === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600" />}
              </button>
            ))}
          </nav>
        </div>

        {/* ══ Desktop ══ */}
        <div className="hidden md:flex items-center justify-between px-4 lg:px-6 h-24">
          <div className="flex items-center gap-4">
            <div className="h-20 pt-3 w-20 py-2 cursor-pointer" onClick={() => handleNavigate("Movies")}>
              <img src={logo} alt="Ristrict Logo" className="h-full w-auto object-cover" />
            </div>

            <div className="h-12 w-px bg-gray-200" />

            <div className="relative" ref={dropdownRef}>
              <button onClick={handleDropdownToggle}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <img src={locationIcon} alt="Location" className="h-5 w-5 opacity-70" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">{selectedState.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedCity}</span>
                </div>
                <svg className={`h-4 w-4 text-gray-600 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <DropdownContent />
                </div>
              )}
            </div>

            <nav className="flex items-center gap-2 ml-4">
              {["Movies", "Cinemas", "Offers"].map((tab) => (
                <button key={tab} onClick={() => handleNavigate(tab)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeBar === tab ? "text-purple-600 bg-purple-50" : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
                  }`}>
                  {tab}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 transition-transform duration-300 origin-left ${
                    activeBar === tab ? "scale-x-100" : "scale-x-0"
                  }`} />
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <svg className="absolute left-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search movie, cinema and shows"
                className="pl-10 pr-4 py-2 w-64 lg:w-80 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
            </div>
            <ProfileButton iconSize="h-6 w-6" btnSize="h-10 w-10" />
          </div>
        </div>

        {/* ── Global Profile Dropdown — renders once, works on mobile + desktop ── */}
        {isLoggedIn && profileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setProfileMenuOpen(false)}
            />
            {/* Menu */}
            <div className="fixed right-4 top-20 z-50 w-52 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
                <p className="text-sm font-semibold text-purple-700 truncate">{user?.name || "Account"}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>

              {/* My Profile */}
              <button
                onClick={() => { navigate("/profile"); setProfileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
              >
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </button>

              <div className="h-px bg-gray-100 mx-3" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {logoutLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-r-transparent" />
                    Signing out…
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                    Logout
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </header>

      {/* Mobile location overlay */}
      {isDropdownOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setIsDropdownOpen(false)}>
          <div className="bg-white mt-24 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            <DropdownContent />
          </div>
        </div>
      )}

      {/* AuthBox */}
      {showAuth && !isLoggedIn && (
        <AuthBox onClose={handleAuthClose} />
      )}
    </>
  );
}