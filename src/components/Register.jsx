// import { useState } from 'react';
// import axios from 'axios';

// const Register = () => {
//     const [role, setRole] = useState('');
//     const userData = JSON.parse(localStorage.getItem('user_data')); // Lấy user_data từ localStorage

//     const handleRoleSelection = async () => {
//         if (!role) {
//         alert('Vui lòng chọn vai trò!');
//         return;
//         }

//         try {
//         const response = await axios.post('http://localhost:8000/api/select-role', {
//             role,
//             user_data: userData,
//         });

//         localStorage.setItem('token', response.data.token);
//         localStorage.setItem('user', JSON.stringify(response.data.user));
//         localStorage.removeItem('user_data'); // Xóa user_data sau khi chọn vai trò
//         window.location.href = '/dashboard';
//         } catch (error) {
//         console.error('Error selecting role:', error);
//         alert('Có lỗi khi chọn vai trò: ' + error.message);
//         }
//     };

//     if (!userData) {
//         return <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</div>;
//     }

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h2>Chọn vai trò</h2>
//             <p>Xin chào, {userData.name} ({userData.email})</p>
//             <div>
//                 <label htmlFor="role">Vai trò: </label>
//                 <select
//                 id="role"
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 style={{ padding: '5px', margin: '10px' }}
//                 >
//                 <option value="">Chọn vai trò</option>
//                 <option value="student">Student</option>
//                 <option value="teacher">Teacher</option>
//                 </select>
//             </div>
//             <button
//                 onClick={handleRoleSelection}
//                 style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#4CAF50',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//                 }}
//             >
//                 Xác nhận
//             </button>
//         </div>
//     );
// };

// export default Register;

import { useState } from 'react';
import axios from 'axios';

const Register = ({ backend }) => {
  const [role, setRole] = useState('');
  const userData = JSON.parse(localStorage.getItem('user_data'));

  const handleRoleSelection = async () => {
    if (!role) {
      alert('Vui lòng chọn vai trò!');
      return;
    }

    try {
      const backendUrl = backend === 'php' ? 'http://localhost:8000' : 'http://localhost:3000';
      const response = await axios.post(`${backendUrl}/api/select-role`, {
        role,
        user_data: userData,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.removeItem('user_data');
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error selecting role:', error);
      alert('Có lỗi khi chọn vai trò: ' + error.message);
    }
  };

  if (!userData) {
    return <div>Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.</div>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Chọn vai trò</h2>
      <p>Xin chào, {userData.name} ({userData.email})</p>
      <div>
        <label htmlFor="role">Vai trò: </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '5px', margin: '10px' }}
        >
          <option value="">Chọn vai trò</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <button
        onClick={handleRoleSelection}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Xác nhận
      </button>
    </div>
  );
};

export default Register;