// src/App.jsx
import { useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import SelectRole from './pages/Auth/SelectRole';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/Auth/ResetPassword';
import api from './services/api';
import ForgotPassword from './pages/Auth/ForgotPassword';
import Register from './pages/Auth/Register';
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import StudentDashboard from './pages/Student/StudentDashboard';

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/register', '/selectrole', '/forgot-password', '/reset-password', '/dashboard'];

    if (!token && !publicPaths.includes(location.pathname)) {
      // Nếu không có token và không ở trang công khai, chuyển hướng về /login
      navigate('/login', { replace: true });
    } else if (token) {
      // Nếu có token, lấy thông tin người dùng để xác thực
      const fetchUser = async () => {
        try {
          const userResponse = await api.getUser();
          const userData = userResponse.data;
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error in ProtectedRoute:', error);
          // Interceptor trong api.js sẽ xử lý lỗi 401 và chuyển hướng về /login
        }
      };
      fetchUser();
    }
  }, [navigate, location.pathname]);

  return children;
};

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
            navigate('/selectrole', { replace: true });
          } else if (data.token) {
            localStorage.setItem('token', data.token);
            // Gọi API /user để lấy thông tin người dùng
            const userResponse = await api.getUser();
            const userData = userResponse.data;
            localStorage.setItem('user', JSON.stringify(userData));
            navigate('/dashboard', { replace: true });
          } else {
            console.error('Không nhận được user_data hoặc token:', data);
            navigate('/login', { replace: true });
          }
        } catch (error) {
          console.error('Lỗi khi xử lý Google callback:', error.response ? error.response.data : error.message);
          const userData = localStorage.getItem('user_data');
          if (userData) {
            navigate('/selectrole', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }
      };

      handleGoogleCallback();
    }
  }, [navigate, location.search]);

  return (
    <div className="container">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/selectrole" element={<SelectRole />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </div>
  );
};

export default App;