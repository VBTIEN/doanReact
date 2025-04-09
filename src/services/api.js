import axios from 'axios';

// Lấy baseURL từ biến môi trường
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance axios với baseURL từ .env
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Hỗ trợ credentials
});

// Interceptor để thêm token vào header và log request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// API validate token
export const validateToken = async (email) => {
  return api.get(`/password/validate-token?email=${encodeURIComponent(email)}`);
};

// API reset password
export const resetPassword = async (email, token, password, passwordConfirmation) => {
  return api.post(
    `/password/reset?email=${encodeURIComponent(email)}`,
    { 
      password, 
      password_confirmation: passwordConfirmation,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// API forgot password
export const forgotPassword = async (email) => {
  return api.post('/password/forgot', { email });
};

// API register
// src/services/api.js
export const register = async (name, email, password, passwordConfirmation, roleCode, additionalData = {}) => {
  return api.post('/register', {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation,
    role_code: roleCode,
    ...additionalData, 
  });
};
// API login
export const login = async (email, password) => {
  return api.post('/login', {
    email,
    password,
  });
};

// API mới cho Google Auth
export const redirectToGoogle = async () => {
  //const baseURL = api.defaults.baseURL.replace('/api', '');
  const baseURL = api.defaults.baseURL;
  return `${baseURL}/auth/google`;
};

export const handleGoogleCallback = async (code) => {
  return api.get(`/auth/google/callback?code=${code}`);
};

export const selectRole = async (role, userData) => {
  return api.post('/select-role', { role, user_data: userData });
};

export const getUser = async () => {
  return await api.get('/user');
};

export default {
  validateToken,
  resetPassword,
  forgotPassword,
  register,
  login,
  redirectToGoogle,
  handleGoogleCallback,
  selectRole,
  getUser,
};