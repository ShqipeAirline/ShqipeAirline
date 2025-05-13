import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import './AcdLayout.css';
import useUserStore from '../store/userStore';

const AcdLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();
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
            <div className="user-profile">
              <div className="user-info">
                <span onClick={() => navigate('/acd-dashboard/profile')} className="user-name">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</span>
                <span className="user-role">Air Control Department</span>
              </div>
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