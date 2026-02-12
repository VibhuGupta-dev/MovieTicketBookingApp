import React, { useState, useEffect } from 'react';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const movies = [
    { title: "Neon Twilight", genre: "Sci-Fi", rating: "9.2" },
    { title: "The Last Echo", genre: "Drama", rating: "8.7" },
    { title: "Crimson Horizon", genre: "Action", rating: "8.9" },
    { title: "Whispers in Time", genre: "Mystery", rating: "9.0" }
  ];

  const features = [
    { title: "Premium Seats", desc: "Reserve luxury recliners" },
    { title: "Early Access", desc: "Book tickets before release" },
    { title: "Rewards", desc: "Earn points with every booking" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 flex justify-between items-center transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md border-b border-purple-200 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="text-2xl md:text-3xl font-black tracking-tight bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
          CINÉMA
        </div>

        <div className="flex gap-3 md:gap-4 items-center">
          <button className="px-5 md:px-7 py-2.5 md:py-3 text-sm md:text-base font-medium border-2 border-purple-600 text-purple-600 bg-transparent rounded-lg hover:bg-purple-50 transition-all duration-200">
            SIGN IN
          </button>

          <button className="px-5 md:px-7 py-2.5 md:py-3 text-sm md:text-base font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md">
            SIGN UP
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center">
        <div className="relative z-20 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight tracking-tighter text-gray-900">
            Your <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Cinema</span>
            <br />Experience
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 font-normal leading-relaxed max-w-3xl mx-auto">
            Book premium seats, discover exclusive releases, and immerse yourself in the magic of cinema like never before
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-lg">
              EXPLORE MOVIES
            </button>

            <button className="w-full sm:w-auto px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-medium border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-200">
              LEARN MORE
            </button>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="relative py-20 md:py-32 px-6 z-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-12 md:mb-16 text-center tracking-tight text-gray-900">
            Now <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Showing</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {movies.map((movie, index) => (
              <div
                key={index}
                className="group relative bg-white border-2 border-purple-200 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-purple-400 hover:shadow-xl overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-yellow-500 text-lg font-bold z-10">
                  ★ {movie.rating}
                </div>

                <div className="h-48 md:h-56 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg mb-6 flex items-center justify-center text-6xl">
                  🎬
                </div>

                <h3 className="text-xl md:text-2xl font-semibold mb-2 tracking-tight text-gray-900">
                  {movie.title}
                </h3>

                <p className="text-gray-500 text-sm md:text-base tracking-wide uppercase">
                  {movie.genre}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 md:py-32 px-6 bg-gradient-to-b from-white to-purple-50 z-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-gray-900">
            Why <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">Choose Us</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 mb-16 font-normal">
            Experience cinema with exclusive benefits
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`p-8 md:p-10 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-purple-100 border-purple-400 shadow-lg'
                    : 'bg-white border-purple-200 hover:border-purple-300'
                }`}
              >
                <div className="text-5xl md:text-6xl mb-6">
                  {index === 0 ? '🎭' : index === 1 ? '⚡' : '🎁'}
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold mb-3 tracking-tight text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 text-center border-t-2 border-purple-200 mt-20 z-20 bg-white">
        <div className="text-gray-500 text-sm md:text-base">
          © 2026 CINÉMA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}