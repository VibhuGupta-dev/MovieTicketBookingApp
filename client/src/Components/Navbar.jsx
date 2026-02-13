import logo from "../assets/Ristrict.png";
import location from "../assets/location.png";

export default function Navbar() {
  return (
    <header className="navbar flex items-center justify-between px-6 h-16 bg-white shadow-sm">
      <div className="flex items-center">
        <div className="h-12 w-max mr-4">
          <img
            src={logo}
            alt="Ristrict Logo"
            className="h-full w-full object-contain"
          />
        </div>

        <div className="hidden sm:flex items-center bg-gray-100 rounded-full px-3 py-1">
          <img src={location} alt="location" className="h-5 w-5 mr-2" />
          <span className="text-sm text-gray-700">San Francisco</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <nav className="hidden md:flex space-x-6 text-sm text-gray-700">
          <a href="#" className="hover:text-black">
            Movies
          </a>
          <a href="#" className="hover:text-black">
            Cinemas
          </a>
          <a href="#" className="hover:text-black">
            Offers
          </a>
        </nav>

        <div className="flex items-center space-x-3">
          <button className="hidden md:inline bg-transparent border border-gray-300 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-50">
            Sign up
          </button>
          <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm">Login</button>
        </div>
      </div>
    </header>
  );
}
