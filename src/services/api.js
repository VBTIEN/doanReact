import axios from 'axios';

// Biến lưu port hiện tại (mặc định là null)
let currentPort = null;

// Hàm xác định port dựa trên phản hồi từ backend
const determinePort = async () => {
    const ports = [3000, 8000]; // Danh sách các port cần kiểm tra
    const baseUrlPrefix = 'http://localhost';
    let portFound = false;

    for (const port of ports) {
        try {
            const response = await axios.get(`${baseUrlPrefix}:${port}/api/status`, {
                timeout: 1000, // Timeout 5 giây
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (response.data.status === 'ok') {
                currentPort = port;
                console.log('Selected port:', currentPort);
                portFound = true;
                return currentPort; // Thoát ngay khi tìm thấy port hợp lệ
            }
        } catch (error) {
            console.log(`Failed to reach port ${port}:`, error.message);
        }
    }

    // Nếu không tìm thấy port nào, ném lỗi thay vì mặc định 3000
    if (!portFound) {
        throw new Error('No backend responded at ports 3000 or 8000. Please ensure at least one backend is running.');
    }
};

// Khởi tạo port ngay khi module load và chờ hoàn thành
let portInitialized = false;
const initializePort = async () => {
    if (!portInitialized) {
        await determinePort();
        portInitialized = true;
    }
};

// Tạo instance axios với baseURL động dựa trên currentPort
const createApiInstance = async () => {
    // Đảm bảo port được xác định trước khi tạo instance
    await initializePort();

    const api = axios.create({
        baseURL: `http://localhost:${currentPort}/api`,
        headers: {
            'Content-Type': 'application/json',
        },
        withCredentials: true, // Hỗ trợ credentials
    });

    // Interceptor để kiểm tra và cập nhật baseURL trước mỗi request
    api.interceptors.request.use((config) => {
        if (!currentPort) {
            throw new Error('Port not initialized. Please ensure backend is running.');
        }
        config.baseURL = `http://localhost:${currentPort}/api`;
        console.log('Sending request to:', config.baseURL + config.url); // Debug
        return config;
    }, (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    });

    return api;
};

// Khởi tạo instance api
const apiPromise = createApiInstance();

// API validate token
export const validateToken = async (email) => {
    const api = await apiPromise; // Chờ instance được tạo
    console.log('Validating token for email:', email);
    return api.get(`/password/validate-token?email=${encodeURIComponent(email)}`); // Email trong URL
};

// API reset password
export const resetPassword = async (email, token, password, passwordConfirmation) => {
    const api = await apiPromise; // Chờ instance được tạo
    console.log('Resetting password for:', email);
    return api.post(
        `/password/reset?email=${encodeURIComponent(email)}`, // Đưa email vào query parameter
        { 
            password, 
            password_confirmation: passwordConfirmation,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};