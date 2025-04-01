import React from 'react';
import './AcdSchedule.css';
import line from '../../images/line.png';
import devider from '../../images/Divider.png';
import deviderv from '../../images/dividerv.png';
import { Link } from 'react-router-dom';

const flights = [
  { departureTime: '10:00', departurePlace: 'Tirana', arrivalTime: '13:00', arrivalPlace: 'Berlin', duration: '3 hours' },
  { departureTime: '12:30', departurePlace: 'London', arrivalTime: '16:00', arrivalPlace: 'Rome', duration: '3.5 hours' },
  { departureTime: '14:15', departurePlace: 'Paris', arrivalTime: '18:45', arrivalPlace: 'New York', duration: '6.5 hours' },
];

const AcdSchedule = () => {
  return (
    <div className="schedule-page">
      <h1>Flight Schedule</h1>
      {flights.map((flight, index) => (
        <div className="schedule-content" key={index}>
          <div className="schedule-info">
            <div className='info-flight'>
              <h2>Shqipe Airline</h2>
              <h5>Flight {index + 1}</h5>
            </div>
            <img src={deviderv} alt="divider vertical" />
            <div className='info-flight'>
              <h2>{flight.departureTime}</h2>
              <h5>{flight.departurePlace}</h5>
            </div>
            <div className='info-flight-route'>
              <img src={line} alt="airplane route" />
              <h6>{flight.duration} - Direct</h6>
            </div>
            <div className='info-flight'>
              <h2>{flight.arrivalTime}</h2>
              <h5>{flight.arrivalPlace}</h5>
            </div>
          </div>
          <img src={devider} alt="divider" className='divider' />
          <Link className="view-button">View Details</Link>
        </div>
      ))}
    </div>
  );
};

export default AcdSchedule;
