import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../api/axios';
import './TransactionStyles.css';

const timeRanges = [
  { label: 'Last Week', value: 'week' },
  { label: 'Last Month', value: 'month' },
  { label: 'Last 6 Months', value: '6months' },
  { label: 'Last Year', value: 'year' }
];

export default function AdminReports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState('month');

  useEffect(() => {
    fetchStats();
  }, [selectedRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/dashboard/stats?range=${selectedRange}`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      alert('Failed to fetch statistics');
    }
    setLoading(false);
  };

  const generatePDF = () => {
    if (!stats) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.text('Shqipe Airline Statistical Report', pageWidth / 2, 20, { align: 'center' });
    
    // Date Range
    doc.setFontSize(12);
    doc.text(`Report Period: ${timeRanges.find(range => range.value === selectedRange).label}`, pageWidth / 2, 30, { align: 'center' });
    
    // Flight Statistics
    doc.setFontSize(16);
    doc.text('Flight Statistics', 20, 45);
    doc.setFontSize(12);
    doc.text(`Completed Flights: ${stats.completed_flights}`, 20, 55);
    doc.text(`Active Flights: ${stats.active_flights}`, 20, 60);
    doc.text(`Canceled Flights: ${stats.canceled_flights}`, 20, 65);

    // Revenue Statistics
    doc.setFontSize(16);
    doc.text('Revenue Statistics', 20, 80);
    doc.setFontSize(12);
    doc.text(`Total Revenue: $${stats.total_revenue.toFixed(2)}`, 20, 90);
    doc.text(`Tickets Sold: ${stats.tickets_sold}`, 20, 95);
    doc.text(`Customer Growth: ${stats.customer_growth}%`, 20, 100);

    // Popular Destinations
    doc.setFontSize(16);
    doc.text('Popular Destinations', 20, 115);
    doc.setFontSize(12);
    stats.popular_destinations.forEach((dest, index) => {
      doc.text(`${dest[0]}: ${dest[1]}`, 20, 125 + (index * 5));
    });

    // Monthly Data Tables
    doc.setFontSize(16);
    doc.text('Monthly Ticket Sales', 20, 160);
    const ticketData = stats.ticket_data.map(item => [item.name, item.tickets.toString()]);
    autoTable(doc, {
      startY: 165,
      head: [['Month', 'Tickets Sold']],
      body: ticketData,
    });

    doc.setFontSize(16);
    doc.text('Monthly Revenue', 20, doc.lastAutoTable.finalY + 15);
    const revenueData = stats.revenue_data.map(item => [
      item.name,
      `$${item.income.toFixed(2)}`,
      `$${item.expense.toFixed(2)}`
    ]);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Month', 'Income', 'Expense']],
      body: revenueData,
    });

    // Save the PDF
    doc.save(`shqipe-airline-report-${selectedRange}.pdf`);
  };

  return (
    <div className="reports-container">
      <h1 className="text-2xl font-bold mb-4">Statistical Reports</h1>
      
      <div className="reports-controls">
        <select 
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="report-select"
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
        
        <button 
          onClick={generatePDF}
          disabled={loading || !stats}
          className="download-btn"
        >
          {loading ? 'Loading...' : 'Download PDF Report'}
        </button>
      </div>

      {stats && (
        <div className="stats-preview">
          <div className="stats-card">
            <h3>Flight Statistics</h3>
            <p>Completed Flights: {stats.completed_flights}</p>
            <p>Active Flights: {stats.active_flights}</p>
            <p>Canceled Flights: {stats.canceled_flights}</p>
          </div>

          <div className="stats-card">
            <h3>Revenue Statistics</h3>
            <p>Total Revenue: ${stats.total_revenue.toFixed(2)}</p>
            <p>Tickets Sold: {stats.tickets_sold}</p>
            <p>Customer Growth: {stats.customer_growth}%</p>
          </div>

          <div className="stats-card">
            <h3>Popular Destinations</h3>
            {stats.popular_destinations.map((dest, index) => (
              <p key={index}>{dest[0]}: {dest[1]}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 