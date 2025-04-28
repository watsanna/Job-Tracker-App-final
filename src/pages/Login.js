// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ setUserRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('usersData')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) {
      setError('Invalid email or password');
      setSuccessMessage('');
    } else {
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userRole', data.role); // ✅ Save role
      setUserRole(data.role);                      // ✅ Set state
      setSuccessMessage('Successfully logged in!');
      setError('');
      setTimeout(() => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole'); // ✅ Clear role on timeout
        alert('Session expired. Please log in again.');
        navigate('/login');
      }, 30 * 60 * 1000); // 30 minutes
      navigate('/profile');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Log In</h1>
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p>
          <a href="/reset-password" className="forgot-password-link" style={{ color: 'white' }}>
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
