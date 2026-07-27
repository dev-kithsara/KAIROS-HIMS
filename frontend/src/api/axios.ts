import axios from 'axios';

// Create an Axios instance
export const apiClient = axios.create({
  // Since Vite proxy is configured to map '/api' to the backend,
  // relative URLs will automatically be routed correctly.
});

// Request interceptor to automatically inject the JWT token from localStorage
apiClient.interceptors.request.use(
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
