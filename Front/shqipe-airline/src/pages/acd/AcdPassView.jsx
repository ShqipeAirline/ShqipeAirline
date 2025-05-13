import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AcdPassView.css';
import { IoIosArrowDown } from "react-icons/io";
import api from '../../api/axios';
import useUserStore from '../../store/userStore';

const AcdPassView = () => {
  const { user } = useUserStore();
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        console.log(data);
        setUsers(data);
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredResults = users.filter((user) =>
      user.first_name.toLowerCase().includes(query) ||
      user.last_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
    setSearchResults(filteredResults);
  };

  if (loading) {
    return (
      <div className="acd-layout">
        <div className="sidebar">
          <div className="sidebar-content">
            <Link to="/acd-dashboard" className="sidebar-item">Dashboard</Link>
            <Link to="/acd-dashboard/schedule" className="sidebar-item">Schedule</Link>
            <Link to="/" className="sidebar-item">Sign Out</Link>
          </div>
        </div>
        <div className="main-container">
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="acd-layout">
        <div className="sidebar">
          <div className="sidebar-content">
            <Link to="/acd-dashboard" className="sidebar-item">Dashboard</Link>
            <Link to="/acd-dashboard/schedule" className="sidebar-item">Schedule</Link>
            <Link to="/" className="sidebar-item">Sign Out</Link>
          </div>
        </div>
        <div className="main-container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="acd-layout">
      <div className="sidebar">
        <div className="sidebar-content">
          <Link to="/acd-dashboard" className="sidebar-item">Dashboard</Link>
          <Link to="/acd-dashboard/schedule" className="sidebar-item">Schedule</Link>
          <Link to="/" className="sidebar-item">Sign Out</Link>
        </div>
      </div>

      <div className="main-container">
        <header className="page-header">
          <h1>View All Passenger Records</h1>
          <div className="header-right">
            <div className="search-bar">
              <button type="button">🔍</button>
              <input
                type="text"
                placeholder="Search passengers"
                onChange={handleSearch}
              />
            </div>
            <div className="user-profile">
              <span></span>
              <div className="user-info">
                <span className="user-name">{user?.first_name} {user?.last_name}</span>
                <span className="user-role">Air Control Department</span>
              </div>
              <button className="profile-dropdown"><IoIosArrowDown /></button>
            </div>
          </div>
        </header>

        <section className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Account Status</th>
                <th>Last Login</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-results">No passengers found.</td>
                </tr>
              ) : (
                searchResults.map((user, index) => (
                  <tr key={user.user_id}>
                    <td>{index + 1}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number || 'N/A'}</td>
                    <td>{new Date(user.date_of_birth).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${user.account_status === 1 ? 'active' : 'inactive'}`}>
                        {user.account_status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{user.last_login ? new Date(user.last_login).toLocaleString() : 'Not logged in yet'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AcdPassView;
