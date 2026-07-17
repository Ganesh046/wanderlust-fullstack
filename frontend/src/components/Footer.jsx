import React from 'react';
import { Compass } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-main">
      <div className="container footer-container">
        <div className="footer-logo">
          <Compass size={24} className="footer-logo-icon" />
          <span>Wanderlust</span>
        </div>
        
        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Wanderlust Inc. All rights reserved. Made for explorers worldwide.
        </p>
        
        <div className="footer-links">
          <a href="#" className="nav-hover">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="nav-hover">Terms of Service</a>
          <span>&middot;</span>
          <a href="#" className="nav-hover">Destinations</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
