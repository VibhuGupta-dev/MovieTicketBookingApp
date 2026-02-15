import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../Components/ThemeContext';
import logo from "../assets/Ristrict.png";
import location from "../assets/location.png";
import { getCitiesByState, getStatesByCountry, testApiKey } from '../api/GetStatesByCountry';

export default function Navbar() {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState({ name: 'Maharashtra', iso2: 'MH' });
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('cities');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  
  const navigate = useNavigate();
  const locationPath = useLocation();
  const { isDark, toggleTheme } = useTheme();

  // Determine active bar based on current route
  const getActiveBar = () => {
    const path = locationPath.pathname;
    if (path.includes('/cinema')) return 'Cinemas';
    if (path.includes('/offer')) return 'Offers';
    return 'Movies';
  };

  const activeBar = getActiveBar();

  // Handle navigation
  const handleNavigate = (page) => {
    switch(page) {
      case 'Movies':
        navigate('/');
        break;
      case 'Cinemas':
        navigate('/cinema');
        break;
      case 'Offers':
        navigate('/offers');
        break;
      default:
        navigate('/');
    }
  };

  // Initialize location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true);
      setError(null);

      const isValid = await testApiKey();
      if (!isValid) {
        setError('API key is invalid. Please check your credentials.');
        setLoading(false);
        return;
      }

      const statesData = await getStatesByCountry('IN');
      if (statesData.length > 0) {
        setStates(statesData);
        const maharashtra = statesData.find(s => s.iso2 === 'MH') || statesData[0];
        setSelectedState(maharashtra);
      } else {
        setError('No states found.');
      }

      setLoading(false);
    };

    initializeLocation();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!selectedState.iso2) return;
      
      setLoading(true);
      const citiesData = await getCitiesByState('IN', selectedState.iso2);
      setCities(citiesData);
      
      if (citiesData.length > 0 && !citiesData.find(c => c.name === selectedCity)) {
        setSelectedCity(citiesData[0].name);
      }
      
      setLoading(false);
    };

    fetchCities();
  }, [selectedState.iso2]);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    // Only attach listener for desktop
    if (window.innerWidth >= 768) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setActiveTab('cities');
    setSearchTerm('');
  };

  const handleCitySelect = (cityName) => {
    setSelectedCity(cityName);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setActiveTab('cities');
    setSearchTerm('');
  };

  const handleRetry = async () => {
    setLoading(true);
    setError(null);

    const isValid = await testApiKey();
    if (!isValid) {
      setError('API key is invalid. Please check your credentials.');
      setLoading(false);
      return;
    };

    const statesData = await getStatesByCountry('IN');
    if (statesData.length > 0) {
      setStates(statesData);
      const maharashtra = statesData.find(s => s.iso2 === 'MH') || statesData[0];
      setSelectedState(maharashtra);
    } else {
      setError('No states found.');
    }

    setLoading(false);
  };

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStates = states.filter(state =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dropdown content component (reusable for both mobile and desktop)
  const DropdownContent = () => (
    <>
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('cities')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'cities' 
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Cities
        </button>
        <button
          onClick={() => setActiveTab('states')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'states' 
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Change State
        </button>
      </div>

      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder={`Search ${activeTab === 'cities' ? 'city' : 'state'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-red-600 dark:text-red-400 text-sm mb-2">{error}</p>
            <button onClick={handleRetry} className="text-purple-600 dark:text-purple-400 text-sm hover:text-purple-700 dark:hover:text-purple-300 font-medium">Try Again</button>
          </div>
        ) : activeTab === 'cities' ? (
          <div className="py-2">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city.name)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 active:bg-purple-100 dark:active:bg-purple-900/30 transition-colors flex items-center justify-between ${
                    selectedCity === city.name 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{city.name}</span>
                  {selectedCity === city.name && (
                    <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? 'No cities found' : 'No cities available'}
              </div>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <button
                  key={state.iso2}
                  onClick={() => handleStateSelect(state)}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 active:bg-purple-100 dark:active:bg-purple-900/30 transition-colors flex items-center justify-between ${
                    selectedState.iso2 === state.iso2 
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span>{state.name}</span>
                  {selectedState.iso2 === state.iso2 && (
                    <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                {searchTerm ? 'No states found' : 'No states available'}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      <header className="navbar bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors">
        {/* Mobile Layout - 3 Lines */}
        <div className="md:hidden">
          {/* Line 1: Logo, Location, Profile */}
          <div className="flex items-center justify-between px-4 h-24">
            {/* Logo */}
            <div className="pt-3 py-1 h-full cursor-pointer" onClick={() => handleNavigate('Movies')}>
              <img src={logo} alt="Ristrict Logo" className="h-full w-auto object-contain" />
            </div>

            {/* Location, Dark Mode Toggle & Profile */}
            <div className="flex items-center gap-3">
              {/* Location Button */}
              <button
                onClick={handleDropdownToggle}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 transition-colors"
              >
                <img src={location} alt="location" className="h-4 w-4 opacity-70" />
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">{selectedCity}</span>
                <svg
                  className={`h-3 w-3 text-gray-600 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Profile Icon */}
              <button className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 transition-colors">
                <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Line 2: Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search movie, cinema and shows"
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Line 3: Navigation Tabs */}
          <nav className="flex items-center border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={() => handleNavigate('Movies')}
              className={`flex-1 text-center py-3 text-sm font-medium transition-all border-r border-gray-100 dark:border-gray-800 relative ${
                activeBar === 'Movies'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400 active:bg-purple-100 dark:active:bg-purple-900/20'
              }`}
            >
              Movies
              {activeBar === 'Movies' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400"></span>
              )}
            </button>
            <button
              onClick={() => handleNavigate('Cinemas')}
              className={`flex-1 text-center py-3 text-sm font-medium transition-all border-r border-gray-100 dark:border-gray-800 relative ${
                activeBar === 'Cinemas'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400 active:bg-purple-100 dark:active:bg-purple-900/20'
              }`}
            >
              Cinemas
              {activeBar === 'Cinemas' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400"></span>
              )}
            </button>
            <button
              onClick={() => handleNavigate('Offers')}
              className={`flex-1 text-center py-3 text-sm font-medium transition-all relative ${
                activeBar === 'Offers'
                  ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400 active:bg-purple-100 dark:active:bg-purple-900/20'
              }`}
            >
              Offers
              {activeBar === 'Offers' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Desktop Layout - Single Line */}
        <div className="hidden md:flex items-center justify-between px-4 lg:px-6 h-24">
          <div className="flex items-center gap-4">
            <div className="h-20 pt-3 w-20 py-2 cursor-pointer" onClick={() => handleNavigate('Movies')}>
              <img src={logo} alt="Ristrict Logo" className="h-full w-auto object-cover" />
            </div>

            <div className="h-12 w-px bg-gray-200 dark:bg-gray-700"></div>

            {/* Desktop Location Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleDropdownToggle}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <img src={location} alt="location" className="h-5 w-5 opacity-70" />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{selectedState.name}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedCity}</span>
                </div>
                <svg
                  className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <DropdownContent />
                </div>
              )}
            </div>

            <nav className="flex items-center gap-2 ml-4">
              <button
                onClick={() => handleNavigate('Movies')}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeBar === 'Movies'
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Movies
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transition-transform duration-300 origin-left ${
                  activeBar === 'Movies' ? 'scale-x-100' : 'scale-x-0'
                }`}></span>
              </button>
              <button
                onClick={() => handleNavigate('Cinemas')}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeBar === 'Cinemas'
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Cinemas
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transition-transform duration-300 origin-left ${
                  activeBar === 'Cinemas' ? 'scale-x-100' : 'scale-x-0'
                }`}></span>
              </button>
              <button
                onClick={() => handleNavigate('Offers')}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeBar === 'Offers'
                    ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/10 hover:text-purple-600 dark:hover:text-purple-400'
                }`}
              >
                Offers
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 transition-transform duration-300 origin-left ${
                  activeBar === 'Offers' ? 'scale-x-100' : 'scale-x-0'
                }`}></span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <svg className="absolute left-3 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search movie, cinema and shows"
                className="pl-10 pr-4 py-2 w-64 lg:w-80 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Profile Icon */}
            <button className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <svg className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown - Full Screen Modal */}
      {isDropdownOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 dark:bg-black/70" onClick={() => setIsDropdownOpen(false)}>
          <div 
            className="bg-white dark:bg-gray-800 mt-24 rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownContent />
          </div>
        </div>
      )}
    </>
  );
}