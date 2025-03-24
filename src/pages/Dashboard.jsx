// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ localStorage
  const userString = localStorage.getItem('user');
  let user = null;

  try {
    user = userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user');
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Dashboard</h2>
      <p>Chào mừng, {user.name || 'User'}!</p>
      <p>Email: {user.email || 'N/A'}</p>
      <p>Vai trò: {user.roleCode || user.role_code || 'N/A'}</p>
      <button
        onClick={handleLogout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Dashboard;