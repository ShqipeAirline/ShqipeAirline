import React, { useState, useEffect } from 'react';
import './AcdFlights.css';
import { FaPen } from 'react-icons/fa';
import axios from '../../api/axios';

const AcdUpdateFlight = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFlight, setEditFlight] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await axios.get('/flights');
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
    }
  };

  const handleEdit = (flight) => {
    setEditFlight(flight);
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    setProcessing(true);
    try {
      const updatedFields = {
        flight_number: editFlight.flight_number?.trim(),
        airline: editFlight.airline?.trim(),
        departure_airport: editFlight.departure_airport?.trim(),
        departure_country: editFlight.departure_country?.trim(),
        arrival_airport: editFlight.arrival_airport?.trim(),
        arrival_country: editFlight.arrival_country?.trim(),
        departure_date: editFlight.departure_date,
        departure_time: editFlight.departure_time,
        arrival_time: editFlight.arrival_time,
        available_seats: parseInt(editFlight.available_seats, 10),
        total_capacity: parseInt(editFlight.total_capacity, 10),
        base_price: parseFloat(editFlight.base_price),
        status: editFlight.status?.trim()
      };

      // Clean and validate the data
      Object.keys(updatedFields).forEach(key => {
        const value = updatedFields[key];
        
        if (value === undefined || value === null || value === '') {
          delete updatedFields[key];
          return;
        }

        // Validate numeric fields
        if (['available_seats', 'total_capacity'].includes(key)) {
          if (isNaN(value) || value < 0) {
            delete updatedFields[key];
            return;
          }
        }

        // Validate base_price
        if (key === 'base_price') {
          if (isNaN(value) || value < 0) {
            delete updatedFields[key];
            return;
          }
        }

        // Validate date and time fields
        if (['departure_date', 'arrival_date'].includes(key)) {
          if (!value || !Date.parse(value)) {
            delete updatedFields[key];
            return;
          }
        }

        if (['departure_time', 'arrival_time'].includes(key)) {
          if (!value || !value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
            delete updatedFields[key];
            return;
          }
        }
      });

      // Validate arrival time is after departure time
      if (updatedFields.departure_date && updatedFields.arrival_date && 
          updatedFields.departure_time && updatedFields.arrival_time) {
        const departureDateTime = new Date(`${updatedFields.departure_date}T${updatedFields.departure_time}`);
        const arrivalDateTime = new Date(`${updatedFields.arrival_date}T${updatedFields.arrival_time}`);
        
        if (arrivalDateTime <= departureDateTime) {
          alert('Arrival time must be after departure time');
          setProcessing(false);
          return;
        }
      }

      // Validate available seats is not greater than total capacity
      if (updatedFields.available_seats !== undefined && updatedFields.total_capacity !== undefined) {
        if (updatedFields.available_seats > updatedFields.total_capacity) {
          alert('Available seats cannot be greater than total capacity');
          setProcessing(false);
          return;
        }
      }

      await axios.put(`/flights/${editFlight.flight_id}`, updatedFields);
      await fetchFlights();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating flight:', error.response?.data || error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="add-flight">
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
                  <button className="update-button" onClick={() => handleEdit(flight)}>
                    <FaPen className="edit-icon" /> Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && editFlight && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <h3>Edit Flight Details</h3>
            <div className="form-group">
              <label>Flight Number:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.flight_number}
                onChange={(e) => setEditFlight({...editFlight, flight_number: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Airline:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.airline}
                onChange={(e) => setEditFlight({...editFlight, airline: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Departure Airport:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.departure_airport}
                onChange={(e) => setEditFlight({...editFlight, departure_airport: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Departure Country:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.departure_country}
                onChange={(e) => setEditFlight({...editFlight, departure_country: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Arrival Airport:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.arrival_airport}
                onChange={(e) => setEditFlight({...editFlight, arrival_airport: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Arrival Country:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.arrival_country}
                onChange={(e) => setEditFlight({...editFlight, arrival_country: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Departure Date:</label>
              <input 
                type="date" 
                className="form-input"
                value={editFlight.departure_date}
                onChange={(e) => setEditFlight({...editFlight, departure_date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Departure Time:</label>
              <input 
                type="time" 
                className="form-input"
                value={editFlight.departure_time}
                onChange={(e) => setEditFlight({...editFlight, departure_time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Arrival Time:</label>
              <input 
                type="time" 
                className="form-input"
                value={editFlight.arrival_time}
                onChange={(e) => setEditFlight({...editFlight, arrival_time: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Available Seats:</label>
              <input 
                type="number" 
                className="form-input"
                value={editFlight.available_seats}
                onChange={(e) => setEditFlight({...editFlight, available_seats: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Total Capacity:</label>
              <input 
                type="number" 
                className="form-input"
                value={editFlight.total_capacity}
                onChange={(e) => setEditFlight({...editFlight, total_capacity: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Base Price:</label>
                  <input 
                type="number" 
                step="0.01"
                    className="form-input"
                value={editFlight.base_price}
                onChange={(e) => setEditFlight({...editFlight, base_price: e.target.value})}
                  />
                </div>
            <div className="form-group">
              <label>Status:</label>
              <select 
                className="form-input"
                value={editFlight.status}
                onChange={(e) => setEditFlight({...editFlight, status: e.target.value})}
              >
                <option value="on-time">On Time</option>
                <option value="delayed">Delayed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="modal-actions">
              <button className="modal-button cancel" onClick={() => setShowEditModal(false)} disabled={processing}>
                Cancel
              </button>
              <button className="modal-button confirm" onClick={handleUpdate} disabled={processing}>
                {processing ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcdUpdateFlight;