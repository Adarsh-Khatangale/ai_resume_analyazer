import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Request interceptor to attach Bearer token for cross-origin / Vercel deployments
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for clear error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const authAPI = {
  getMe: () => API.get('/auth/me'),
  register: (userData) => API.post('/auth/register', userData),
  login: (credentials) => API.post('/auth/login', credentials),
  verifyGoogle: (credential) => API.post('/auth/google/verify', { credential }),
  demoLogin: () => API.post('/auth/demo-login'),
  logout: () => API.post('/auth/logout'),
};

export const analysisAPI = {
  analyze: (formData) =>
    API.post('/analysis/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  guestAnalyze: (formData) =>
    API.post('/analysis/guest', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => API.get('/analysis'),
  getById: (id) => API.get(`/analysis/${id}`),
  delete: (id) => API.delete(`/analysis/${id}`),
};

export const userAPI = {
  getProfile: () => API.get('/user/profile'),
  deleteAccount: () => API.delete('/user/account'),
};

export default API;
