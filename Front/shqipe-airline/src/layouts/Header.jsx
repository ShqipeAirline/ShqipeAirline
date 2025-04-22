import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './Header.css';
import logo from './../images/logo.png';
import backgroundImage from './../images/map.png';  
import airplane from './../images/airplane-main.png';  

const Header = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const renderHeaderText = () => {
    switch (currentPath) {
      case '/':
        return (
          <div className="header-title">
            <img src={airplane} alt="airplane" />
            <h1>Travel around the world</h1>
            <h3>Your Journey, Our Passion!</h3>
          </div>
        );
      case '/about-us':
        return (
          <div className="header-title">
            <h1>About Us</h1>
            <h3>Your Journey, Our Passion!</h3>
          </div>
        );
      case '/aircraft-details':
        return (
          <div className="header-title">
            <h1>Aircraft Detail</h1>
          </div>
        );
      case '/mini-shop':
        return (
          <div className="header-title">
            <h1>Mini Shop</h1>
          </div>
        );
         case '/shopping-cart':
          return (
            <div className="header-title">
              <h1>Shopping Cart</h1>
            </div>
          );
          case '/job-application':
            return (
              <div className="header-title">
                <h1>Job Application</h1>
              </div>
            );
            case '/job-application-form':
              return (
                <div className="header-title">
                  <h1>Job Application Form</h1>
                </div>
              );
      default:
        return null;
    }
  };

  return (
    <>
      <div 
        className="header-wrapper" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="header">
          <img src={logo} alt="logo" className="logo" />
          <div className="navbar">
            <Link to="/" className={`nav-link ${currentPath === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/about-us" className={`nav-link ${currentPath === '/about-us' ? 'active' : ''}`}>About Us</Link>
            <Link to="/aircraft-details" className={`nav-link ${currentPath === '/aircraft-details' ? 'active' : ''}`}>Aircraft Detail</Link>
            <Link to="/mini-shop" className={`nav-link ${currentPath === '/mini-shop' ? 'active' : ''}`}>Minishop</Link>
            <Link to="/login" className="login-button">Log In</Link>
            <Link to="/shopping-cart" className={`cart-icon ${currentPath === '/shopping-cart' ? 'active' : ''}`}><FiShoppingCart /></Link>
          </div>
        </div>

       
        {renderHeaderText()}
      </div>

      <Outlet />
    </>
  );
};

export default Header;
