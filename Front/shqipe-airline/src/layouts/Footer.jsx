import React from 'react';
import './Footer.css';
import logo from './../images/logoname.jpg';
import fbIcon from './../images/facebook.png';
import linkedinIcon from './../images/linkedinlogo.png';
import twitterIcon from './../images/twitterlogo.png';
import whatsappIcon from './../images/whatsupplogo.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div>
          <h1 className="footer-logo">
            <img src={logo} className="footer-logo-img" alt="Shqipe Airline Logo" /> 
          </h1>
          <p className="footer-tagline">Flying the Shqipe Way - Bold, Fast, Free!</p>
          <div className="footer-icons">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={fbIcon} alt="Facebook" className="icon-img" />
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={linkedinIcon} alt="LinkedIn" className="icon-img" />
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Twitter" className="icon-img" />
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
              <img src={whatsappIcon} alt="WhatsApp" className="icon-img" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="footer-heading">Address</h3>
          <p className="footer-text">Autostrada Tiranë-Rinas, km. 12, 1000</p>
        </div>

        <div>
          <h3 className="footer-heading">About</h3>
          <ul className="footer-links">
            <li><a href="">Home</a></li>
            <li><a href="about-us">About Us</a></li>
            <li><a href="aircraft-details">Aircraft Details</a></li>
            <li><a href="mini-shop">Minishop</a></li>
          </ul>
        </div>

        <div>
          <h3 className="footer-heading">Support</h3>
          <p className="footer-text">+355 69 606 1193</p>
          <p className="footer-text">shqipeairline@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

