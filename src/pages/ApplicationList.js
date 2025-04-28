import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import './applicationslist.css'; // Make sure this exists for CSS styles!

const ApplicationList = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch Jobs from Supabase
  const fetchJobs = async () => {
    const userEmail = localStorage.getItem('userEmail');

    // Get user ID from usersData table
    const { data: userData, error: userError } = await supabase
      .from('usersData')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError || !userData) {
      setError('User not found.');
      return;
    }

    // Fetch jobs linked to user_id
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setJobs(data);
    }
  };

  // Update job status in Supabase
  const updateJobStatus = async (jobId, newStatus) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: newStatus })
      .eq('id', jobId);

    if (error) {
      setError(error.message);
    } else {
      fetchJobs(); // Refresh jobs after update
    }
  };

  // Returns colors based on job status
  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return { color: 'green', backgroundColor: '#e0f7e9' };
      case 'interview':
        return { color: 'blue', backgroundColor: '#e0e7ff' };
      case 'offer':
        return { color: 'orange', backgroundColor: '#fff3e0' };
      case 'rejected':
        return { color: 'red', backgroundColor: '#ffe0e0' };
      case 'saved':
        return { color: 'purple', backgroundColor: '#f3e5f5' };
      default:
        return { color: '#333', backgroundColor: '#ffffff' };
    }
  };

  return (
    
      <div className="applist-page">
        <h2 className="applist-title">Your Job Listings</h2>
    
        {error && <p style={{ color: 'red' }}>{error}</p>}
    
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <div>
                <p><strong>Company:</strong> {job.company_name}</p>
                <p><strong>Job Title:</strong> {job.job_title}</p>
                <p><strong>Job Description:</strong></p>
                <p>{job.job_description}</p>
                <p><strong>Application Link:</strong>{' '}
                  <a
                    href={job.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {job.application_link}
                  </a>
                </p>
                <p><strong>Created At:</strong> {new Date(job.created_at).toLocaleString()}</p>
              </div>
    
              <div className="job-status">
                <label htmlFor={`status-${job.id}`}><strong>Status:</strong></label>
                <select
                  id={`status-${job.id}`}
                  value={job.status}
                  onChange={(e) => updateJobStatus(job.id, e.target.value)}
                  style={{
                    ...getStatusColor(job.status),
                    padding: '5px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                  }}
                >
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                  <option value="saved">Saved</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

};

export default ApplicationList;
