import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Footer from "./components/Footer";

import Community from "./pages/Community";
import Upload from "./pages/Upload";
import MyReports from "./pages/MyReports";
import Profile from "./pages/Profile";
import HomePage from "./pages/HomePage"; 


import Login from "./pages/Login";
import Signup from "./pages/Register";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Conditional Navbar */}
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}

      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/myreports" element={<MyReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
\

          <Route path="*" element={<Navigate to="/" replace />} /> 
        </Routes>
      </div>

      {/* Only show Footer for non-admin pages */}
      {!isAdminRoute && (
        <Footer className="mt-auto bg-gray-100 dark:bg-gray-900 py-6 shadow-inner transition-colors duration-300" />
      )}
    </div>
  );
}
