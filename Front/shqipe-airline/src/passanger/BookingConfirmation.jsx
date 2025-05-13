import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { flight, formData } = location.state || {};

  if (!flight || !formData) {
    return <div>No booking data available.</div>;
  }

  const handlePayment = () => {
    navigate('/passenger-dashboard/passanger-payment', { state: { flight, formData } });
  };

  return (
    <div className="booking-confirmation">
      <h1>Booking Confirmation</h1>
      <p>Your booking is confirmed. Please check the details below:</p>

      <div className="booking-confirmation-details">
        <h3>Booking Details</h3>
        <p><strong>Flight:</strong> {flight.airline} from {flight.departure_airport} to {flight.arrival_airport}</p>
        <p><strong>Flight Number:</strong> {flight.flight_number}</p>
        <p><strong>Class:</strong> {formData.class}</p>
        <p><strong>Seat Number:</strong> {formData.seat_number}</p>
        <p><strong>Extra Baggage:</strong> {formData.extra_baggage} kg</p>
        <p><strong>Travel Insurance:</strong> {formData.travel_insurance ? 'Yes' : 'No'}</p>
        <p><strong>Optional:</strong> {formData.optional || 'None'}</p>
      </div>

      <button className="booking-confirmation-submit" onClick={handlePayment}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default BookingConfirmation;
