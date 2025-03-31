// src/services/student.js
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
    console.log('Token in student.js interceptor:', token); // Debug token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set in student.js:', config.headers.Authorization); // Debug header
    } else {
      console.log('No token found in localStorage for student.js'); // Debug khi không có token
    }
    console.log('Sending request to:', config.baseURL + config.url); // Debug URL
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
    console.log('Fetching scores for subject:', subjectCode, 'term:', termCode);
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
    console.log('Updating student profile with data:', studentData);

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

    console.log('Student profile updated successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating student profile:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy xếp hạng theo lớp và học kỳ
export const getClassroomTermRankings = async (classroomCode, termCode) => {
  try {
    console.log('Fetching classroom-term rankings for classroom:', classroomCode, 'term:', termCode);
    const response = await api.post('/rankings/classroom-term', {
      classroom_code: classroomCode,
      term_code: termCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching classroom-term rankings:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy xếp hạng theo khối và học kỳ
export const getGradeTermRankings = async (gradeCode, termCode) => {
  try {
    console.log('Fetching grade-term rankings for grade:', gradeCode, 'term:', termCode);
    const response = await api.post('/rankings/grade-term', {
      grade_code: gradeCode,
      term_code: termCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching grade-term rankings:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy xếp hạng theo lớp trong cả năm
export const getClassroomYearlyRankings = async (classroomCode) => {
  try {
    console.log('Fetching classroom-yearly rankings for classroom:', classroomCode);
    const response = await api.post('/rankings/classroom-yearly', {
      classroom_code: classroomCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching classroom-yearly rankings:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy xếp hạng theo khối trong cả năm
export const getGradeYearlyRankings = async (gradeCode) => {
  try {
    console.log('Fetching grade-yearly rankings for grade:', gradeCode);
    const response = await api.post('/rankings/grade-yearly', {
      grade_code: gradeCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching grade-yearly rankings:', error.response?.data || error.message);
    throw error;
  }
};

// Export các hàm dưới dạng object
export default {
  getStudentScores,
  updateStudentProfile,
  getClassroomTermRankings,
  getGradeTermRankings,
  getClassroomYearlyRankings,
  getGradeYearlyRankings,
};