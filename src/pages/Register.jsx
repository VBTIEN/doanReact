import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [role, setRole] = useState('');
  const [userData, setUserData] = useState(null);
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
      const response = await api.selectRole(role, userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.removeItem('user_data');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error selecting role:', error);
      alert('Có lỗi khi chọn vai trò: ' + error.message);
    }
  };

  if (!userData) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chọn vai trò</h2>
      <p>Xin chào, {userData.name} ({userData.email})</p>
      <div>
        <label htmlFor="role">Vai trò: </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '5px', margin: '10px' }}
        >
          <option value="">Chọn vai trò</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <button
        onClick={handleRoleSelection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Xác nhận
      </button>
    </div>
  );
};

export default Register;