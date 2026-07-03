import axios from "axios";

// Central Axios instance. Sends cookies (for JWT httpOnly cookie auth)
// and automatically attaches a Bearer token if one is stored locally.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sevasaathi_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
