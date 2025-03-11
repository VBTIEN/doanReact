import { Routes, Route } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword';

function App() {
    return (
        <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <Routes>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<div style={{ textAlign: 'center', paddingTop: '50px', fontSize: '24px', color: '#333' }}>Welcome to ScoreManagementReact</div>} />
            </Routes>
        </div>
    );
}

export default App;