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
      console.log('No token found in localStorage for student.js');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error in student.js:', error);
    return Promise.reject(error);
  }
);

// API để lấy điểm của học sinh
export const getStudentScores = async (subjectCode, termCode) => {
  try {
    const response = await api.post('/student/scores', {
      subject_code: subjectCode,
      term_code: termCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student scores:', error.response?.data || error.message);
    throw error;
  }
};

// API để cập nhật thông tin học sinh (bao gồm upload avatar)
export const updateStudentProfile = async (studentData) => {
  try {

    // Tạo FormData để gửi dữ liệu dạng multipart/form-data
    const formData = new FormData();

    // Thêm các trường dữ liệu vào FormData
    if (studentData.name) {
      formData.append('name', studentData.name);
    }
    if (studentData.email) {
      formData.append('email', studentData.email);
    }
    if (studentData.avatar) {
      formData.append('avatar', studentData.avatar); // avatar là file
    }

    // Gửi request PUT với FormData
    const response = await api.put('/student/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Đặt header cho multipart form
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error updating student profile:', error.response?.data || error.message);
    throw error;
  }
};

// API để export điểm của học sinh
export const exportStudentScores = async () => {
  try {
    const response = await api.post('/export/student-scores');
    if (response.data.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to export student scores');
    }
  } catch (error) {
    console.error('Error exporting student scores:', error.response?.data || error.message);
    throw error;
  }
};

// Export các hàm dưới dạng object
export default {
  getStudentScores,
  updateStudentProfile,
  exportStudentScores, 
};