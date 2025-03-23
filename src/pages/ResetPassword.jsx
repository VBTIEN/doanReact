import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { validateToken, resetPassword } from '../services/api';
import '../styles/Auth.css';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailFromUrl = params.get('email');
        setEmail(emailFromUrl || '');

        const fetchToken = async () => {
            if (!emailFromUrl) {
                setError('Email không tồn tại trong URL');
                setLoading(false);
                return;
            }

            try {
                const response = await validateToken(emailFromUrl);
                if (!response.data || !response.data.token) {
                    throw new Error('Token không được trả về từ server');
                }
                setToken(response.data.token);
                setLoading(false);
            } catch (error) {
                setError(error.message || 'Không thể lấy token từ server');
                setLoading(false);
            }
        };

        fetchToken();
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setError('Mật khẩu xác nhận không khớp');
            setMessage('');
            return;
        }

        try {
            const response = await resetPassword(email, token, password, passwordConfirmation);
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            setError(error.message || 'Đã có lỗi xảy ra khi đặt lại mật khẩu');
            setMessage('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <p>{error || 'Link không hợp lệ'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="reset-password-container">
            <div className="reset-password-inner">
                {/* Left Panel - Form */}
                <div className="left-panel">
                    <img src="/images/hutech_logo.jpg" alt="Hutech Logo" className="logo" />
                    <h2 className="title">Đặt lại mật khẩu</h2>
                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="form">
                        <div className="input-group">
                            <label htmlFor="password" className="label">Mật khẩu</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input"
                                    placeholder="Nhập mật khẩu mới"
                                />
                                <span className="toggle-visibility" onClick={togglePasswordVisibility}>
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
                        <div className="input-group">
                            <label htmlFor="passwordConfirmation" className="label">Nhập lại mật khẩu</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="passwordConfirmation"
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    required
                                    className="input"
                                    placeholder="Nhập lại mật khẩu"
                                />
                                <span className="toggle-visibility" onClick={toggleConfirmPasswordVisibility}>
                                    {showConfirmPassword ? (
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
                        <button type="submit" className="submit-button">Xác nhận</button>
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

export default ResetPassword;