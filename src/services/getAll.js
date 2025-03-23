// src/services/getAll.js
import axios from 'axios';

// Lấy baseURL từ biến môi trường (tương tự api.js)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo instance axios mới không có interceptor (dành cho API công khai)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Lấy danh sách tất cả roles
export const getAllRoles = async () => {
  try {
    const response = await publicApi.get('/roles');
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching roles:', error.response?.data || error.message);
    return []; 
  }
};

// Lấy danh sách tất cả classrooms
export const getAllClassrooms = async () => {
  try {
    const response = await publicApi.get('/classrooms'); 
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching classrooms:', error.response?.data || error.message);
    return [];
  }
};

// Lấy danh sách tất cả exams
export const getAllExams = async () => {
  try {
    const response = await publicApi.get('/exams');
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching exams:', error.response?.data || error.message);
    return [];
  }
};

// Lấy danh sách tất cả grades
export const getAllGrades = async () => {
  try {
    const response = await publicApi.get('/grades'); 
    console.log("grades:",response.data.data);
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching grades:', error.response?.data || error.message);
    return [];
  }
};

// Lấy danh sách tất cả school years
export const getAllSchoolYears = async () => {
  try {
    const response = await publicApi.get('/school-years');
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching school years:', error.response?.data || error.message);
    return [];
  }
};

// Lấy danh sách tất cả subjects
export const getAllSubjects = async () => {
  try {
    const response = await publicApi.get('/subjects');
    console.log("subjects:", response.data.data);
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching subjects:', error.response?.data || error.message);
    return [];
  }
};

// Lấy danh sách tất cả terms
export const getAllTerms = async () => {
  try {
    const response = await publicApi.get('/terms'); 
    return Array.isArray(response.data.data) ? response.data.data : [];
  } catch (error) {
    console.error('Error fetching terms:', error.response?.data || error.message);
    return [];
  }
};

// Export tất cả các hàm
export default {
  getAllRoles,
  getAllClassrooms,
  getAllExams,
  getAllGrades,
  getAllSchoolYears,
  getAllSubjects,
  getAllTerms,
};