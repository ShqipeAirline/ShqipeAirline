import React, { useState } from 'react';
import './AcdFlights.css';
import { FaPen } from 'react-icons/fa';

const flights = [
  { 
    id: 'SH-749789',
    departureTime: '06:00', 
    departurePlace: 'Los Angeles', 
    arrivalTime: '21:00', 
    arrivalPlace: 'New York', 
    duration: '13 hours',
    aircraft: 'Boeing 757 300',
    airline: 'Shqipe Airline',
    departureAirport: 'Los Angeles International Airport (LAX)',
    arrivalAirport: 'John F. Kennedy International Airport (JFK)',
    departureTerminal: 'Terminal B',
    arrivalTerminal: 'Terminal 4',
    date: '2025-06-01',
    capacity: '200',
    status: 'On Time'
  },
  { 
    id: 'SH-749790',
    departureTime: '10:00', 
    departurePlace: 'Tirana', 
    arrivalTime: '13:00', 
    arrivalPlace: 'Berlin', 
    duration: '3 hours',
    aircraft: 'Airbus A320',
    airline: 'Shqipe Airline',
    departureAirport: 'Tirana International Airport (TIA)',
    arrivalAirport: 'Berlin Brandenburg Airport (BER)',
    departureTerminal: 'Terminal 1',
    arrivalTerminal: 'Terminal 2',
    date: '2025-06-02',
    capacity: '180',
    status: 'Delayed'
  },
];

const AcdRemoveFlight = () => {
  const [searchResults, setSearchResults] = useState(flights);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);

  const handleDeleteClick = (flight) => {
    setFlightToDelete(flight);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setSearchResults(searchResults.filter(f => f.id !== flightToDelete.id));
    setShowDeleteModal(false);
  };

  return (
    <div className="add-flight">
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
              <th>Action</th>
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
                <td>
                  <button className="remove-button" onClick={() => handleDeleteClick(flight)}>
                     Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Do you want to delete flight number {flightToDelete?.id}?</p>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => setShowDeleteModal(false)}>
                No
              </button>
              <button className="modal-button confirm" onClick={handleConfirmDelete}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcdRemoveFlight;
