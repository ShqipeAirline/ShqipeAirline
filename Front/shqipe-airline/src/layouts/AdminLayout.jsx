import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { IoIosArrowDown } from "react-icons/io";
import './AcdLayout.css';
import useUserStore from '../store/userStore';

const AdminLayout = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();
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
            to="/admin-dashboard/admin-feedback" 
            className={`sidebar-item ${currentPath === '/admin-dashboard/admin-feedback' ? 'active' : ''}`}
          >
            Feedback Management
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
            <div className="user-profile">
              <div className="user-info">
                <span onClick={() => navigate('/admin-dashboard/profile')} className="user-name">{user ? `${user.firstName} ${user.lastName}` : 'Loading...'}</span>
                <span className="user-role">Admin</span>
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

export default AdminLayout; 