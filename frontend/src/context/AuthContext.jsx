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
    const stored = JSON.parse(localStorage.getItem("userRegistered"));
    if (!stored || stored.email !== email || stored.password !== password) {
      return { success: false, message: "Invalid email or password" };
    }
    setUser(stored);
    localStorage.setItem("user", JSON.stringify(stored));
    return { success: true };
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
