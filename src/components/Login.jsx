// const Login = () => {
//     const handleGoogleLogin = () => {
//         window.location.href = 'http://localhost:8000/api/auth/google';
//     };

//     return (
//         <div style={{ textAlign: 'center', marginTop: '50px' }}>
//             <h2>Đăng nhập</h2>
//             <button
//             onClick={handleGoogleLogin}
//             style={{
//                 padding: '10px 20px',
//                 backgroundColor: '#4285F4',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//             }}
//             >
//             Đăng nhập với Google
//             </button>
//         </div>
//     );
// };

// export default Login;

const Login = ({ backend }) => {
    const handleGoogleLogin = () => {
      const backendUrl = backend === 'php' ? 'http://localhost:8000' : 'http://localhost:3000';
      window.location.href = `${backendUrl}/api/auth/google`;
    };
  
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Đăng nhập</h2>
        <button
          onClick={handleGoogleLogin}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285F4',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Đăng nhập với Google
        </button>
      </div>
    );
  };
  
  export default Login;