// src/pages/AddJob.js

import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './addjob.css';

const AddJob = () => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationLink, setApplicationLink] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('You must be logged in to add a job.');
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const handleAddJob = async (e) => {
    e.preventDefault();
    const userEmail = localStorage.getItem('userEmail'); // Get the user's email from localStorage

    // Fetch the user ID based on the email
    const { data: userData, error: userError } = await supabase
      .from('usersData')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      setError('User  not found.');
      return;
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
          id: crypto.randomUUID(), // Generate a new UUID for the job
          company_name: companyName,
          job_title: jobTitle,
          job_description: jobDescription,
          application_link: applicationLink,
          created_at: new Date().toISOString(), // Set the created_at timestamp
          user_id: userData.id // Store the user's ID to associate the job with the user
        },
      ]);

    if (error) {
      setError(error.message);
    } else {
      alert('Job added successfully!');
      // Clear the form
      setCompanyName('');
      setJobTitle('');
      setJobDescription('');
      setApplicationLink('');
    }
  };

  return (
    <div className="addjob-page">
      <div className="add-job-container"></div>
    <form onSubmit={handleAddJob} className='addjob-form'>
      <h1 className="addjob-title">Add Your Potential Job</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div className="form-group">
      <input
      className='addjob-input'
        type="text"
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
      />
      </div>

      <div className="form-group">
      <input
       className='addjob-input'
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        required
      />
      </div>

      <div className="form-group">
      <textarea
       className='addjob-input'
        placeholder="Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        required
      />
      </div>

      <div className="form-group">
      <input
       className='addjob-input'
        type="text"
        placeholder="Application Link"
        value={applicationLink}
        onChange={(e) => setApplicationLink(e.target.value)}
        required
      />
      </div>

      <button type="submit" className='primary-button'>Add Job</button>
    </form>

    </div>
  );
};

export default AddJob;