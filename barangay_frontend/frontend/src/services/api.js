import axios from 'axios';

const host = window.location.hostname || '127.0.0.1';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || `http://${host}:8000`;
export const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || `ws://${host}:8000`;

export const tokenStore = {
  getAccess: () => localStorage.getItem('access_token'),
  getRefresh: () => localStorage.getItem('refresh_token'),
  getUser: () => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  },
  setAuth: ({ access, refresh, user }) => {
    if (access) localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    if (user) localStorage.setItem('user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },
};

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (payload) => api.post('/auth/register/', payload),
  login: (payload) => api.post('/auth/login/', payload),
  me: () => api.get('/auth/me/'),
  logout: (refresh) => api.post('/auth/logout/', { refresh }),
};

export const getImageUrl = (path) => {
  if (!path) return 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80';
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export const statusToFrontend = (status) => (status || '').replaceAll('_', '-');
export const statusToBackend = (status) => (status || '').replaceAll('-', '_');

export const apiCategoryToLabel = (category) => {
  const labels = {
    pothole: 'Pothole',
    streetlight: 'Streetlight',
    drainage: 'Drainage',
    garbage: 'Garbage',
    flooding: 'Flooding',
    noise: 'Noise',
    disturbance: 'Disturbance',
    safety: 'Safety',
    other: 'Other',
  };
  return labels[category] || category || 'Other';
};

export const labelToApiCategory = (category) => {
  const value = (category || '').toLowerCase();
  const labels = {
    pothole: 'pothole',
    streetlight: 'streetlight',
    drainage: 'drainage',
    garbage: 'garbage',
    'garbage/waste': 'garbage',
    flooding: 'flooding',
    noise: 'noise',
    'noise complaint': 'noise',
    disturbance: 'disturbance',
    safety: 'safety',
    other: 'other',
  };
  return labels[value] || 'other';
};

export const infrastructureCategories = new Set(['pothole', 'streetlight', 'drainage', 'garbage', 'flooding', 'other']);

export default api;
