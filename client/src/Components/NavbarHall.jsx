// NavbarHall.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/Ristrict.png";
import AuthBox from "./Auth";

const API = "http://localhost:3000/user";

export default function NavbarHall() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [showAuth, setShowAuth] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  // Sync across tabs
  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Profile button click — logged in → dropdown, not logged in → AuthBox
  const handleProfileClick = () => {
    if (isLoggedIn) setProfileMenuOpen((prev) => !prev);
    else setShowAuth(true);
  };

  // Logout
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await axios.post(`${API}/api/logout`, {}, { withCredentials: true });
    } catch (err) {
      // fail silently, clear locally anyway
      console.log(err)
    } finally {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setProfileMenuOpen(false);
      setLogoutLoading(false);
      navigate("/");
    }
  };

  // Auth close callback
  const handleAuthClose = (loggedInUser) => {
    setShowAuth(false);
    if (loggedInUser) setIsLoggedIn(true);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 lg:px-6 h-24">

          {/* Logo */}
          <div className="h-20 pt-3 w-20 py-2 cursor-pointer" onClick={() => navigate("/")}>
            <img src={logo} alt="Ristrict Logo" className="h-full w-auto object-cover" />
          </div>

          {/* Profile Button + Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={handleProfileClick}
              className={`flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 ${
                isLoggedIn
                  ? "bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/30 ring-2 ring-purple-400/20"
                  : "hover:bg-gray-100 active:bg-gray-200"
              }`}
            >
              <svg
                className={`h-6 w-6 ${isLoggedIn ? "text-white" : "text-gray-700"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>

            {/* Dropdown — only when logged in */}
            {isLoggedIn && profileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

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

                <div className="h-px bg-gray-100 mx-2" />

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
            )}
          </div>
        </div>
      </header>

      {/* AuthBox — only when not logged in */}
      {showAuth && !isLoggedIn && (
        <AuthBox onClose={handleAuthClose} />
      )}
    </>
  );
}