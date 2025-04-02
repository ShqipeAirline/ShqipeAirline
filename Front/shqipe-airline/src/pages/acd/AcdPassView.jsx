import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AcdPassView.css';
import line from '../../images/line.png';
import deviderv from '../../images/dividerv.png';
import { IoIosArrowDown } from "react-icons/io";


const passengers = [
  { id: 1, firstName: 'Blerta', lastName: 'Hoxha', birthday: '19-05-1999', gender: 'F', email: 'blertahoxha@gmail.com' },
  { id: 2, firstName: 'Arben', lastName: 'Krasniqi', birthday: '10-04-1975', gender: 'M', email: 'akrasqini@gmail.com' },
  { id: 3, firstName: 'Elira', lastName: 'Berisha', birthday: '06-02-1988', gender: 'F', email: 'liraberisha22@gmail.com' },
];

const AcdPassView = () => {
  const [searchResults, setSearchResults] = useState(passengers);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filteredResults = passengers.filter((passenger) =>
      passenger.firstName.toLowerCase().includes(query) ||
      passenger.lastName.toLowerCase().includes(query)
    );
    setSearchResults(filteredResults);
  };

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
          <h1>   View All Passenger Records</h1>
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
                <span className="user-name">Name Surname</span>
                <span className="user-role">Air Control Department</span>
              </div>
              <button className="profile-dropdown"><IoIosArrowDown /></button>
            </div>
          </div>
        </header>

        {/* Passenger Table */}
        <section className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Birthday</th>
                <th>Gender</th>
                <th>Email Address</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">No passengers found.</td>
                </tr>
              ) : (
                searchResults.map((passenger, index) => (
                  <tr key={passenger.id}>
                    <td>{index + 1}</td>
                    <td>{passenger.firstName}</td>
                    <td>{passenger.lastName}</td>
                    <td>{passenger.birthday}</td>
                    <td>{passenger.gender}</td>
                    <td>{passenger.email}</td>
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
