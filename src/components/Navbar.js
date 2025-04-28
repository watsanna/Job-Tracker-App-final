// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../pages/Logout';
import './Navbar.css';

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('userEmail');

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      navigate('/login');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">Job Tracker</Link>
        </div>

        <nav className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>

          {isLoggedIn ? (
            <>
              {userRole === 'student' && (
                <>
                  <Link to="/applications" className="nav-link">Applications</Link>
                  <Link to="/add-job" className="nav-link">Add Job</Link>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <Link to="/Help" className="nav-link">Help</Link>
                  
                </>
              )}

              {userRole === 'staff' && (
                <>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <Link to="/student-lookup" className="nav-link">Student Lookup</Link>
                  <Link to="/Help" className="nav-link">Help</Link>
                </>
              )}

              {userRole === 'admin' && (
                <>
                  <Link to="/profile" className="nav-link">Profile</Link>
                  <Link to="/analytics" className="nav-link">Analytics</Link>
                  <Link to="/Help" className="nav-link">Help</Link>
                </>
              )}

              <button className="logout-button" onClick={handleLogout}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
