import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { FaPlaneDeparture, FaPlane, FaRegTimesCircle, FaDollarSign, FaChartLine } from 'react-icons/fa';
import { PiChartLineDown } from 'react-icons/pi';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import world from './../images/world.png';
import api from '../api/axios';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    completedFlights: 0,
    activeFlights: 0,
    canceledFlights: 0,
    totalRevenue: 0,
    ticketSold: 0,
    customerGrowth: 0,
    ticketData: [],
    revenueData: [],
    popularDestinations: []
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get('/admin/dashboard/stats');
        setStats({
          completedFlights: response.data.completed_flights,
          activeFlights: response.data.active_flights,
          canceledFlights: response.data.canceled_flights,
          totalRevenue: response.data.total_revenue,
          ticketSold: response.data.tickets_sold,
          customerGrowth: response.data.customer_growth,
          ticketData: response.data.ticket_data,
          revenueData: response.data.revenue_data,
          popularDestinations: response.data.popular_destinations
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard statistics');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="admin-dashboard">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="admin-dashboard">Error: {error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="stats-grid">
        <InfoCard 
          title="Completed Flights" 
          value={stats.completedFlights} 
          change="1.35%" 
          icon={<FaPlaneDeparture />} 
          up 
        />
        <InfoCard 
          title="Active Flights" 
          value={stats.activeFlights} 
          change="3.68%" 
          icon={<FaPlane />} 
          up 
        />
        <InfoCard 
          title="Canceled Flights" 
          value={stats.canceledFlights} 
          change="1.45%" 
          icon={<FaRegTimesCircle />} 
        />
        <InfoCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          change="5.94%" 
          icon={<FaDollarSign />} 
          up 
        />
      </div>

      <div className="dashboard-grid">
        <div className="map-card">
          <h4>Popular Destinations</h4>
          <img src={world} alt="World Map" className="map-img" />
          <div className="destination-stats">
            {stats.popularDestinations.map(([country, percent]) => (
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
            <h2>{stats.ticketSold.toLocaleString()} <span>Tickets Sold</span></h2>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={stats.ticketData}>
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
              <LineChart data={stats.revenueData}>
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
              <div className="needle" style={{ transform: `rotate(${stats.customerGrowth * 1.8}deg)` }} />
            </div>
            <h2>{stats.customerGrowth}%</h2>
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
