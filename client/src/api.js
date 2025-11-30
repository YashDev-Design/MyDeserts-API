import axios from "axios";

// Create a single Axios instance for the whole app
const api = axios.create({
  baseURL: "http://localhost:10000/api",
});

// Automatically attach token (if exists) to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
