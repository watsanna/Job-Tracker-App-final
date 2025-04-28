import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Correct import path
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate for redirection
import './signup.css'; // Use the same CSS for styling

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Get the state passed from ResetPassword.js
  const { userId } = location.state || {}; // Get the userId passed from ResetPassword.js

  useEffect(() => {
    if (!userId) {
      setError('User ID is missing. Please go back and verify your details.');
    }
  }, [userId]);

  const handleSetNewPassword = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID is missing.');
      return;
    }

    // Update the user's password in the database
    const { data, error } = await supabase
      .from('usersData')
      .update({ password: newPassword })
      .eq('id', userId);

    if (error) {
      setError('Error updating password: ' + error.message);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Password has been successfully updated!');
      setError('');
      setTimeout(() => {
        navigate('/login'); // Redirect to login after 2 seconds
      }, 2000);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Set New Password</h1>

        <form onSubmit={handleSetNewPassword} className="signup-form">
          <div className="form-group">
            <input
              className="signup-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="primary-button">Update Password</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default SetNewPassword; // Default export
