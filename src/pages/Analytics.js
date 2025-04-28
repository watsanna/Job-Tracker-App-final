import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; // Import required elements

import './analytics.css'; // Create this CSS file for styling

ChartJS.register(ArcElement, Tooltip, Legend); // Register required components

const Analytics = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  });

  const [offerCompanies, setOfferCompanies] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*');

    if (error) {
      console.error('Error fetching jobs:', error.message);
      setError('Error fetching job data');
      return;
    }

    setJobs(data);
    processStats(data);
  };

  const processStats = (jobs) => {
    const applied = jobs.filter((job) => job.status === 'applied').length;
    const interview = jobs.filter((job) => job.status === 'interview').length;
    const offer = jobs.filter((job) => job.status === 'offer').length;
    const rejected = jobs.filter((job) => job.status === 'rejected').length;

    // Extract companies with offers
    const offersList = jobs
      .filter((job) => job.status === 'offer')
      .map((job) => job.company_name);

    const uniqueOffersList = [...new Set(offersList)];

    setStats({
      applied,
      interview,
      offer,
      rejected,
    });

    setOfferCompanies(uniqueOffersList);
  };

  const getTotalApplications = () => {
    return (
      stats.applied +
      stats.interview +
      stats.offer +
      stats.rejected
    );
  };

  // Pie chart data
  const pieChartData = {
    labels: ['Applied', 'Interviews', 'Offers', 'Rejected'],
    datasets: [
      {
        data: [stats.applied, stats.interview, stats.offer, stats.rejected],
        backgroundColor: ['#007bff', '#ff851b', '#28a745', '#dc3545'], // Color for each section
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-page">
      <h1>Admin Analytics Dashboard</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="welcome-message">
        <h2>Welcome Admin</h2>
      </div>

      <div className="stats-container">
        <div className="stat-card applied">
          <h3>Total Applications</h3>
          <p>{getTotalApplications()}</p>
        </div>

        <div className="stat-card interview">
          <h3>Interviews</h3>
          <p>{stats.interview}</p>
          <p>
            {(
              (stats.interview / getTotalApplications()) * 100
            ).toFixed(1)}% of applications advanced to interviews
          </p>
        </div>

        <div className="stat-card offer">
          <h3>Offers</h3>
          <p>{stats.offer}</p>
          <p>
            {(
              (stats.offer / getTotalApplications()) * 100
            ).toFixed(1)}% of applications got offers
          </p>
        </div>

        <div className="stat-card rejected">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="chart-container">
        <h3>Job Application Status Breakdown</h3>
        <div className="chart-container">
        <h3>Job Application Status Breakdown</h3>
        <Pie data={pieChartData} />
      </div>
      </div>

      <div className="offers-list">
        <h2>Successful Company Offers</h2>
        {offerCompanies.length === 0 ? (
          <p>No offers yet.</p>
        ) : (
          <ul>
            {offerCompanies.map((company, index) => (
              <li key={index}>{company}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Analytics;
