import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './Acd.css';

const Acd = () => {
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
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Acd;