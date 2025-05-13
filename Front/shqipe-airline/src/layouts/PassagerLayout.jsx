import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import './AcdLayout.css';
import useUserStore from '../store/userStore';


const PassagerLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();
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
            <div className="user-profile">
              <div className="user-info">
                <span onClick={() => navigate('/passenger-dashboard/profile')} className="user-name">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</span>
                <span className="user-role">Passenger</span>
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

export default PassagerLayout; 
