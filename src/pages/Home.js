// src/pages/Home.js
import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-wrapper">


      {/* Hero Section */}
      <main className="hero-section">
        <h1 className="hero-title">Welcome to Your Job Tracker Assistant</h1>
        <p className="hero-subtitle">Track your job applications effortlessly.</p>

        <div className="button-group">
          <button 
          className="primary-button">
            <Link to="/login">Log In</Link>
          </button>


          <button 
          className="primary-button">
            <Link to="/signup">Create Account</Link>
          </button>

          
        </div>
      </main>

      {/* Info Section */}
      <section className="info-section">
        <h2 className="info-title">Stay Organized</h2>
        <p className="info-text">
          Manage your job applications, interviews, and offers in one place with ease and clarity.
          
        </p>
        <h2 className="info-title">Our Mission:</h2>
        <p className="info-text">
          To provide a centralized platform that helps students to manage their job applications​
          and support universities with useful statistical data.
        </p>
        <div className="mission-features" style={{ textAlign: 'center', padding: '20px', font: '16px'}}>
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
        
      </section>

   

     

     
    </div>
  );
};

export default Home;
