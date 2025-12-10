import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  const navigate = useNavigate();
  const user = { name: 'Admin User' }; // Placeholder for logged-in user

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🏗️</span>
        <h1 className="navbar-title">Construction ERP</h1>
      </div>

      <div className="navbar-actions">
        <span className="navbar-user">Hello, {user.name}</span>
        <button className="navbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;