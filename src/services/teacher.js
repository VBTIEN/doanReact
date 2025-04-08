// src/services/teacher.js
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
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error in teacher.js:', error);
    return Promise.reject(error);
  }
);

// API để gán giáo viên làm chủ nhiệm lớp
export const assignHomeroomClassroom = async (classroomCode) => {
  try {
    const response = await api.post('/assign-homeroom-classroom', {
      classroom_code: classroomCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error assigning homeroom classroom:', error.response?.data || error.message);
    throw error;
  }
};

// API để gán giáo viên dạy lớp
export const assignTeachingClassroom = async (classroomCode) => {
  try {
    const response = await api.post('/assign-teaching-classroom', {
      classroom_code: classroomCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error assigning teaching classroom:', error.response?.data || error.message);
    throw error;
  }
};

// API để giáo viên nhập điểm
export const enterScores = async (classroomCode, examCode, scores) => {
  try {
    const response = await api.post('/teacher/enter-scores', {
      classroom_code: classroomCode,
      exam_code: examCode,
      scores,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error entering scores:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách tất cả giáo viên
export const getAllTeachers = async () => {
  try {
    const response = await api.get('/teachers');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching teachers:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách học sinh theo lớp
export const getStudentsByClassroom = async (classroomCode) => {
  try {
    const response = await api.get(`/students-by-classroom?classroom_code=${classroomCode}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching students by classroom:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách giáo viên trong một lớp
export const getTeachersInClassroom = async (classroomCode) => {
  try {
    const response = await api.get(`/teachers-in-classroom?classroom_code=${classroomCode}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching teachers in classroom:', error.response?.data || error.message);
    throw error;
  }
};
export const updateTeacherProfile = async (teacherData) => {
  try {
    // Tạo FormData để gửi dữ liệu dạng multipart/form-data
    const formData = new FormData();
    
    // Thêm các trường dữ liệu vào FormData
    if (teacherData.name) {
      formData.append('name', teacherData.name);
    }
    if (teacherData.email) {
      formData.append('email', teacherData.email);
    }
    if (teacherData.avatar) {
      formData.append('avatar', teacherData.avatar); 
    }

    const response = await api.put('/teacher/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    console.error('Error updating teacher profile:', error.response?.data || error.message);
    throw error;
  }
};
// API để lấy điểm của lớp học
export const getClassroomScores = async (classroomCode, examCode = '', subjectCode = '') => {
  try {
    const response = await api.post('/teacher/classroom-scores', {
      classroom_code: classroomCode,
      exam_code: examCode,
      subject_code: subjectCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching classroom scores:', error.response?.data || error.message);
    throw error;
  }
};

// Export các hàm dưới dạng object
export default {
  assignHomeroomClassroom,
  assignTeachingClassroom,
  enterScores,
  getAllTeachers,
  getStudentsByClassroom,
  getTeachersInClassroom,
  updateTeacherProfile,
  getClassroomScores,
};