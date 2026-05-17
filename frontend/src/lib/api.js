import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  timeout: 30000,
});

// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  googleLogin: (credential) => API.post('/auth/google', { credential }),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  logout: () => API.get('/auth/logout'),
};

export const applicationAPI = {
  getAll: (params) => API.get('/applications', { params }),
  create: (data) => API.post('/applications', data),
  update: (id, data) => API.put(`/applications/${id}`, data),
  delete: (id) => API.delete(`/applications/${id}`),
  getAnalytics: () => API.get('/applications/analytics'),
  getHeatmap: () => API.get('/applications/heatmap'),
  importLinkedIn: (data) => API.post('/applications/import-linkedin', data),
};

// Network
export const networkAPI = {
  getAll: (params) => API.get('/network', { params }),
  create: (data) => API.post('/network', data),
  update: (id, data) => API.put(`/network/${id}`, data),
  delete: (id) => API.delete(`/network/${id}`),
};

// Goals
export const goalAPI = {
  getAll: () => API.get('/goals'),
  create: (data) => API.post('/goals', data),
  update: (id, data) => API.put(`/goals/${id}`, data),
  delete: (id) => API.delete(`/goals/${id}`),
};

// Interview Vault
export const interviewAPI = {
  getAll: (params) => API.get('/interview-vault', { params }),
  create: (data) => API.post('/interview-vault', data),
  update: (id, data) => API.put(`/interview-vault/${id}`, data),
  delete: (id) => API.delete(`/interview-vault/${id}`),
  generateQuestions: (data) => API.post('/interview-vault/generate-questions', data),
};

// AI
export const aiAPI = {
  resumeMatch: (data) => API.post('/ai/resume-match', data),
  getInsights: () => API.get('/ai/insights'),
};

// LinkedIn CRM
export const linkedinAPI = {
  getAll: (params) => API.get('/linkedin', { params }),
  create: (data) => API.post('/linkedin', data),
  update: (id, data) => API.put(`/linkedin/${id}`, data),
  delete: (id) => API.delete(`/linkedin/${id}`),
};

// Resume Intelligence
export const resumeIntelligenceAPI = {
  analyze: (data) => API.post('/resume-intelligence/analyze', data),
};

export const resumeAPI = {
  getAll: () => API.get('/resumes'),
  upload: (data) => API.post('/resumes', data),
  delete: (id) => API.delete(`/resumes/${id}`),
  setDefault: (id) => API.put(`/resumes/${id}/default`),
};

export default API;
