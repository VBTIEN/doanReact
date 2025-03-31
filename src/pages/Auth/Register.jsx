// src/pages/Register.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import getAll from '../../services/getAll'; 
import '../../styles/Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState(''); 
  const [grade, setGrade] = useState('');
  const [subjectCodes, setSubjectCodes] = useState([]);
  const [grades, setGrades] = useState([]); 
  const [subjects, setSubjects] = useState([]); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesData, subjectsData] = await Promise.all([
          getAll.getAllGrades(),
          getAll.getAllSubjects(),
        ]);
        setGrades(Array.isArray(gradesData) ? gradesData : []);
        setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      } catch (error) {
        console.error('Error fetching grades or subjects:', error);
        setError('Không thể tải danh sách khối lớp hoặc môn học. Vui lòng thử lại sau.');
      }
    };
    fetchData();
  }, []);


  // Xử lý đăng ký
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');

      // Map role name to role_code
      const roleCodeMap = {
        'Học Sinh': 'R2',
        'Giáo Viên': 'R1',
      };
      const roleCode = roleCodeMap[role] || '';

      if (!roleCode) {
        setError('Vui lòng chọn vai trò!');
        setLoading(false);
        return;
      }

      // Kiểm tra thêm các trường bắt buộc dựa trên vai trò
      if (role === 'Học Sinh' && !grade) {
        setError('Vui lòng chọn khối lớp!');
        setLoading(false);
        return;
      }

      if (role === 'Giáo Viên' && subjectCodes.length === 0) {
        setError('Vui lòng chọn ít nhất một môn học!');
        setLoading(false);
        return;
      }

      try {
        // Chuẩn bị dữ liệu để gửi
        const data = {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
          role_code: roleCode,
        };
        // Thêm grade hoặc subject_codes tùy theo vai trò
        if (role === 'Học Sinh') {
          data.grade_code = grade;
        } else if (role === 'Giáo Viên') {
          data.subject_codes = subjectCodes; 
        }
        console.log("Data: ", data);

        // Gọi API đăng ký với dữ liệu đã chuẩn bị
        const response = await api.register(
          data.name,
          data.email,
          data.password,
          data.password_confirmation,
          data.role_code,
          role === 'Học Sinh' ? { grade_code: data.grade_code } : role === 'Giáo Viên' ? { subject_codes: data.subject_codes } : {}
        );

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem('token', response.data.data.token);
        const userResponse = await api.getUser();
        const userData = userResponse.data.data;
        localStorage.setItem('user', JSON.stringify(userData));

        navigate('/dashboard');
      } catch (error) {
        setError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, passwordConfirmation, role, grade, subjectCodes, navigate]
  );

  // Toggle mật khẩu visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const togglePasswordConfirmationVisibility = useCallback(() => {
    setShowPasswordConfirmation((prev) => !prev);
  }, []);

  // Xử lý chọn nhiều subject_codes
  const handleSubjectCodesChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSubjectCodes(selectedOptions);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="register-container">
      <div className="register-inner">
        {/* Left Panel - Form */}
        <div className="left-panel">
          <img src="/images/hutech_logo.jpg" alt="Hutech Logo" className="logo" />
          <h2 className="title">Đăng ký</h2>
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="error-message">{error}</div>}
            <div className="input-group">
              <label htmlFor="name" className="label">Tên</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input"
                  placeholder="Nhập tên của bạn"
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="email" className="label">Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="password" className="label">Mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                  placeholder="Nhập mật khẩu"
                />
                <span className="toggle-visibility" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" className="eye-off-icon">
                      <path d="M17 17L7 7M7 17L17 7" />
                      <circle cx="12" cy="12" r="3" style={{ opacity: 0.5 }} />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" className="eye-icon">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="passwordConfirmation" className="label">Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  id="passwordConfirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="input"
                  placeholder="Nhập lại mật khẩu"
                />
                <span className="toggle-visibility" onClick={togglePasswordConfirmationVisibility}>
                  {showPasswordConfirmation ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" className="eye-off-icon">
                      <path d="M17 17L7 7M7 17L17 7" />
                      <circle cx="12" cy="12" r="3" style={{ opacity: 0.5 }} />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" className="eye-icon">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="role" className="label">Vai trò</label>
              <div className="input-wrapper">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    setGrade(''); 
                    setSubjectCodes([]); 
                  }}
                  required
                  className="input"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="Học Sinh">Học Sinh</option>
                  <option value="Giáo Viên">Giáo Viên</option>
                </select>
              </div>
            </div>
            {role === 'Học Sinh' && (
              <div className="input-group">
                <label htmlFor="grade" className="label">Khối lớp</label>
                <div className="input-wrapper">
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                    className="input"
                  >
                    <option value="">Chọn khối lớp</option>
                    {Array.isArray(grades) && grades.map((gradeItem) => (
                      <option key={gradeItem.grade_code } value={gradeItem.grade_code}>
                        {gradeItem.grade_name} ({gradeItem.grade_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {role === 'Giáo Viên' && (
              <div className="input-group">
                <label htmlFor="subjectCodes" className="label">Môn học</label>
                <div className="input-wrapper">
                  <select
                    id="subjectCodes"
                    multiple
                    value={subjectCodes}
                    onChange={handleSubjectCodesChange}
                    required
                    className="input"
                    style={{ height: '100px' }}
                  >
                    {Array.isArray(subjects) && subjects.map((subject) => (
                      <option 
                        key={subject.subject_code} 
                        value={subject.subject_code}
                      >
                        {subject.subject_name} ({subject.subject_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <button type="submit" className="submit-button">Đăng ký</button>
            <div className="register-link">
              <span>Đã có tài khoản? </span>
              <Link to="/login" className="forgot-link">Đăng nhập</Link>
            </div>
          </form>
        </div>

        {/* Right Panel - Illustration */}
        <div className="right-panel">
          <div className="illustration-content">
            <h3 className="illustration-title">PHẦN MỀM QUẢN LÝ HỌC SINH VÀ TRUNG TÂM, TRƯỜNG HỌC</h3>
            <img src="/images/backroud_login.jpg" alt="Illustration" className="illustration" />
            <p className="illustration-brand">iceWORKS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;