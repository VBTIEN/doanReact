import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Dashboard</h2>
      <p>
        Chào mừng, {user ? user.name : 'User'}!
      </p>
      <p>Email: {user ? user.email : 'N/A'}</p>
      <p>
        Vai trò: {user ? (user.roleCode || user.role_code) : 'N/A'}
      </p>
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