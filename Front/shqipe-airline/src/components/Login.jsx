import '../App.css';
import { Box } from '@mui/material';
import TxtField from './forms/TxtField';
import PassField from './forms/PassField';
import Bttn from './forms/Bttn';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { setTokens, getUserRole } from '../utils/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
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
  
      // Store tokens
      setTokens(data.access_token, data.refresh_token);
      
      // Get user role and redirect accordingly
      const role = getUserRole();
      
      switch (role) {
        case 'user':
          navigate('/passenger-dashboard');
          break;
        case 'admin':
          navigate('/admin-dashboard');
          break;
        case 'air control staff':
          navigate('/acd-dashboard');
          break;
        default:
          setError('Invalid user role');
          break;
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
