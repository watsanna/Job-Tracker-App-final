import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Correct import path
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import './signup.css'; // Correct import path

const SignUp = () => {
  const [firstname, setFirstnaame] = useState('');
  const [lastname, setLastnaame] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSignUp = async (e) => {
    e.preventDefault();
    const id = crypto.randomUUID(); // Generate a new UUID
    const { data, error } = await supabase
      .from('usersData')
      .insert([{ id, email, password, role, firstname, lastname, institution }])
      .select();

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') { // PostgreSQL unique violation error code
        setError('Email Already Used, Please Use Another');
      } else {
        setError('Error signing up: ' + error.message);
      }
      setSuccessMessage(''); // Clear success message on error
    } else {
      console.log('Signed up:', data[0]);
      setSuccessMessage('Account successfully created!'); // Set success message
      setError(''); // Clear error message
      setTimeout(() => {
        navigate('/login'); // Redirect to the login page after 2 seconds
      }, 2000);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Sign Up</h1>
  
        <form onSubmit={handleSignUp} className="signup-form">
          <div className="form-group">
            <input
              className="signup-input"
              type="firstname"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstnaame(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="signup-input"
              type="lastname"
 placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastnaame(e.target.value)}
              required
            />
          </div>

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
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  
          <button type="submit" className="primary-button">Sign Up</button>
        </form>
  
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        
        
      </div>
    </div>
  );
};

export default SignUp; // Default export