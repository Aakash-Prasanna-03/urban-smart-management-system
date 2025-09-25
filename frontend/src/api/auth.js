// src/api/auth.js
import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export const loginAPI = async (email, password) => {
  const response = await client.post("/auth/login", { email, password });
  return response.data.user;
};

export const signupAPI = async (name, email, password) => {
  const response = await client.post("/auth/register", { name, email, password });
  return response.data.user;
};

export const logoutAPI = async () => {};

export const getUserAPI = async () => {
  // Placeholder: implement when backend exposes /api/auth/me
  return null;
};
