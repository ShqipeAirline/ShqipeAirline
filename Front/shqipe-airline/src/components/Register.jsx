import '../App.css';
import { Box } from '@mui/material';
import TxtField from './forms/TxtField';
import PassField from './forms/PassField';
import Bttn from './forms/Bttn';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  // State for each required field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Build the payload exactly as expected by the backend
    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      date_of_birth: formatDate(dateOfBirth)
    };

    console.log('Sending registration payload:', payload);

    try {
      const response = await api.post('/register', payload);
      console.log('Registration response:', response.data);
      setSuccess('Registration successful! Please log in.');
      // Clear form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setDateOfBirth('');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="signup">
      <Box className="whiteBox-signup">
        <Box className="itemBox1">
          <img
            src="src/images/airplane.png"
            alt="airplane"
            width="200px"
            height="200px"
            style={{ paddingLeft: '70px', paddingRight: '0px' }}
          />
          <h1 style={{ fontSize: '28px', whiteSpace: 'nowrap' }}>Register Form</h1>
        </Box>

        <Box className="itemBox-2">
          <p>Create an account to enjoy our services!</p>
        </Box>

        <Box className="itemBox-3">
          <TxtField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TxtField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </Box>

        <Box className="itemBox">
          <TxtField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>

        <Box className="itemBox">
          <PassField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>

        <Box className="itemBox">
          <TxtField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </Box>

        <Box className="itemBox">
          <div style={{ width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#666' }}>Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
            />
          </div>
        </Box>

        {error && (
          <Box className="itemBox">
            <p style={{ color: 'red' }}>{error}</p>
          </Box>
        )}

        {success && (
          <Box className="itemBox">
            <p style={{ color: 'green' }}>{success}</p>
          </Box>
        )}

        <Box className="itemBox">
          <Bttn label="Submit" onClick={handleSubmit} />
        </Box>

        <Box className="itemBox">
          <Link to="/login" className="register-link">
            Already have an account? LOG IN
          </Link>
        </Box>
      </Box>
    </div>
  );
};

export default Register;
