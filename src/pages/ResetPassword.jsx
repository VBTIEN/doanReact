import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { validateToken, resetPassword } from '../services/api';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailFromUrl = params.get('email');
        console.log('Email from URL:', emailFromUrl); // Debug
        setEmail(emailFromUrl || '');

        const fetchToken = async () => {
            if (!emailFromUrl) {
                setError('Email không tồn tại trong URL');
                setLoading(false);
                return;
            }

            try {
                console.log('Fetching token for email:', emailFromUrl); // Debug
                const response = await validateToken(emailFromUrl);
                console.log('Full API response:', response); // Debug toàn bộ response
                if (!response.data || !response.data.token) {
                    throw new Error('Token không được trả về từ server. Response data:', JSON.stringify(response.data));
                }
                setToken(response.data.token);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching token:', error.message); // Debug
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
            console.log('Submitting reset password with:', { email, token, password }); // Debug
            const response = await resetPassword(email, token, password, passwordConfirmation);
            console.log('Reset password response:', response.data); // Debug
            setMessage(response.data.message);
            setError('');
        } catch (error) {
            console.error('Error resetting password:', error.message); // Debug
            setError(error.message || 'Đã có lỗi xảy ra khi đặt lại mật khẩu');
            setMessage('');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
                <div style={{ border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (!token) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
                <div style={{ backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '16px', borderRadius: '4px' }}>
                    <p>{error || 'Link không hợp lệ'}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to right, #e0f7fa, #b3e5fc)' }}>
            <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#1f2937' }}>
                    Đặt lại mật khẩu
                </h2>
                <p style={{ textAlign: 'center', marginBottom: '24px', color: '#6b7280' }}>
                    Đặt lại mật khẩu cho: <strong>{email}</strong>
                </p>
                {message && (
                    <div style={{ marginBottom: '16px', backgroundColor: '#d1fae5', borderLeft: '4px solid #10b981', color: '#065f46', padding: '16px', borderRadius: '4px' }}>
                        {message}
                    </div>
                )}
                {error && (
                    <div style={{ marginBottom: '16px', backgroundColor: '#fee2e2', borderLeft: '4px solid #ef4444', color: '#b91c1c', padding: '16px', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }} htmlFor="password">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '8px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                            placeholder="Nhập mật khẩu mới"
                        />
                    </div>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', color: '#374151', fontWeight: '600', marginBottom: '8px' }} htmlFor="passwordConfirmation">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            id="passwordConfirmation"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '8px 16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
                            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                            placeholder="Xác nhận mật khẩu"
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            padding: '12px',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
                        onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
                    >
                        Đặt lại mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;