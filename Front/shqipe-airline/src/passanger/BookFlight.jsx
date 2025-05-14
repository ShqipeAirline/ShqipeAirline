import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookFlight.css';
import api from '../api/axios';
import useUserStore from '../store/userStore';

const BookFlight = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;
  const { user } = useUserStore();

  const [formData, setFormData] = useState({
    class: 'Economy',
    optional: '',
    seat_number: '',
    extra_baggage: 0,
    travel_insurance: false
  });

  const [priceBreakdown, setPriceBreakdown] = useState({
    basePrice: 0,
    classUpgrade: 0,
    extraBaggage: 0,
    travelInsurance: 0,
    optionalServices: 0,
    total: 0
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (flight) {
      calculatePriceBreakdown();
    }
  }, [formData, flight]);

  const calculatePriceBreakdown = () => {
    const basePrice = parseFloat(flight.base_price);
    let classUpgrade = 0;
    let optionalServices = 0;

    // Calculate class upgrade cost
    switch (formData.class) {
      case 'Business':
        classUpgrade = basePrice * 0.5; // 50% more than economy
        break;
      case 'First':
        classUpgrade = basePrice; // 100% more than economy
        break;
      default:
        break;
    }

    // Calculate extra baggage cost
    const extraBaggage = formData.extra_baggage * 10; // $10 per kg

    // Calculate travel insurance cost
    const travelInsurance = formData.travel_insurance ? 50 : 0;

    // Calculate optional services cost
    if (formData.optional) {
      if (formData.optional.includes('Meals')) optionalServices += 30;
      if (formData.optional.includes('Baggage')) optionalServices += 40;
    }

    const total = basePrice + classUpgrade + extraBaggage + travelInsurance + optionalServices;

    setPriceBreakdown({
      basePrice,
      classUpgrade,
      extraBaggage,
      travelInsurance,
      optionalServices,
      total
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookingData = {
        flight_id: flight.flight_id,
        seat_number: formData.seat_number,
        extra_baggage: formData.extra_baggage > 0 ? 1 : 0,
        travel_insurance: formData.travel_insurance ? 1 : 0,
        booking_status: 'pending',
        total_price: priceBreakdown.total.toString()
      };

      const response = await api.post(`/user/${user.user_id}/bookings`, bookingData);
      
      if (response.data) {
        navigate('/passenger-dashboard/passanger-payment', { 
          state: { 
            flight, 
            formData,
            booking: response.data,
            priceBreakdown 
          } 
        });
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!flight) {
    return <div>No flight selected</div>;
  }

  // Format the departure date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="booking-outer">
      <div className="booking-card">
        <h1 className="booking-title">Book Ticket</h1>
        {error && <div className="booking-error">{error}</div>}
        <form onSubmit={handleSubmit} className="booking-form-modern">
          <div className="booking-columns">
            <div className="booking-col">
              <label className="booking-label">Select Airline</label>
              <input type="text" value={flight.airline} disabled className="booking-input" />
              <label className="booking-label">From</label>
              <div className="location-info">
                <input type="text" value={`${flight.departure_airport}, ${flight.departure_country}`} disabled className="booking-input" />
              </div>
              <label className="booking-label">Date of Journey</label>
              <input type="text" value={formatDate(flight.departure_date)} disabled className="booking-input" />
              <label className="booking-label">Departure Time</label>
              <input type="text" value={flight.departure_time} disabled className="booking-input" />
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
              <label className="booking-label">Flight Number</label>
              <input type="text" value={flight.flight_number} disabled className="booking-input" />
              <label className="booking-label">To</label>
              <div className="location-info">
                <input type="text" value={`${flight.arrival_airport}, ${flight.arrival_country}`} disabled className="booking-input" />
              </div>
              <label className="booking-label">Arrival Time</label>
              <input type="text" value={flight.arrival_time} disabled className="booking-input" />
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

          <div className="price-summary">
            <h3>Price Summary</h3>
            <div className="price-details">
              <div className="price-row">
                <span>Base Price (Economy)</span>
                <span>${priceBreakdown.basePrice.toFixed(2)}</span>
              </div>
              {priceBreakdown.classUpgrade > 0 && (
                <div className="price-row">
                  <span>Class Upgrade ({formData.class})</span>
                  <span>+${priceBreakdown.classUpgrade.toFixed(2)}</span>
                </div>
              )}
              {priceBreakdown.extraBaggage > 0 && (
                <div className="price-row">
                  <span>Extra Baggage ({formData.extra_baggage}kg)</span>
                  <span>+${priceBreakdown.extraBaggage.toFixed(2)}</span>
                </div>
              )}
              {priceBreakdown.travelInsurance > 0 && (
                <div className="price-row">
                  <span>Travel Insurance</span>
                  <span>+${priceBreakdown.travelInsurance.toFixed(2)}</span>
                </div>
              )}
              {priceBreakdown.optionalServices > 0 && (
                <div className="price-row">
                  <span>Optional Services</span>
                  <span>+${priceBreakdown.optionalServices.toFixed(2)}</span>
                </div>
              )}
              <div className="price-row total">
                <span>Total Price</span>
                <span>${priceBreakdown.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="booking-submit"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking & Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookFlight; 
