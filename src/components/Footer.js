// src/components/Footer.js
import React from 'react';
import './Footer.css';
// Only import what you need
// import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Job Tracker Assistant. All rights reserved.</p>
       
      </div>
    </footer>
  );
};

export default Footer;