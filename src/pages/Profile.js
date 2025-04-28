import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './profile.css';

import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ applied: 0, interview: 0, offer: 0, rejected: 0 });
  const [events, setEvents] = useState([]);

  const [appliedGoal, setAppliedGoal] = useState(() => {
    const savedGoal = localStorage.getItem('appliedGoal');
    return savedGoal ? Number(savedGoal) : 10;
  });
  const [goalInput, setGoalInput] = useState(appliedGoal);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      setError('User email not found. Please log in again.');
      return;
    }

    const { data, error } = await supabase
      .from('usersData')
      .select('id, email, role, firstname, lastname, institution')
      .eq('email', userEmail)
      .single();

    if (error || !data) {
      setError('Error fetching user data.');
      return;
    }

    setUserData(data);

    if (data.role === 'student') {
      fetchJobStats(data.id);
    }
  };

  const fetchJobStats = async (userId) => {
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select('status, created_at')
      .eq('user_id', userId);

    if (error) {
      setError(error.message);
      return;
    }

    const counts = { applied: 0, interview: 0, offer: 0, rejected: 0 };
    const calendarEvents = jobs.map((job) => ({
      title: job.status,
      start: new Date(job.created_at),
      end: new Date(job.created_at),
    }));

    jobs.forEach((job) => {
      if (counts[job.status] !== undefined) counts[job.status]++;
    });

    setStats(counts);
    setEvents(calendarEvents);
  };

  const handleGoalSet = () => {
    setAppliedGoal(Number(goalInput));
    localStorage.setItem('appliedGoal', Number(goalInput));
  };

  const handleDeleteAccount = async () => {
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const userEmail = localStorage.getItem('userEmail');
    const { data, error } = await supabase
      .from('usersData')
      .select('*')
      .eq('email', userEmail)
      .eq('password', password)
      .single();

    if (error || !data) {
      setError('Incorrect password.');
      return;
    }

    const { error: deleteError } = await supabase
      .from('usersData')
      .delete()
      .eq('id', data.id);

    if (deleteError) {
      setError('Error deleting account.');
    } else {
      localStorage.removeItem('userEmail');
      navigate('/login');
    }
  };

  const chartData = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        label: 'Job Applications',
        data: [stats.applied, stats.interview, stats.offer, stats.rejected],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">
        {userData ? `Welcome ${userData.firstname} ${userData.lastname}` : 'Loading...'}
      </h1>

      {error && <div className="error-container">{error}</div>}

      {userData && (
        <div className="profile-info">
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Role:</strong> {userData.role}</p>
          <p><strong>Institution:</strong> {userData.institution}</p>

          {userData.role === 'student' && (
            <>
              <h2 className="subheading">My Job Application Stats</h2>
              <div className="stats-container">
                <div className="stat-card applied">
                  <h3>Applied</h3>
                  <p className="stat-number">{stats.applied + stats.interview + stats.offer + stats.rejected}</p>
                  <p className="progress-text">
                    {appliedGoal - (stats.applied + stats.interview + stats.offer + stats.rejected)} more to reach your monthly goal of {appliedGoal}
                  </p>
                  <div className="goal-input">
                    <input
                      type="number"
                      value={goalInput}
                      style={{ textAlign: 'center' }}
                      onChange={(e) => setGoalInput(e.target.value)}
                    />
                    <button className="button" onClick={handleGoalSet}>Set Monthly Goal</button>
                  </div>
                </div>

                <div className="stat-card interview">
                  <h3>Interview</h3>
                  <p className="stat-number">{stats.interview}</p>
                  <p className="progress-text">
                    {stats.applied === 0 ? 'No applications yet' : `${Math.round((stats.interview / (stats.applied + stats.interview + stats.offer + stats.rejected)) * 100)}% reached interview`}
                  </p>
                </div>

                <div className="stat-card offer">
                  <h3>Offers</h3>
                  <p className="stat-number">{stats.offer}</p>
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: stats.interview > 0 ? `${(stats.offer / stats.interview) * 100}%` : '0%',
                      }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {stats.interview === 0 ? 'No interviews yet' : `${Math.round((stats.offer / stats.interview) * 100)}% resulted in offers`}
                  </p>
                </div>

                <div className="stat-card rejected">
                  <h3>Rejected</h3>
                  <p className="stat-number">{stats.rejected}</p>
                </div>
              </div>

              <div className="chart-container">
                <h2>Job Application Status Over Time</h2>
                <Line data={chartData} options={{ responsive: true }} />
              </div>

              <div className="subheading">Job Application Calendar</div>
              <div className="calendar-container">
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500, margin: '30px' }}
                />
              </div>
            </>
          )}
<div
  className="stats-container"
  style={{
    backgroundColor: '#134e3a',
    padding: '30px',
    
    color: '#fffbd3',
    marginTop: '30px'
  }}
>
  {/* Change Password Section */}
  <div className="account-adjust-container">
  
    <button className="button" onClick={() => navigate('/reset-password')}>
      Change Password
    </button>
  </div>

  {/* Delete Account Section */}
  <div className="account-adjust-container">
    
    <div className="form-group">
      <input
        className="profile-input"
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /> <br />
      <button
  className="button"
  onClick={handleDeleteAccount}
  style={{ padding: '10px', marginTop: '12px'  }}
>Delete Account</button>
      {error && <p style={{ padding: '10px', marginTop: '12px'  }}>{error}</p>}
    </div>
  </div>
</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
