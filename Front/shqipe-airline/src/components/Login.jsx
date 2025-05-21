import '../App.css';
import { Box } from '@mui/material';
import TxtField from './forms/TxtField';
import PassField from './forms/PassField';
import Bttn from './forms/Bttn';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useUserStore from '../store/userStore';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useUserStore(state => state.login);

  const handleLogin = async () => {
    const payload = {
      email,
      password,
    };

    try {
      console.log('Sending login request with payload:', payload);
      
      const { data } = await api.post("/login", payload);
      console.log('Login response:', data);

      // Decode the JWT token to get user data
      try {
        const tokenPayload = JSON.parse(atob(data.access_token.split('.')[1]));
        console.log('Token payload:', tokenPayload);

        // Create user data object from the token payload
        const userData = {
          firstName: tokenPayload.first_name || '',
          lastName: tokenPayload.last_name || '',
          email: tokenPayload.email || email,
          role: tokenPayload.role,
          user_id: tokenPayload.user_id
        };
        
        console.log('Processed user data:', userData);
        
        if (!userData.role) {
          console.error('Missing role in token payload:', tokenPayload);
          setError('Invalid response from server: missing role');
          return;
        }

        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.access_token);
        if (data.refresh_token) {
          localStorage.setItem('refreshToken', data.refresh_token);
        }
        
        // Login using Zustand store
        login(userData, data.access_token, data.refresh_token);
        
        // Redirect based on role
        switch (userData.role) {
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
            console.log('Invalid role:', userData.role);
            setError('Invalid user role');
            break;
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Error processing login response');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred during login');
      }
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
