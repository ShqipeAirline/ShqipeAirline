import React, { useState, useEffect } from 'react';
import './AcdFlights.css';
import axios from '../../api/axios';
import { getUserRole, isAuthenticated } from '../../utils/auth';

const AcdRemoveFlight = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      setError('Please log in to access this feature');
      return;
    }
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('/flights');
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError('Failed to fetch flights. Please try again.');
    }
  };

  const handleDeleteClick = (flight) => {
    if (!isAuthenticated()) {
      setError('Please log in to delete flights');
      return;
    }

    const userRole = getUserRole();
    if (userRole !== 'admin' && userRole !== 'air control staff') {
      setError('You do not have permission to delete flights');
      return;
    }

    setFlightToDelete(flight);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!isAuthenticated()) {
      setError('Please log in to delete flights');
      return;
    }

    const userRole = getUserRole();
    if (userRole !== 'admin' && userRole !== 'air control staff') {
      setError('You do not have permission to delete flights');
      return;
    }

    setProcessing(true);
    setError(null);
    try {
      const response = await axios.delete(`/flights/${flightToDelete.flight_id}`);

      if (response.status === 200) {
        await fetchFlights();
        setShowDeleteModal(false);
        setFlightToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting flight:', error);
      if (error.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to delete flights');
      } else {
        setError(error.response?.data?.message || 'Failed to delete flight. Please try again.');
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="add-flight">
      {error && <div className="error-message">{error}</div>}
      <div className='flight-table'>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Flight Number</th>
              <th>Airline</th>
              <th>From</th>
              <th>To</th>
              <th>Date</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Available Seats</th>
              <th>Total Capacity</th>
              <th>Base Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((flight, index) => (
              <tr key={flight.flight_id}>
                <td>{index + 1}</td>
                <td>{flight.flight_number}</td>
                <td>{flight.airline}</td>
                <td>{flight.departure_country} ({flight.departure_airport})</td>
                <td>{flight.arrival_country} ({flight.arrival_airport})</td>
                <td>{flight.departure_date}</td>
                <td>{flight.departure_time}</td>
                <td>{flight.arrival_time}</td>
                <td>{flight.available_seats}</td>
                <td>{flight.total_capacity}</td>
                <td>${flight.base_price}</td>
                <td>{flight.status}</td>
                <td>
                  <button 
                    className="remove-button" 
                    onClick={() => handleDeleteClick(flight)}
                    disabled={processing}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showDeleteModal && flightToDelete && (
        <div className="modal-overlay">
          <div className="modal delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete flight {flightToDelete.flight_number}?</p>
            <p>This action cannot be undone.</p>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-actions">
              <button 
                className="modal-button cancel" 
                onClick={() => {
                  setShowDeleteModal(false);
                  setError(null);
                }}
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm" 
                onClick={handleConfirmDelete}
                disabled={processing}
              >
                {processing ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcdRemoveFlight;
