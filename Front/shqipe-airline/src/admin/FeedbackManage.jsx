import React, { useState, useEffect } from "react";
import "./TransactionStyles.css";
import { FaSearch, FaStar } from "react-icons/fa";
import api from '../api/axios';

export default function FeedbackManage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [flights, setFlights] = useState({});

  useEffect(() => {
    fetchFeedbacks();
    fetchFlights();
  }, []);

  useEffect(() => {
    const filtered = feedbacks.filter(feedback => {
      const flightInfo = flights[feedback.flight_id] || {};
      return (
        (feedback.comments || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flightInfo.flight_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (flightInfo.airline || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredFeedbacks(filtered);
  }, [searchTerm, feedbacks, flights]);

  const fetchFlights = async () => {
    try {
      const response = await api.get('/flights');
      const flightsMap = {};
      response.data.forEach(flight => {
        flightsMap[flight.flight_id] = flight;
      });
      setFlights(flightsMap);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await api.get('/feedbacks');
      setFeedbacks(response.data);
      setFilteredFeedbacks(response.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      alert("Failed to fetch feedbacks");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        className={index < rating ? "star-filled" : "star-empty"}
        style={{ color: index < rating ? "#FFD700" : "#ccc" }}
      />
    ));
  };

  return (
    <div className="feedback-manage">
      <h1 className="text-2xl font-bold mb-4">Feedback Management</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </div>
      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>Flight</th>
              <th>Airline</th>
              <th>User</th>
              <th>Rating</th>
              <th>Comments</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((feedback) => {
              const flight = flights[feedback.flight_id] || {};
              return (
                <tr key={feedback.feedback_id}>
                  <td>{flight.flight_number}</td>
                  <td>{flight.airline}</td>
                  <td>{feedback.user?.first_name} {feedback.user?.last_name}</td>
                  <td>
                    <div className="star-rating">
                      {renderStars(feedback.rating)}
                    </div>
                  </td>
                  <td>{feedback.comments}</td>
                  <td>{formatDate(feedback.feedback_date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 