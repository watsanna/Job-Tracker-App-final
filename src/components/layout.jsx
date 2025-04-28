// components/Layout.js
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children, userRole }) => (
  <>
    <Navbar userRole={userRole} />
    <main>{children}</main>
    <Footer userRole={userRole} />
    <ul>
  <li className="mission-item">
    <i className="fas fa-folder-open"></i> Track applications in one place
  </li>
  <li className="mission-item">
    <i className="fas fa-calendar-check"></i> Manage interview schedules
  </li>
  <li className="mission-item">
    <i className="fas fa-chart-bar"></i> Get insights from your application data
  </li>
</ul>
  </>
);


export default Layout;
