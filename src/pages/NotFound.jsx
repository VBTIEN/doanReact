import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Không tìm thấy trang</h1>
      <p>Trang bạn tìm không tồn tại hoặc đã bị xóa.</p>
      <Link to="/">Quay về trang chủ</Link>
    </div>
  );
};

export default NotFound;
