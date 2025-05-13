import '../App.css';
import { Box } from '@mui/material';
import TxtField from './forms/TxtField';
import PassField from './forms/PassField';
import Bttn from './forms/Bttn';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';

const Register = () => {
  // State for each required field
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log("Submit clicked!"); // Debug log
    // Build the payload exactly as expected by your backend
    const payload = {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      emergency_contact_phone: emergencyContactPhone,
    };

    try {
      await api.post('/register', payload);
      setSuccess('Registration successful! Please log in.');
      // Optionally, clear the fields or redirect the user
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
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
          />
          <TxtField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
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

        <Box className="itemBox">
          <TxtField
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Box>

        <Box className="itemBox">
          <TxtField
            label="Emergency Contact Phone"
            value={emergencyContactPhone}
            onChange={(e) => setEmergencyContactPhone(e.target.value)}
          />
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
