import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import './AcdLayout.css';

const PassagerLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="acd-layout">
      <div className="sidebar">
        <div className="sidebar-content">
          <Link 
            to="/passenger-dashboard" 
            className={`sidebar-item ${currentPath === '/passenger-dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/passenger-dashboard/profile" 
            className={`sidebar-item ${currentPath === '/passenger-dashboard/profile' ? 'active' : ''}`}
          >
            Profile Management
          </Link>
          <Link 
            to="/passenger-dashboard/search" 
            className={`sidebar-item ${currentPath === '/passenger-dashboard/search' ? 'active' : ''}`}
          >
           Search Flights
          </Link>
          <Link 
            to="/passenger-dashboard/book" 
            className={`sidebar-item ${currentPath === '/passenger-dashboard/book' ? 'active' : ''}`}
          >
            Book Tickets
          </Link>
          <Link 
            to="/passenger-dashboard/feedback" 
            className={`sidebar-item ${currentPath === '/passenger-dashboard/feedback' ? 'active' : ''}`}
          >
            Feedback
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
          <h1>Passager Dashboard</h1>
          <div className="header-right">
            <div className="search-bar">
              <button type="button">🔍</button>
              <input type="text" placeholder="Search anything" />
            </div>
            <div className="user-profile">
              <span></span>
              <div className="user-info">
                <span className="user-name">Name Surname</span>
                <span className="user-role">Admin</span>
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

export default PassagerLayout; 