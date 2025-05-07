import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookFlight.css';

const BookFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  const [formData, setFormData] = useState({
    class: 'Economy',
    optional: '',
    seat_number: '',
    extra_baggage: 0,
    travel_insurance: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    if (!flight || !formData) {
      console.log('Missing flight or formData');
      return;
    }
    navigate('/passenger-dashboard/booking-confirmation', { state: { flight, formData } });

  };

  if (!flight) {
    return <div>No flight selected</div>;
  }

  return (
    <div className="booking-outer">
      <div className="booking-card">
        <h1 className="booking-title">Book Ticket</h1>
        <form onSubmit={handleSubmit} className="booking-form-modern">
          <div className="booking-columns">
            <div className="booking-col">
              <label className="booking-label">Select Airline</label>
              <input type="text" value={flight.airline} disabled className="booking-input" />
              <label className="booking-label">From</label>
              <input type="text" value={flight.departurePlace} disabled className="booking-input" />
              <label className="booking-label">Date of Journey</label>
              <input type="text" value={flight.date} disabled className="booking-input" />
              <label className="booking-label">Select Class</label>
              <select name="class" value={formData.class} onChange={handleChange} className="booking-input">
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="First">First</option>
              </select>
              <label className="booking-label">Seat Number</label>
              <input type="text" name="seat_number" value={formData.seat_number} onChange={handleChange} className="booking-input" required />
              <label className="booking-label">Extra Baggage (kg)</label>
              <input type="number" name="extra_baggage" min="0" value={formData.extra_baggage} onChange={handleChange} className="booking-input" />
            </div>
            <div className="booking-col">
              <label className="booking-label">Choose Flight Type</label>
              <input type="text" value={flight.type || 'International'} disabled className="booking-input" />
              <label className="booking-label">To</label>
              <input type="text" value={flight.arrivalPlace} disabled className="booking-input" />
              <label className="booking-label">Optional: Meals, Baggage <span className="booking-label-hint">(Extra Fee Details)</span></label>
              <select name="optional" value={formData.optional} onChange={handleChange} className="booking-input">
                <option value="">None</option>
                <option value="Meals">Meals</option>
                <option value="Baggage">Baggage</option>
                <option value="Meals+Baggage">Meals + Baggage</option>
              </select>
              <label className="booking-label">Travel Insurance</label>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem'}}>
                <input type="checkbox" name="travel_insurance" checked={formData.travel_insurance} onChange={handleChange} />
                <span style={{fontSize: '0.98rem', color: '#6c6c6c'}}>Add travel insurance</span>
              </div>
            </div>
          </div>
          <button type="submit" className="booking-submit">Confirm Booking & Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default BookFlight; 
