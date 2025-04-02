import React, { useState } from 'react';
import './AcdFlights.css';
import { Link } from 'react-router-dom';

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
    date: 'June 1, 2025',
    capacity: '200',
    status: 'On Time'
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
    date: 'June 2, 2025',
    capacity: '180',
    status: 'Delayed'
  },
];

const AcdAddFlight = () => {
  const [searchResults, setSearchResults] = useState(flights);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addFlight, setAddFlight] = useState({
    flightNumber: '',
    departurePlace: '',
    arrivalPlace: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    capacity: '',
    status: ''
  });

  const handleEdit = () => {
    setShowEditModal(true);
  };

  return (
    <div className="add-flight">
      <button className="add-button" onClick={handleEdit}>
        + Add Flight
      </button>
      <div className='flight-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Flight no.</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Departure time</th>
              <th>Arrival time</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((flight, index) => (
              <tr key={flight.id}>
                <td>{index + 1}</td>
                <td>{flight.id}</td>
                <td>{flight.departurePlace}</td>
                <td>{flight.arrivalPlace}</td>
                <td>{flight.date}</td>
                <td>{flight.departureTime}</td>
                <td>{flight.arrivalTime}</td>
                <td>{flight.capacity}</td>
                <td>{flight.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <h3>Add New Flight</h3>
            <div className="form-group">
              <label>Flight Number:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.flightNumber}
                onChange={(e) => setAddFlight({...addFlight, flightNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Source:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.departurePlace}
                onChange={(e) => setAddFlight({...addFlight, departurePlace: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Destination:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.arrivalPlace}
                onChange={(e) => setAddFlight({...addFlight, arrivalPlace: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input 
                type="date" 
                className="form-input"
                value={addFlight.date}
                onChange={(e) => setAddFlight({...addFlight, date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Departure Time:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.departureTime}
                onChange={(e) => setAddFlight({...addFlight, departureTime: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Arrival Time:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.arrivalTime}
                onChange={(e) => setAddFlight({...addFlight, arrivalTime: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Capacity:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.capacity}
                onChange={(e) => setAddFlight({...addFlight, capacity: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status:</label>
              <input 
                type="text" 
                className="form-input"
                value={addFlight.status}
                onChange={(e) => setAddFlight({...addFlight, status: e.target.value})}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="modal-button confirm">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcdAddFlight;
