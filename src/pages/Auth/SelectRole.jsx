import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/SelectRole.css';

const SelectRole = () => {
  const [role, setRole] = useState('');
  const [userData, setUserData] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user_data từ localStorage khi component mount
    const data = localStorage.getItem('user_data');
    if (data) {
      setUserData(JSON.parse(data));
    } else {
      navigate('/login');
    }
    
  }, [navigate]);

  const handleRoleSelection = async () => {
    if (!role || !userData) {
      alert('Vui lòng chọn vai trò và đảm bảo thông tin người dùng hợp lệ!');
      return;
    }


    try {
      const response = await api.selectRole(role, userData, selectedSubjects);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('subjects', JSON.stringify(selectedSubjects));
      localStorage.removeItem('user_data');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error selecting role:', error);
      alert('Có lỗi khi chọn vai trò: ' + error.message);
    }
  };



  return (
    <div className="select-role-container">
      <div className="select-role-inner">
        {/* Left Panel - Form */}
        <div className="left-panel">
          <img src="/images/hutech_logo.jpg" alt="Hutech Logo" className="logo" />
          <h2 className="title">Chọn vai trò</h2>
          <form className="form">
            <div className="input-group">
              <label htmlFor="role" className="label">Vai trò</label>
              <div className="input-wrapper">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="input"
                >
                  <option value="">Chọn vai trò</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </div>
            
            
            <button
              type="button"
              onClick={handleRoleSelection}
              className="submit-button"
            >
              Xác nhận
            </button>
          </form>
        </div>

        {/* Right Panel - Illustration */}
        <div className="right-panel">
          <div className="illustration-content">
            <h3 className="illustration-title">PHẦN MỀM QUẢN LÝ HỌC SINH</h3>
            <img src="/images/backroud_login.jpg" alt="Illustration" className="illustration" />
            <p className="illustration-brand">iceWORKS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectRole;