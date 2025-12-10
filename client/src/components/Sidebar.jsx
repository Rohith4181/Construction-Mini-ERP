import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <span className="icon">📊</span>
          <span className="label">Dashboard</span>
        </NavLink>

        <NavLink 
          to="/finance" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <span className="icon">💰</span>
          <span className="label">Finance</span>
        </NavLink>

        <NavLink 
          to="/admin" 
          className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
        >
          <span className="icon">🛡️</span>
          <span className="label">Admin</span>
        </NavLink>

      </nav>
    </aside>
  );
};

export default Sidebar;