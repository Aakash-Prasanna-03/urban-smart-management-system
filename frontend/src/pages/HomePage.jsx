import React from "react";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        
        {/* Hero Section - Reduced height */}
        <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Community Issues Tracker
          </h1>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
            Report, track, and resolve community issues efficiently.
          </p>
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all">
            Get Started
          </button>
        </section>

        {/* Features Section - Now immediately visible */}
        <section className="py-12 px-4 md:px-16 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 dark:bg-indigo-700/20 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                Easy Reporting
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quickly report issues in your community with our simple interface.
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-700/20 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                Real-time Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track issues as they get resolved with live updates.
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-700/20 rounded-xl p-5 text-center shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">
                Community Engagement
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay engaged and help improve your neighborhood effectively.
              </p>
            </div>
          </div>
        </section>
          {/* Enhanced Hero Section */}
          <section className="relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg tracking-tight animate-fade-in">
              UrbanFix: Community Issues Tracker
            </h1>
            <p className="text-lg md:text-2xl mb-8 drop-shadow-md animate-fade-in">
              Report, track, and resolve community issues efficiently. Empower your neighborhood.
            </p>
            <button className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-xl hover:bg-indigo-50 hover:scale-105 transition-all text-lg animate-fade-in">
              Get Started
            </button>
          </section>

          {/* Features Section - Modern Cards */}
          <section className="py-12 px-4 md:px-16 bg-white dark:bg-gray-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              <div className="bg-indigo-50 dark:bg-indigo-700/20 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl transition-all border border-indigo-100 dark:border-indigo-700">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Easy Reporting</h3>
                <p className="text-gray-600 dark:text-gray-300">Quickly report issues in your community with our simple interface.</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-700/20 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl transition-all border border-indigo-100 dark:border-indigo-700">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Real-time Tracking</h3>
                <p className="text-gray-600 dark:text-gray-300">Track issues as they get resolved with live updates.</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-700/20 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl transition-all border border-indigo-100 dark:border-indigo-700">
                <h3 className="text-2xl font-bold mb-3 text-gray-800 dark:text-white">Community Engagement</h3>
                <p className="text-gray-600 dark:text-gray-300">Stay engaged and help improve your neighborhood effectively.</p>
              </div>
            </div>
          </section>

        {/* Additional content section */}
        <section className="py-12 px-4 md:px-16 bg-gray-100 dark:bg-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our platform connects community members with local authorities to quickly
              identify and resolve issues, making neighborhoods safer and more enjoyable
              for everyone.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 px-4 md:px-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 drop-shadow-lg">
            Start Making a Difference Today
          </h2>
          <p className="mb-6 text-lg drop-shadow-md">
            Join our community and help resolve local issues faster.
          </p>
          <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all">
            Report an Issue
          </button>
        </section>
      </div>
       </>
  );
}