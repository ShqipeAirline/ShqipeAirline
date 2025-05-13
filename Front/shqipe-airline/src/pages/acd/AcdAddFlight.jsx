import React, { useState, useEffect } from 'react';
import './AcdFlights.css';
import { Link } from 'react-router-dom';
import axios from '../../api/axios'
import useUserStore from '../../store/userStore';

const AcdAddFlight = () => {
  const { user } = useUserStore();
  const [searchResults, setSearchResults] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [addFlight, setAddFlight] = useState({
    flight_number: '',
    airline: '',
    departure_airport: '',
    departure_country: '',
    arrival_airport: '',
    arrival_country: '',
    departure_date: '',
    departure_time: '',
    arrival_time: '',
    available_seats: '',
    total_capacity: '',
    base_price: '',
    status: 'on-time',
    created_by: user?.user_id || 1
  });

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await axios.get('/flights');
        console.log(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching flights:', error);
      }
    };

    fetchFlights();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const flightData = {
        ...addFlight,
        created_by: user?.user_id || 1
      };
      await axios.post('/flights', flightData);
      // Refresh the flights list
      const response = await axios.get('/flights');
      setSearchResults(response.data);
      setShowEditModal(false);
      // Reset form
      setAddFlight({
        flight_number: '',
        airline: '',
        departure_airport: '',
        departure_country: '',
        arrival_airport: '',
        arrival_country: '',
        departure_date: '',
        departure_time: '',
        arrival_time: '',
        available_seats: '',
        total_capacity: '',
        base_price: '',
        status: 'on-time',
        created_by: user?.user_id || 1
      });
    } catch (error) {
      console.error('Error adding flight:', error);
    }
  };

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <h3>Add New Flight</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Flight Number:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={addFlight.flight_number}
                  onChange={(e) => setAddFlight({...addFlight, flight_number: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Airline:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={addFlight.airline}
                  onChange={(e) => setAddFlight({...addFlight, airline: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departure Airport:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={addFlight.departure_airport}
                  onChange={(e) => setAddFlight({...addFlight, departure_airport: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departure Country:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={addFlight.departure_country}
                  onChange={(e) => setAddFlight({...addFlight, departure_country: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Arrival Airport:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={addFlight.arrival_airport}
                  onChange={(e) => setAddFlight({...addFlight, arrival_airport: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Arrival Country:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={addFlight.arrival_country}
                  onChange={(e) => setAddFlight({...addFlight, arrival_country: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departure Date:</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={addFlight.departure_date}
                  onChange={(e) => setAddFlight({...addFlight, departure_date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Departure Time:</label>
                <input 
                  type="time" 
                  className="form-input"
                  value={addFlight.departure_time}
                  onChange={(e) => setAddFlight({...addFlight, departure_time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Arrival Time:</label>
                <input 
                  type="time" 
                  className="form-input"
                  value={addFlight.arrival_time}
                  onChange={(e) => setAddFlight({...addFlight, arrival_time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Seats:</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={addFlight.available_seats}
                  onChange={(e) => setAddFlight({...addFlight, available_seats: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Capacity:</label>
                <input 
                  type="number" 
                  className="form-input"
                  value={addFlight.total_capacity}
                  onChange={(e) => setAddFlight({...addFlight, total_capacity: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Base Price:</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input"
                  value={addFlight.base_price}
                  onChange={(e) => setAddFlight({...addFlight, base_price: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select 
                  className="form-input"
                  value={addFlight.status}
                  onChange={(e) => setAddFlight({...addFlight, status: e.target.value})}
                  required
                >
                  <option value="on-time">On Time</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-button cancel" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-button confirm">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcdAddFlight;
