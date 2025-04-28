import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './lookup.css'; // Style file if you want to design it

const StudentLookup = () => {
  const [studentEmail, setStudentEmail] = useState('');
  const [studentData, setStudentData] = useState(null); // Will hold both user info and stats
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!studentEmail) {
      setError('Please enter a student email.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // ✅ Step 1: Get user details from usersData table
      const { data: user, error: userError } = await supabase
        .from('usersData')
        .select('id, email, role, institution, firstname, lastname')
        .eq('email', studentEmail)
        .single();

      if (userError || !user) {
        setError('Student not found.');
        setStudentData(null);
        setLoading(false);
        return;
      }

      // ✅ Step 2: Get jobs for that user
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id);

      if (jobsError) {
        setError('Error fetching job applications.');
        setStudentData(null);
        setLoading(false);
        return;
      }

      processStudentData(user, jobs); // Pass user and jobs data together
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError('Unexpected error occurred.');
      setLoading(false);
    }
  };

  const processStudentData = (user, jobs) => {
    const applied = jobs.filter((job) => job.status === 'applied').length;
    const interview = jobs.filter((job) => job.status === 'interview').length;
    const offer = jobs.filter((job) => job.status === 'offer').length;
    const rejected = jobs.filter((job) => job.status === 'rejected').length;

    const appliedCompanies = jobs.map((job) => job.company_name);
    const offerCompanies = jobs
      .filter((job) => job.status === 'offer')
      .map((job) => job.company_name);

    setStudentData({
      userInfo: user, // The user details (email, name, role, institution)
      stats: { applied, interview, offer, rejected },
      appliedCompanies,
      offerCompanies,
    });
  };

  return (
    <div className="student-lookup-page">
      <h1>Student Lookup</h1>

      <div className="search-bar">
        <input
          type="email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          placeholder="Enter student email"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {error && <p className="error-text">{error}</p>}

      {studentData && (
        <>
          <div className="profile-info">
  <p>
    <strong>First Name:</strong> {studentData.userInfo.firstname}{"      "}
    <strong>Last Name:</strong> {studentData.userInfo.lastname}
  </p>
  <p>
    <strong>Email:</strong> {studentData.userInfo.email}{"      "}
    <strong>Role:</strong> {studentData.userInfo.role}
  </p>
  <p>
    <strong>Institution:</strong> {studentData.userInfo.institution}
  </p>
</div>


          {/* ✅ Stats Section */}
          <div className="student-stats-container">
            <h2>Application Stats</h2>
            <div className="stats-grid">
              <div className="stat-card applied">
                <h3>Applied</h3>
                <p>{studentData.stats.applied}</p>
              </div>
              <div className="stat-card interview">
                <h3>Interviews</h3>
                <p>{studentData.stats.interview}</p>
              </div>
              <div className="stat-card offer">
                <h3>Offers</h3>
                <p>{studentData.stats.offer}</p>
              </div>
              <div className="stat-card rejected">
                <h3>Rejected</h3>
                <p>{studentData.stats.rejected}</p>
              </div>
            </div>

             {/* ✅ Offers Companies */}
             <h2>Offers Received</h2>
            {studentData.offerCompanies.length > 0 ? (
              <ul>
                {studentData.offerCompanies.map((company, index) => (
                  <li key={index}>{company}</li>
                ))}
              </ul>
            ) : (
              <p>No offers yet.</p>
            )}

            {/* ✅ Applied Companies */}
            <h2 >Applied Companies</h2>
            {studentData.appliedCompanies.length > 0 ? (
              <ul >
                {studentData.appliedCompanies.map((company, index) => (
                  <li key={index}>{company}</li>
                ))}
              </ul>
            ) : (
              <p>No applications found.</p>
            )}

           
          </div>
        </>
      )}
    </div>
  );
};

export default StudentLookup;
