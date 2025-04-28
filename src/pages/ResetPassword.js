import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Correct import path
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './signup.css'; // Use the same CSS for styling

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Check if the user exists in the database with the provided email, institution, and role
    const { data, error } = await supabase
      .from('usersData')
      .select('*')
      .eq('email', email)
      .eq('institution', institution)
      .eq('role', role)
      .single(); // Assuming one match for simplicity

    if (error || !data) {
      setError('User not found or incorrect details.');
      setSuccessMessage('');
    } else {
      // If user exists, proceed to reset the password (pass data to set new password page)
      setSuccessMessage('User verified! Proceed to set a new password.');
      setError('');
      setTimeout(() => {
        navigate('/set-new-password', { state: { userId: data.id } }); // Pass user id to set new password page
      }, 2000);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Reset Password</h1>

        <form onSubmit={handleResetPassword} className="signup-form">
          <div className="form-group">
            <input
              className="signup-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="signup-input"
              type="institution"
              placeholder="Institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              className="signup-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <button type="submit" className="primary-button">Reset Password</button>
        </form>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ResetPassword; // Default export
