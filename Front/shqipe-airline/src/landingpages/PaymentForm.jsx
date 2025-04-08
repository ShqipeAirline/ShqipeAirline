import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = () => {
  const [selectedMethod, setSelectedMethod] = useState('credit');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Payment confirmed using ${selectedMethod}!`);
  };


  return (
    <div className="payment-container">
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
              <input type="text" placeholder="Card Owner Name" required />
            </div>
            <div className="form-group">
              <label>Card Number</label>
              <input type="text" placeholder="Valid card number" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expiration Date</label>
                <div className="form-row">
                  <input type="text" placeholder="MM" required />
                  <input type="text" placeholder="YY" required />
                </div>
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="CVV" required />
              </div>
            </div>
          </>
        )}

        {selectedMethod === 'paypal' && (
          <>
            <div className="form-group">
              <label>PayPal Email</label>
              <input type="email" placeholder="your-email@paypal.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter PayPal password" required />
            </div>
          </>
        )}

        {selectedMethod === 'netbanking' && (
          <>
            <div className="form-group">
              <label>Select Bank</label>
              <select required>
                <option value="">--Select a Bank--</option>
                <option value="hdfc">Raiffeisen Bank</option>
                <option value="sbi">State Bank of Albania</option>
                <option value="icici">Credins Bank</option>
                <option value="axis">IntesaSanpaolo Bank</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Net banking username" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Net banking password" required />
            </div>
          </>
        )}
        
        <button type="submit" className="confirm-btn">
          Confirm Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
