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

// API để lấy xếp hạng theo lớp và học kỳ
export const getClassroomTermRankings = async (classroomCode, termCode) => {
  try {
    const response = await publicApi.post('/rankings/classroom-term', {
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
    const response = await publicApi.post('/rankings/grade-term', {
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
    const response = await publicApi.post('/rankings/classroom-yearly', {
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
    const response = await publicApi.post('/rankings/grade-yearly', {
      grade_code: gradeCode,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching grade-yearly rankings:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách học sinh theo học lực (classroom-term)
export const getClassroomTermAcademicPerformance = async (classroomCode, termCode, academicPerformance) => {
  try {
    const response = await publicApi.post('/academic-performance/classroom-term', {
      classroom_code: classroomCode,
      term_code: termCode,
      academic_performance: academicPerformance,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching classroom-term academic performance:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách học sinh theo học lực (classroom-yearly)
export const getClassroomYearlyAcademicPerformance = async (classroomCode, academicPerformance) => {
  try {
    const response = await publicApi.post('/academic-performance/classroom-yearly', {
      classroom_code: classroomCode,
      academic_performance: academicPerformance,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching classroom-yearly academic performance:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách học sinh theo học lực (grade-term)
export const getGradeTermAcademicPerformance = async (gradeCode, termCode, academicPerformance) => {
  try {
    const response = await publicApi.post('/academic-performance/grade-term', {
      grade_code: gradeCode,
      term_code: termCode,
      academic_performance: academicPerformance,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching grade-term academic performance:', error.response?.data || error.message);
    throw error;
  }
};

// API để lấy danh sách học sinh theo học lực (grade-yearly)
export const getGradeYearlyAcademicPerformance = async (gradeCode, academicPerformance) => {
  try {
    const response = await publicApi.post('/academic-performance/grade-yearly', {
      grade_code: gradeCode,
      academic_performance: academicPerformance,
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching grade-yearly academic performance:', error.response?.data || error.message);
    throw error;
  }
};

// API để export tất cả điểm
export const exportScores = async () => {
  try {
    const response = await publicApi.get('/export-scores');
    if (response.data.status === 'success') {
      return response.data; 
    } else {
      throw new Error(response.data.message || 'Failed to export scores');
    }
  } catch (error) {
    console.error('Error exporting scores:', error.response?.data || error.message);
    throw error;
  }
};

// API để export điểm trung bình học kỳ của học sinh
export const exportStudentTermAverages = async () => {
  try {
    const response = await publicApi.get('/export-student-term-averages');
    if (response.data.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to export student term averages');
    }
  } catch (error) {
    console.error('Error exporting student term averages:', error.response?.data || error.message);
    throw error;
  }
};

// API để export điểm trung bình cả năm của học sinh
export const exportStudentYearlyAverages = async () => {
  try {
    const response = await publicApi.get('/export-student-yearly-averages');
    if (response.data.status === 'success') {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to export student yearly averages');
    }
  } catch (error) {
    console.error('Error exporting student yearly averages:', error.response?.data || error.message);
    throw error;
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
  getClassroomTermRankings,
  getGradeTermRankings,
  getClassroomYearlyRankings,
  getGradeYearlyRankings,
  getClassroomTermAcademicPerformance,
  getClassroomYearlyAcademicPerformance,
  getGradeTermAcademicPerformance,
  getGradeYearlyAcademicPerformance,
  exportScores,
  exportStudentTermAverages,
  exportStudentYearlyAverages, 
};