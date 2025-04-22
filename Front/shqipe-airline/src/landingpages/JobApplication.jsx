import React from 'react';
import './JobApplication.css';
import Pilot from './../images/pilot.png';
import flightattendant from './../images/flightattendant.png';
import CoPilot from './../images/Co-pilot.png'; 
import { useNavigate } from 'react-router-dom';

const JobApplication = () => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate('/job-application-form');
  };

  return (
    <div className="hiring-section">
      <div className="hiring-title">We Are Hiring!</div>

      <div className="job-cards">
        <div className="job-card">
          <img 
            src={Pilot} 
            alt="Pilot" 
            className="job-image" 
          />
          <div className="job-title">Pilot</div>
          <div className="job-type">Full-time</div>
          <button className="apply-button" onClick={handleApplyNow}>Apply Now</button>
        </div>

        <div className="job-card">
          <img 
            src={flightattendant} 
            alt="Flight Attendant" 
            className="job-image" 
          />
          <div className="job-title">Flight Attendant</div>
          <div className="job-type">Part-time</div>
          <button className="apply-button" onClick={handleApplyNow}>Apply Now</button>
        </div>

        <div className="job-card">
          <img 
            src={CoPilot} 
            alt="Co-pilot" 
            className="job-image" 
          />
          <div className="job-title">Co-Pilot</div>
          <div className="job-type">Full-time</div>
          <button className="apply-button" onClick={handleApplyNow}>Apply Now</button>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
