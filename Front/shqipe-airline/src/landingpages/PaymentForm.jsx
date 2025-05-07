import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = () => {
  const [selectedMethod, setSelectedMethod] = useState('credit');
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    cvv: '',
  });
  const [isValid, setIsValid] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedMethod === 'credit' && validateCardForm()) {
      alert(`Payment confirmed using ${selectedMethod}!`);
      setFormData({
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
    } else if (selectedMethod !== 'credit') {
      alert(`Payment confirmed using ${selectedMethod}!`);
      setFormData({
        ...formData,
      });
    }
  };

  const validateCardForm = () => {
    let isValid = true;
    let newErrors = {};

    const cardNumberPattern = /^[0-9]{13,19}$/;
    if (!cardNumberPattern.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be between 13 and 19 digits';
      alert('Card number must be between 13 and 19 digits');
      isValid = false;
    }

    if (formData.expirationMonth < 1 || formData.expirationMonth > 12) {
      newErrors.expirationMonth = 'Expiration month must be between 1 and 12';
      alert('Expiration month must be between 1 and 12');
      isValid = false;
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (formData.expirationYear < currentYear || 
        (formData.expirationYear === currentYear && formData.expirationMonth < currentMonth)) {
      newErrors.expirationYear = 'Card is expired';
      alert('Card is expired');
      isValid = false;
    }

    if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
      alert('CVV must be 3 digits');
      isValid = false;
    }

    setErrors(newErrors);
    setIsValid(isValid);
    return isValid;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      // Remove all non-digit characters, then add spaces after every four digits
      const formattedCardNumber = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedCardNumber,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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
              <input
                type="text"
                name="cardOwner"
                value={formData.cardOwner}
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
                value={formData.cardNumber}
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
                    value={formData.expirationMonth}
                    onChange={handleInputChange}
                    placeholder="MM"
                    required
                  />
                  <input
                    type="text"
                    name="expirationYear"
                    value={formData.expirationYear}
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
                  value={formData.cvv}
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
                value={formData.paypalEmail}
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
                value={formData.paypalPassword}
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
                value={formData.netbankingBank}
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
                value={formData.netbankingUsername}
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
                value={formData.netbankingPassword}
                onChange={handleInputChange}
                placeholder="Net banking password"
                required
              />
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

