import React, { useState } from 'react';
import './AcdSchedule.css';
import line from '../../images/line.png';
import devider from '../../images/Divider.png';
import deviderv from '../../images/dividerv.png';
import { Link } from 'react-router-dom';
import FlightSearch from '../../components/forms/FlightSearch';

const flights = [
  { 
    id: 'SH-749789',
    departureTime: '6:00 AM', 
    departurePlace: 'Los Angeles', 
    arrivalTime: '9:00 PM', 
    arrivalPlace: 'New York', 
    duration: '13 hours',
    aircraft: 'Boeing 757 300',
    airline: 'Shqipe Airline',
    departureAirport: 'Los Angeles International Airport (LAX)',
    arrivalAirport: 'John F. Kennedy International Airport (JFK)',
    departureTerminal: 'Terminal B',
    arrivalTerminal: 'Terminal 4',
    date: 'June 1, 2025'
  },
  { 
    id: 'SH-749790',
    departureTime: '10:00 AM', 
    departurePlace: 'Tirana', 
    arrivalTime: '1:00 PM', 
    arrivalPlace: 'Berlin', 
    duration: '3 hours',
    aircraft: 'Airbus A320',
    airline: 'Shqipe Airline',
    departureAirport: 'Tirana International Airport (TIA)',
    arrivalAirport: 'Berlin Brandenburg Airport (BER)',
    departureTerminal: 'Terminal 1',
    arrivalTerminal: 'Terminal 2',
    date: 'June 2, 2025'
  },
];

const AcdSchedule = () => {
  const [searchResults, setSearchResults] = useState(flights);

  return (
    <div className="schedule-page">
      <FlightSearch setResults={setSearchResults} flights={flights} />
      <h1>Flight Schedule</h1>
      {searchResults.length === 0 ? (
        <p>No flights found for the selected search criteria.</p>
      ) : (
        searchResults.map((flight) => (
          <div className="schedule-content" key={flight.id}>
            <div className="schedule-info">
              <div className="info-flight">
                <h2>{flight.airline}</h2>
                <h5>Flight {flight.id}</h5>
              </div>
              <img src={deviderv} alt="divider vertical" />
              <div className="info-flight">
                <h2>{flight.departureTime}</h2>
                <h5>{flight.departurePlace}</h5>
              </div>
              <div className="info-flight-route">
                <img src={line} alt="airplane route" />
                <h6>{flight.duration} - Direct</h6>
              </div>
              <div className="info-flight">
                <h2>{flight.arrivalTime}</h2>
                <h5>{flight.arrivalPlace}</h5>
              </div>
            </div>
            <img src={devider} alt="divider" className="divider" />
            <Link to={`flight-details/${flight.id}`} className="view-button">
              View Details
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default AcdSchedule;
