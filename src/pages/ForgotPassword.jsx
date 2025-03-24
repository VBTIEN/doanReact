import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../styles/Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.forgotPassword(email);
      setSuccess('Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.');
    } catch (error) {
      setError(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-inner">
        {/* Left Panel - Form */}
        <div className="left-panel">
          <img src="/images/hutech_logo.jpg" alt="Hutech Logo" className="logo" />
          <h2 className="title">Quên mật khẩu?</h2>
          <form onSubmit={handleSubmit} className="form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <p className="instruction">
              Điền email đã dùng để đăng ký tài khoản để nhận đường dẫn đặt lại mật khẩu.
            </p>
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
                />
              </div>
            </div>
            <button type="submit" className="submit-button">Lấy lại mật khẩu</button>
            <div className="back-link">
              <Link to="/login" className="back-link-text">Quay lại đăng nhập</Link>
            </div>
          </form>
        </div>

        {/* Right Panel - Illustration */}
        <div className="right-panel">
          <div className="illustration-content">
            <h3 className="illustration-title">PHẦN MỀM QUẢN LÝ HỌC SINH VÀ TRUNG TÂM, TRƯỜNG HỌC</h3>
            <img src="/images/backroud_login.jpg" alt="Illustration" className="illustration" />
            <p className="illustration-brand">iceWORKS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;