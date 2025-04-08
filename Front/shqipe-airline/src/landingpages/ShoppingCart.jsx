import React, { useState } from 'react';
import './ShoppingCart.css'; 
import { useNavigate } from 'react-router-dom'; 


const initialCart = [
  { name: 'Black T-Shirt', price: 20, quantity: 1 },
  { name: 'Red T-Shirt', price: 20, quantity: 1 },
  { name: 'Black Cap', price: 15, quantity: 1 },
  { name: 'Alban Mascot', price: 25, quantity: 1 },
  { name: 'Lays Oregano', price: 1.5, quantity: 1 },
  { name: 'Coca Cola', price: 2.5, quantity: 1 },
  { name: 'Pringles Original', price: 3.5, quantity: 1 },
  { name: 'Water', price: 1, quantity: 1 }
];

const Shoppingcart = () => {
  const [cart, setCart] = useState(initialCart);
  const navigate = useNavigate();

  const updateQuantity = (index, qty) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity = Number(qty);
    setCart(updatedCart);
  };

  const removeItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate('/payment'); 
  };

  return (
    <div className="shopping-cart-container">

      <div className="order-header">
        <span>Your Order</span>
        <span>Quantity</span>
        <span>Total</span>
      </div>
      <div className="cart-items">
        {cart.map((item, index) => (
          <div className="cart-item" key={index}>
            <span>{item.name}</span>
            <div className="item-controls">
              <select
                value={item.quantity}
                onChange={(e) => updateQuantity(index, e.target.value)}
              >
                {[1, 2, 3, 4, 5].map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              <button className="remove-btn" onClick={() => removeItem(index)}>Remove</button>
            </div>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="subtotal-checkout">
  <span className="subtotal">Subtotal: ${subtotal}</span>
  <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
</div>
    </div>
  );
};

export default Shoppingcart;
