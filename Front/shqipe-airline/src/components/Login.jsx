import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TxtField from './forms/TxtField';
import PassField from './forms/PassField';
import Bttn from './forms/Bttn';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      email,
      password,
    };
  
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      setTokens({
        access_token: data.access_token,
        refresh_token: data.refresh_token
      });

      const userData = {
        email,
        role: data.role,
        lastLogin: new Date().toISOString(),
      };
      setUser(userData);

      switch(data.role) {
        case 'air control staff':
          navigate('/acd-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'user':
          navigate('/user-dashboard');
          break;
        default:
          navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    }
  };

  return (
    <div className="login-back">
      <Box className="whiteBox">
        <Box className="itemBox1">
          <img src="src/images/airplane.png" alt="airplane" width="200px" height="200px" />
          <h1>LOGIN</h1>
        </Box>

        <Box className="itemBox-2">
          <p>Please enter your email and password!</p>
        </Box>

        <Box className="itemBox">
          <TxtField 
            label="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </Box>

        <Box className="itemBox">
          <PassField 
            label="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </Box>

        {error && (
          <Box className="itemBox">
            <p style={{ color: 'red' }}>{error}</p>
          </Box>
        )}

        <Box className="itemBox">
          <Bttn label="Login" onClick={handleLogin} />
        </Box>

        <Box className="itemBox">
          <Link to="/register" className="register-link">
            Don't have an account? Sign UP
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
