import { useEffect, useRef, useState } from 'react';
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
import NotFound from './pages/NotFound';
import { CircularProgress, Box } from '@mui/material';

// Component bảo vệ route
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const publicPaths = ['/login', '/register', '/selectrole', '/forgot-password', '/reset-password', '/dashboard'];

    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/login', { replace: true });
      setIsLoading(false);
    } else if (token) {
      const fetchUser = async () => {
        try {
          const userResponse = await api.getUser();
          const userData = userResponse.data;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData); // Update user state
        } catch (error) {
          console.error('Error in ProtectedRoute:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login', { replace: true });
        } finally {
          setIsLoading(false); // Set loading to false after fetching
        }
      };
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Full viewport height to center vertically
          bgcolor: '#F7F9FC', // Optional: Match the background color of your app
        }}
      >
        <CircularProgress size={50} thickness={4} color="primary" />
      </Box>
    );
  }

  return children;
};

// Chia Role
const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Access role_code from user.data
  const roleCode = user?.data?.role_code || user?.data?.roleCode;

  useEffect(() => {
    if (!user || !roleCode || !allowedRoles.includes(roleCode)) {
      navigate('/login', { replace: true }); // Redirect to login if role is invalid
    }
  }, [user, roleCode, allowedRoles, navigate]);

  return user && roleCode && allowedRoles.includes(roleCode) ? children : null;
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
          const response = await api.handleGoogleCallback(code);
          const data = response.data;

          if (data.user_data) {
            localStorage.setItem('user_data', JSON.stringify(data.user_data));
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
        <Route
          path="/teacher"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['R1']}>
                <TeacherDashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute>
              <RoleProtectedRoute allowedRoles={['R2']}>
                <StudentDashboard />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;