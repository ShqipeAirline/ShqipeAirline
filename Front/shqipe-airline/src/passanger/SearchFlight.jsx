import React, { useState, useEffect } from 'react';
import './SearchFlight.css';
import line from '../images/line.png';
import devider from '../images/Divider.png';
import deviderv from '../images/dividerv.png';
import { Link } from 'react-router-dom';
import FlightSearch from '../components/forms/FlightSearch';
import useUserStore from '../store/userStore';
import api from '../api/axios';

const SearchFlight = () => {
  const [flights, setFlights] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await api.get('/flights');
        console.log(data);
        setFlights(data);
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flights:', error);
        setError(error.response?.data?.message || 'Failed to fetch flights. Please try again later.');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFlights();
    } else {
      setError('Please login to view flights');
      setLoading(false);
    }
  }, [isAuthenticated]);

  const formatDateTime = (dateString, timeString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString(undefined, options);
    return `${formattedDate} at ${timeString}`;
  };

  if (loading) {
    return <div className="schedule-page">Loading flights...</div>;
  }

  if (error) {
    return <div className="schedule-page">{error}</div>;
  }

  return (
    <div className="schedule-page">
      <FlightSearch setResults={setSearchResults} flights={flights} />
      <h1>Flight Schedule</h1>
      {searchResults.length === 0 ? (
        <p>No flights found for the selected search criteria.</p>
      ) : (
        searchResults.map((flight) => (
          <div className="schedule-content" key={flight.flight_id}>
            <div className="schedule-info">
              <div className="info-flight">
                <h2>{flight.airline}</h2>
                <h5>Flight {flight.flight_number}</h5>
                <p className="flight-date">{formatDateTime(flight.departure_date, flight.departure_time)}</p>
              </div>
              <img src={deviderv} alt="divider vertical" />
              <div className="info-flight">
                <h2>{flight.departure_time}</h2>
                <h5>{flight.departure_airport}</h5>
                <p className="country-info">{flight.departure_country}</p>
              </div>
              <div className="info-flight-route">
                <img src={line} alt="airplane route" />
                <h6>{flight.duration} - Direct</h6>
              </div>
              <div className="info-flight">
                <h2>{flight.arrival_time}</h2>
                <h5>{flight.arrival_airport}</h5>
                <p className="country-info">{flight.arrival_country}</p>
              </div>
            </div>
            <img src={devider} alt="divider" className="divider" />
            <div className="flight-price">
              <span className="price-label">From</span>
              <span className="price-amount">${parseFloat(flight.base_price).toFixed(2)}</span>
            </div>
            <Link 
              to="/passenger-dashboard/book-flight" 
              state={{ flight }} 
              className="book-button"
            >
              Book 
            </Link>
            <Link 
              to={`/passenger-dashboard/view-flight/${flight.flight_id}`}
              state={{ flight }} 
              className="book-button"
            >
              View details 
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchFlight;
