import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const userString = localStorage.getItem('user');
    let user = null;

    try {
      user = userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      localStorage.removeItem('user');
      navigate('/login'); // Redirect to login if there's an error parsing user
      return;
    }
    if (!user || !user.data) {
      navigate('/login');
      return;
    }

    // Extract role_code from user.data
    const roleCode = user.data.role_code || user.data.roleCode;

    // Redirect based on role_code
    if (roleCode === 'R2') {
      navigate('/student'); // Redirect to student dashboard
    } else if (roleCode === 'R1') {
      navigate('/teacher'); // Redirect to teacher dashboard
    } else {
      // If role_code is invalid or unknown, redirect to login
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);
  return null;
};

export default Dashboard;