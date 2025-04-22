import '../App.css';
import { Box } from '@mui/material';
import TxtField from './forms/TxtField';
import PassField from './forms/PassField';
import Bttn from './forms/Bttn';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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

      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      navigate('/');
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
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
