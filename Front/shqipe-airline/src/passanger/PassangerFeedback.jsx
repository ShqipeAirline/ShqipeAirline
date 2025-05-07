import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PassangerFeedback.css';

const FeedbackForm = () => {
    const [name, setName] = useState("");
    const [feedback, setFeedback] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      alert(`Thank you, ${name}, for your feedback!`);
      setName("");
      setFeedback("");
    };
  
    return (
      <div className="feedback-container">
        <h2>Feedback</h2>
        <form className="feedback-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name Surname</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
  
          <label htmlFor="feedback">Feedback</label>
          <textarea
            id="feedback"
            rows="6"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
  
          <button type="submit">Confirm</button>
        </form>
      </div>
    );
  };
  
  export default FeedbackForm;
