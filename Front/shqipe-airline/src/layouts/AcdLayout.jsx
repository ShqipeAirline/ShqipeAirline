import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import './AcdLayout.css';

const AcdLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="acd-layout">
      <div className="sidebar">
        <div className="sidebar-content">
          <Link 
            to="/acd-dashboard" 
            className={`sidebar-item ${currentPath === '/acd-dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/acd-dashboard/schedule" 
            className={`sidebar-item ${currentPath === '/acd-dashboard/schedule' ? 'active' : ''}`}
          >
            Schedule
          </Link>
          <Link 
            to="/" 
            className="sidebar-item"
          >
            Sign Out
          </Link>
        </div>
      </div>
      <div className="main-container">
        <header className="page-header">
          <h1>Air Control Department Dashboard</h1>
          <div className="header-right">
            <div className="search-bar">
              <button type="button">🔍</button>
              <input type="text" placeholder="Search anything" />
            </div>
            <div className="user-profile">
              <span></span>
              <div className="user-info">
                <span className="user-name">Name Surname</span>
                <span className="user-role">Air Control Department</span>
              </div>
              <button className="profile-dropdown"><IoIosArrowDown /></button>
            </div>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AcdLayout; 