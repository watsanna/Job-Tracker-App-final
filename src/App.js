// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import AddJob from './pages/AddJob';
import ApplicationList from './pages/ApplicationList';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Help from './pages/Help';
import SyncApps from './pages/SyncApps';
import MyProfile from './pages/MyProfile';
import OverviewModal from './components/OverviewModal';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StudentLookup from './pages/Lookup';
import ResetPassword from './pages/ResetPassword';
import SetNewPassword from './pages/SetNewPassword';
import './App.css';

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <div className="app-wrapper">
        <Navbar userRole={userRole} />
        <main className="content">
          <Routes>
            <Route path="/login" element={<Login setUserRole={setUserRole} />} />
            <Route path="/" element={<Home />} />
            <Route path="/help" element={<Help />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/add-job" element={<AddJob />} />
            
            <Route path="/overview-modal" element={<OverviewModal />} />
            <Route path="/other-profile" element={<MyProfile />} />
            <Route path="/applications" element={<ApplicationList />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/student-lookup" element={<StudentLookup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/set-new-password" element={<SetNewPassword />} />
          </Routes>
        </main>
        <Footer userRole={userRole} />
      </div>
    </Router>
  );
};

export default App;
