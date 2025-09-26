import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const register = async (name, email, password) => {
    const newUser = { name, email, password, id: Date.now() };
    localStorage.setItem("userRegistered", JSON.stringify(newUser));
    return { success: true };
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok) {
        setUser(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));
        return { success: true };
      } else {
        return { success: false, message: result.message || "Login failed" };
      }
    } catch (err) {
      return { success: false, message: "Server error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
