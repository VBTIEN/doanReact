import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const redirectUrl = await api.redirectToGoogle();
    window.location.href = redirectUrl;
  };

  useEffect(() => {
    // Kiểm tra nếu đã có token, chuyển hướng đến dashboard
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Đăng nhập</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4285F4',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Đăng nhập với Google
      </button>
    </div>
  );
};

export default Login;