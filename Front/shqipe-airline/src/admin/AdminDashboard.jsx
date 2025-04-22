import React from 'react';
import './AdminDashboard.css';
import { FaPlaneDeparture, FaPlane, FaRegTimesCircle, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { PiChartLineDown } from 'react-icons/pi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import world from './../images/world.png';

const AdminDashboard = () => {
  const completedFlights = 125;
  const activeFlights = 80;
  const canceledFlights = 25;
  const totalRevenue = 15000;
  const ticketSold = 12500;
  const customerGrowth = 25;

  const ticketData = [
    { name: 'Jan', tickets: 2000 },
    { name: 'Feb', tickets: 3500 },
    { name: 'Mar', tickets: 1800 },
    { name: 'Apr', tickets: 3200 },
    { name: 'May', tickets: 2900 },
    { name: 'Jun', tickets: 3600 },
    { name: 'Jul', tickets: 4000 },
  ];

  const revenueData = [
    { name: 'Feb', income: 15000, expense: 6000 },
    { name: 'Mar', income: 16000, expense: 7500 },
    { name: 'Apr', income: 15500, expense: 7000 },
    { name: 'May', income: 18500, expense: 8000 },
    { name: 'Jun', income: 17800, expense: 7200 },
    { name: 'Jul', income: 20000, expense: 6800 },
  ];

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <InfoCard title="Completed Flights" value={completedFlights} change="1.35%" icon={<FaPlaneDeparture />} up />
        <InfoCard title="Active Flights" value={activeFlights} change="3.68%" icon={<FaPlane />} up />
        <InfoCard title="Canceled Flights" value={canceledFlights} change="1.45%" icon={<FaRegTimesCircle />} />
        <InfoCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} change="5.94%" icon={<FaDollarSign />} up />
      </div>

      <div className="dashboard-grid">
        <div className="map-card">
          <h4>Popular Destinations</h4>
          <img src={world} alt="World Map" className="map-img" />
          <div className="destination-stats">
            {[
              ['Mexico', '24%'],
              ['Canada', '18%'],
              ['United Kingdom', '16%'],
              ['India', '12%'],
              ['France', '9%'],
              ['Australia', '7%'],
            ].map(([country, percent]) => (
              <div key={country} className="destination">
                <span>{country}</span>
                <span>{percent}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <h4>Ticket Sales</h4>
            <h2>{ticketSold.toLocaleString()} <span>Tickets Sold</span></h2>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={ticketData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tickets" stroke="#dec773" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h4>Revenue Growth</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={revenueData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#f5f5f5" />
                <Line type="monotone" dataKey="income" stroke="#dec773" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#111" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="growth-card">
            <h4>Customer Growth</h4>
            <div className="growth-gauge">
              <div className="needle" style={{ transform: `rotate(${customerGrowth * 1.8}deg)` }} />
            </div>
            <h2>{customerGrowth}%</h2>
            <p>From Last Month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, change, icon, up }) => (
  <div className="info-card">
    <div className="info-header">
      <h4>{title}</h4>
      <div className="icon">{icon}</div>
    </div>
    <h2>{value}</h2>
    <span className={`trend ${up ? 'up' : 'down'}`}>
      {up ? <FaChartLine /> : <PiChartLineDown />} {change}
    </span>
  </div>
);

export default AdminDashboard;
