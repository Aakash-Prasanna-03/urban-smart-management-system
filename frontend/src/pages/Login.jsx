// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/myreports");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url('login.png')`
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-10 max-w-md w-full space-y-6 border border-white/20">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide">
            Login
          </h1>
          <p className="mt-3 text-sm text-gray-200">
            Access your{" "}
            <span className="font-semibold text-indigo-300">UrbanFix</span> account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-600/80 text-red-100 border border-red-400/60 px-4 py-3 rounded-md text-sm animate-pulse">
              {error}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="block w-full pl-4 pr-3 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm transition"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="block w-full pl-4 pr-3 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm transition"
          />

          {/* Button */}
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 transition-all shadow-lg hover:shadow-indigo-500/40"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
