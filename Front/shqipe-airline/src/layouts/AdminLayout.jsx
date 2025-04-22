import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import './AcdLayout.css';

const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="acd-layout">
      <div className="sidebar">
        <div className="sidebar-content">
          <Link 
            to="/admin-dashboard" 
            className={`sidebar-item ${currentPath === '/admin-dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin-dashboard/admin-transaction" 
            className={`sidebar-item ${currentPath === '/admin-dashboard/admin-transaction' ? 'active' : ''}`}
          >
            Transactions
          </Link>
          <Link 
            to="/admin-dashboard/admin-user-management" 
            className={`sidebar-item ${currentPath === '/admin-dashboard/admin-user-management' ? 'active' : ''}`}
          >
           User Account Management
          </Link>
          <Link 
            to="/admin-dashboard/admin-reports" 
            className={`sidebar-item ${currentPath === '/admin-dashboard/admin-reports' ? 'active' : ''}`}
          >
            Reports
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
          <h1>Admin Dashboard</h1>
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

export default AdminLayout; 