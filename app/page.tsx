import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen radialBg flex flex-col items-center justify-center p-8 gap-16">
      <main className="flex flex-col items-center gap-12 max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            CloudyGo
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your all-in-one weather companion. Get accurate forecasts, track
            your favorite locations, and stay prepared for any weather
            condition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Real-time Weather
            </h3>
            <p className="text-gray-400">
              Get instant access to accurate weather forecasts for any location
              worldwide.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Location Tracking
            </h3>
            <p className="text-gray-400">
              Save and track multiple locations with detailed weather
              information.
            </p>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/30 hover:border-cyan-400/30 transition-all duration-300">
            <div className="w-12 h-12 bg-cyan-400/10 rounded-xl flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Weather Alerts
            </h3>
            <p className="text-gray-400">
              Stay informed with real-time weather alerts and notifications.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
          <Link href="/weatherDashboard">
            <div
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-400 
                    text-black rounded-xl cursor-pointer hover:opacity-90 transition-all 
                    duration-300 font-semibold text-lg shadow-lg hover:shadow-cyan-400/20 text-center"
            >
              Get Started
            </div>
          </Link>
          <Link href="/login">
            <div
              className="w-full sm:w-auto px-8 py-3 bg-gray-800/50 border border-gray-700/30
                    text-white rounded-xl cursor-pointer hover:bg-gray-800/70 transition-all 
                    duration-300 font-semibold text-lg text-center"
            >
              Sign In
            </div>
          </Link>
        </div>
      </main>

      <footer className="text-center text-gray-400 text-sm">
        <p>© 2025 CloudyGo. All rights reserved.</p>
      </footer>
    </div>
  );
}
