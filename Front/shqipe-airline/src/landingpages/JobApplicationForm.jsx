import React, { useState, useRef } from 'react';
import './JobApplicationForm.css';

const JobApplicationForm = () => {
  const initialFormData = {
    firstName: '',
    lastName: '',
    contactNumber: '',
    email: '',
    position: 'Pilot',
    additionalInfo: '',
    cv: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setFormData({ ...formData, cv: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const { firstName, lastName, contactNumber, email, cv } = formData;
  
  
    if (!firstName || !lastName || !contactNumber || !email || !cv) {
      alert('Please fill in all required fields and upload your CV.');
      return;
    }
  
    console.log('Form submitted:', formData);
    alert('Your application has been submitted successfully!');
  
    setFormData(initialFormData);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Job Application Form</h2>

      <form className="job-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" onChange={handleChange} value={formData.lastName} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Contact Number</label>
            <input type="text" name="contactNumber" onChange={handleChange} value={formData.contactNumber} />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" name="email" onChange={handleChange} value={formData.email} />
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
          <div className="form-group">
            <label>Upload Your CV</label>
            <input type="file" name="cv" onChange={handleChange} ref={fileInputRef} />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Additional Information</label>
          <textarea name="additionalInfo" onChange={handleChange} value={formData.additionalInfo}></textarea>
        </div>

        <button type="submit" className="confirm-button">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default JobApplicationForm;

