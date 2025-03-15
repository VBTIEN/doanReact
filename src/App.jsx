import { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';
import api from './services/api';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessedCallback = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code && location.pathname === '/' && !hasProcessedCallback.current) {
      hasProcessedCallback.current = true;
      const handleGoogleCallback = async () => {
        try {
          console.log('Processing Google callback with code:', code);
          const response = await api.handleGoogleCallback(code);
          console.log('Response from backend:', response.data);
          const data = response.data;

          if (data.user_data) {
            localStorage.setItem('user_data', JSON.stringify(data.user_data));
            console.log('User data saved to localStorage:', data.user_data);
            navigate('/register', { replace: true });
          } else if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/dashboard', { replace: true });
          } else {
            console.error('Không nhận được user_data hoặc token:', data);
            navigate('/login', { replace: true });
          }
        } catch (error) {
          console.error('Lỗi khi xử lý Google callback:', error.response ? error.response.data : error.message);
          // Nếu đã lưu user_data, không chuyển hướng về /login
          const userData = localStorage.getItem('user_data');
          if (userData) {
            navigate('/register', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }
      };

      handleGoogleCallback();
    }
  }, [navigate, location.search]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

export default App;