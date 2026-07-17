import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically inject JWT token into the headers of all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wanderlust_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
