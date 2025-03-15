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

// Interceptor để log request (tùy chọn, có thể bỏ nếu không cần)
api.interceptors.request.use((config) => {
  console.log('Sending request to:', config.baseURL + config.url); // Debug
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// API validate token
export const validateToken = async (email) => {
  console.log('Validating token for email:', email);
  return api.get(`/password/validate-token?email=${encodeURIComponent(email)}`);
};

// API reset password
export const resetPassword = async (email, token, password, passwordConfirmation) => {
  console.log('Resetting password for:', email);
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

export default {
  validateToken,
  resetPassword,
  redirectToGoogle,
  handleGoogleCallback,
  selectRole,
};