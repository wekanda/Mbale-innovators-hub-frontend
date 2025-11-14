import axios from 'axios';

// The base URL for your backend API.
// During development, it will be 'http://localhost:10000/api'.
// In production, it will be your live Render URL.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// This is a request interceptor. It automatically adds the
// authentication token to every request if it exists.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
