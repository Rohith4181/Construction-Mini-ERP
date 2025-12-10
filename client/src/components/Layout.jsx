import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      {/* 1. Top Navigation */}
      <Navbar />

      <div className="layout-body">
        {/* 2. Sidebar Navigation */}
        <Sidebar />

        {/* 3. Main Page Content */}
        <main className="layout-content">
          <div className="content-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;