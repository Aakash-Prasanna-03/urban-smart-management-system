import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const auth = useAuth() || {};
  const { user, logout } = auth;
  const navigate = useNavigate();

  // Dark Mode state
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    const newTheme = darkMode ? "light" : "dark";
    document.documentElement.classList.toggle("dark", !darkMode);
    localStorage.setItem("theme", newTheme);
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between scale-105">
        {/* Logo - Far Left */}
        <div className="flex items-center flex-shrink-0" style={{ minWidth: "160px" }}>
          <Link
            to="/"
            className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 tracking-tight drop-shadow-xl"
            style={{ letterSpacing: "-1px" }}
          >
            UrbanFix
          </Link>
        </div>

        {/* Links - Centered */}
        <div className="flex flex-1 justify-center items-center gap-10">
          <Link
            to="/community"
            className="font-semibold text-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-xl"
          >
            Community
          </Link>
          <Link
            to="/upload"
            className="font-semibold text-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-xl"
          >
            Upload
          </Link>
          {user && (
            <>
              <Link
                to="/myreports"
                className="font-semibold text-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-xl"
              >
                My Reports
              </Link>
              <Link
                to="/profile"
                className="font-semibold text-lg text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-3 py-2 rounded-xl"
              >
                Profile
              </Link>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors text-lg"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors text-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Dark Mode Toggle + Logout - Far Right */}
        <div className="flex items-center gap-3 flex-shrink-0" style={{ minWidth: "160px", justifyContent: "flex-end" }}>
          <button
            onClick={toggleDarkMode}
            className="p-3 rounded-xl bg-gray-700 text-yellow-300 hover:bg-gray-600 transition-colors text-2xl shadow flex items-center justify-center"
            aria-label="Toggle dark mode"
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
          {user && (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-lg ml-2 flex items-center justify-center"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
