// src/pages/Login.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';

const MESSAGES = {
  GOOGLE_ERROR: 'Có lỗi khi đăng nhập bằng Google: ',
  LOGIN_FAIL: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

 //Kiểm tra token khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Nếu đã có token, thử lấy thông tin người dùng để xác thực
      const fetchUser = async () => {
        try {
          const userResponse = await api.getUser();
          const userData = userResponse.data.data;
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/dashboard');
        } catch (error) {
          console.error('Error fetching user on mount:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      };
      fetchUser();
    }
  }, [navigate]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      const redirectUrl = await api.redirectToGoogle();
      window.location.href = redirectUrl;
    } catch (error) {
      setError(`${MESSAGES.GOOGLE_ERROR}${error.message}`);
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Gọi API đăng nhập
      const response = await api.login(email, password);
      console.log('API Response:', response.data);
      const token = response.data.data.token;
      localStorage.setItem('token', token);

      // Gọi API /user để lấy thông tin người dùng (token tự động được thêm bởi interceptor)
      const userResponse = await api.getUser();
      const userData = userResponse.data.data;
      console.log('User data from /user:', userData);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Thông tin đăng nhập không hợp lệ. Vui lòng thử lại.');
      } else {
        setError(error.response?.data?.message || MESSAGES.LOGIN_FAIL);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, [email, password, navigate]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" role="status" aria-label="Đang tải"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-inner">
        {/* Left Panel - Form */}
        <div className="left-panel">
          <img src="/images/hutech_logo.jpg" alt="Hutech Logo" className="logo" />
          <h2 className="title">Đăng nhập</h2>
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="error-message" role="alert">{error}</div>}
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
                  disabled={loading}
                  aria-label="Email"
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
                  disabled={loading}
                  aria-label="Mật khẩu"
                />
                <span
                  className="toggle-visibility"
                  onClick={togglePasswordVisibility}
                  role="button"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
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
            <div className="forgot-password">
              <Link to="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
              <button
                onClick={handleGoogleLogin}
                className="google-button"
                title="Đăng nhập với Google"
                disabled={loading}
                aria-label="Đăng nhập với Google"
              >
                <img src="/images/login_gg.png" alt="Google Logo" className="google-logo" />
              </button>
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
              aria-label="Đăng nhập"
            >
              Đăng nhập
            </button>
            <div className="register-link">
              <span>Chưa có tài khoản? </span>
              <Link to="/register" className="submit-register">
                Đăng ký
              </Link>
            </div>
          </form>
        </div>

        {/* Right Panel - Illustration */}
        <div className="right-panel">
          <div className="illustration-content">
            <h3 className="illustration-title">
              PHẦN MỀM QUẢN LÝ HỌC SINH VÀ TRUNG TÂM, TRƯỜNG HỌC
            </h3>
            <img src="/images/backroud_login.jpg" alt="Illustration" className="illustration" />
            <p className="illustration-brand">iceWORKS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;