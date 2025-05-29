import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import './JobApplicationForm.css';

const JobApplicationForm = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    position: 'Pilot',
    additionalInfo: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, contactNumber, email } = formData;

    if (!firstName || !lastName || !contactNumber || !email) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const templateParams = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        contact_number: formData.contactNumber,
        email: formData.email,
        position: formData.position,
        additional_info: formData.additionalInfo,
      };

      await emailjs.send(
        'service_4hpm5vf',         // ✅ Your EmailJS Service ID
        'template_vlp78xh',        // ✅ Your Template ID
        templateParams,
        'zLMpr5EtZYvsER6Rr'        // ✅ Your Public Key
      );

      alert('Your application has been submitted successfully!');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Try again later.');
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Job Application Form</h2>

      <form className="job-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              onChange={handleChange}
              value={formData.contactNumber}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Select Position</label>
            <select name="position" onChange={handleChange} value={formData.position}>
              <option value="Pilot">Pilot</option>
              <option value="Co-Pilot">Co-Pilot</option>
              <option value="Flight Attendant">Flight Attendant</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Additional Information</label>
          <textarea
            name="additionalInfo"
            onChange={handleChange}
            value={formData.additionalInfo}
          ></textarea>
        </div>

        <button type="submit" className="confirm-button">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;