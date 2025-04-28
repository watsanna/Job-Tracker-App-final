// src/pages/Home.js
import React, { useEffect } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Import the Footer component

const Home = () => {
  // Add the Font Awesome stylesheet to the document head
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
    document.head.appendChild(link);

    // Clean up function to remove the link when component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="page-container">
     
      

      {/* Main Content Area with Two Divs */}
      <main className="main-content">
        {/* First Div - Our Mission */}
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            To provide a centralized platform that helps students to manage their job applications
            and support universities with useful statistical data.
          </p>
          <div className="mission-features">
  <div className="feature">
    <i className="fa fa-check-circle"></i>
    <span>Track applications in one place</span>
  </div>
            <div className="feature">
              <i className="fa fa-check-circle"></i>
              <span>Manage interview schedules</span>
            </div>
            <div className="feature">
              <i className="fa fa-check-circle"></i>
              <span>Get insights from your application data</span>
            </div>
          </div>
        </div>

        {/* Second Div - Mission and Sign Up Button */}
        <div className="cta-section">
          <h2>Stay Organized</h2>
          <p>
            Manage your job applications, interviews, and offers in one place with ease and clarity.
            Our platform helps you keep track of every step in your job search journey.
          </p>
          <p>
            Ready to take control of your job search?
          </p>
          <Link to="/signup" className="cta-button">Create Your Free Account</Link>
        </div>
      </main>
      
      
     
    </div>
  );
};

export default Home;