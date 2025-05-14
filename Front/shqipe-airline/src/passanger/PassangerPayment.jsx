import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PassangerPayment.css';
import api from '../api/axios';
import useUserStore from '../store/userStore';

const PassengerPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { booking, flight, priceBreakdown } = location.state || {};

  const [selectedMethod, setSelectedMethod] = useState('credit');
  const [paymentFormData, setPaymentFormData] = useState({
    cardOwner: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
    paypalEmail: '',
    paypalPassword: '',
    netbankingBank: '',
    netbankingUsername: '',
    netbankingPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (selectedMethod === 'credit' && !validateCardForm()) {
        return;
      }

      // First, create a payment method
      const paymentMethodData = {
        user_id: user.user_id,
        payment_type: selectedMethod,
        payment_token: 'dummy_token', // In a real app, this would be a secure token from a payment processor
        card_last_four: paymentFormData.cardNumber.slice(-4),
        card_brand: 'Visa', // This would be determined by the card number in a real app
        expiration_month: parseInt(paymentFormData.expirationMonth),
        expiration_year: parseInt(paymentFormData.expirationYear),
        is_default: 1
      };

      const paymentMethodResponse = await api.post(`/user/${user.user_id}/payment_methods`, paymentMethodData);

      // Then create the transaction
      const transactionData = {
        booking_id: booking.bookings_id,
        amount: priceBreakdown.total.toString(),
        transaction_status: 'pending',
        payment_method_id: paymentMethodResponse.data.payment_method_id
      };

      await api.post(`/user/${user.user_id}/payment_methods/${paymentMethodResponse.data.payment_method_id}/transactions`, transactionData);

      // Update booking status to pending
      await api.put(`/user/${user.user_id}/bookings/${booking.bookings_id}`, {
        flight_id: booking.flight_id,
        seat_number: booking.seat_number,
        extra_baggage: booking.extra_baggage,
        travel_insurance: booking.travel_insurance,
        total_price: booking.total_price,
        booking_status: 'pending'
      });

      navigate('/passenger-dashboard', { 
        state: { 
          message: 'Payment submitted! Your booking is pending confirmation.',
          type: 'info'
        }
      });
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.message || 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateCardForm = () => {
    let isValid = true;

    const cardNumberPattern = /^[0-9]{13,19}$/;
    if (!cardNumberPattern.test(paymentFormData.cardNumber.replace(/\s/g, ''))) {
      alert('Card number must be between 13 and 19 digits');
      isValid = false;
    }

    if (paymentFormData.expirationMonth < 1 || paymentFormData.expirationMonth > 12) {
      alert('Expiration month must be between 1 and 12');
      isValid = false;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (paymentFormData.expirationYear < currentYear || 
        (paymentFormData.expirationYear === currentYear && paymentFormData.expirationMonth < currentMonth)) {
      alert('Card is expired');
      isValid = false;
    }

    if (paymentFormData.cvv.length !== 3) {
      alert('CVV must be 3 digits');
      isValid = false;
    }

    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      // Remove all non-digit characters, then add spaces after every four digits
      const formattedCardNumber = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      setPaymentFormData((prevData) => ({
        ...prevData,
        [name]: formattedCardNumber,
      }));
    } else {
      setPaymentFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment Details</h2>
      {error && <div className="payment-error">{error}</div>}
      <div className="payment-summary">
        <h3>Payment Summary</h3>
        <p><strong>Flight:</strong> {flight.airline} from {flight.departure_airport} to {flight.arrival_airport}</p>
        <p><strong>Total Amount:</strong> ${priceBreakdown.total.toFixed(2)}</p>
      </div>
      <div className="payment-tabs">
        <button
          className={`tab ${selectedMethod === 'credit' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('credit')}
        >
          Credit Card
        </button>
        <button
          className={`tab ${selectedMethod === 'paypal' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('paypal')}
        >
          PayPal
        </button>
        <button
          className={`tab ${selectedMethod === 'netbanking' ? 'active' : ''}`}
          onClick={() => setSelectedMethod('netbanking')}
        >
          Net Banking
        </button>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
        {selectedMethod === 'credit' && (
          <>
            <div className="form-group">
              <label>Card Owner</label>
              <input
                type="text"
                name="cardOwner"
                value={paymentFormData.cardOwner}
                onChange={handleInputChange}
                placeholder="Card Owner Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentFormData.cardNumber}
                onChange={handleInputChange}
                placeholder="Valid card number"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiration Date</label>
                <div className="form-row">
                  <input
                    type="text"
                    name="expirationMonth"
                    value={paymentFormData.expirationMonth}
                    onChange={handleInputChange}
                    placeholder="MM"
                    required
                  />
                  <input
                    type="text"
                    name="expirationYear"
                    value={paymentFormData.expirationYear}
                    onChange={handleInputChange}
                    placeholder="YY"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentFormData.cvv}
                  onChange={handleInputChange}
                  placeholder="CVV"
                  required
                />
              </div>
            </div>
          </>
        )}

        {selectedMethod === 'paypal' && (
          <>
            <div className="form-group">
              <label>PayPal Email</label>
              <input
                type="email"
                name="paypalEmail"
                value={paymentFormData.paypalEmail}
                onChange={handleInputChange}
                placeholder="your-email@paypal.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="paypalPassword"
                value={paymentFormData.paypalPassword}
                onChange={handleInputChange}
                placeholder="Enter PayPal password"
                required
              />
            </div>
          </>
        )}

        {selectedMethod === 'netbanking' && (
          <>
            <div className="form-group">
              <label>Select Bank</label>
              <select
                name="netbankingBank"
                value={paymentFormData.netbankingBank}
                onChange={handleInputChange}
                required
              >
                <option value="">--Select a Bank--</option>
                <option value="hdfc">Raiffeisen Bank</option>
                <option value="sbi">State Bank of Albania</option>
                <option value="icici">Credins Bank</option>
                <option value="axis">IntesaSanpaolo Bank</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="netbankingUsername"
                value={paymentFormData.netbankingUsername}
                onChange={handleInputChange}
                placeholder="Net banking username"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="netbankingPassword"
                value={paymentFormData.netbankingPassword}
                onChange={handleInputChange}
                placeholder="Net banking password"
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="confirm-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Payment'}
        </button>
      </form>
    </div>
  );
};

export default PassengerPayment;
