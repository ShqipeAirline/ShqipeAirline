import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import { FaCalendarAlt, FaMoneyBillWave, FaPen } from 'react-icons/fa';
import './FlightDetails.css';

const calculateDuration = (departureTime, arrivalTime) => {
  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  };

  const departureMinutes = timeToMinutes(departureTime);
  const arrivalMinutes = timeToMinutes(arrivalTime);
  
  let diffMinutes = arrivalMinutes - departureMinutes;
  
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minute${minutes !== 1 ? 's' : ''}` : ''}`;
};

const initialFlightsData = [
  {
    flightNumber: 'SH-749789',
    airline: 'Shqipe Airline',
    aircraft: 'Boeing 757 300',
    class: 'Economy',
    date: 'June 1, 2025',
    departure: {
      city: 'Los Angeles',
      airport: 'Los Angeles International Airport (LAX)',
      terminal: 'Terminal B',
      time: '6:00 AM',
      date: '11 Jun 2025'
    },
    arrival: {
      city: 'New York',
      airport: 'John F. Kennedy International Airport (JFK)',
      terminal: 'Terminal 4',
      time: '9:00 PM',
      date: '11 Jun 2025'
    },
    duration: '13 hours',
    weather: {
      departure: {
        temp: '31°',
        condition: 'sunny'
      },
      arrival: {
        temp: '25°',
        condition: 'cloudy'
      }
    }
  },
  {
    flightNumber: 'SH-749790',
    airline: 'Shqipe Airline',
    aircraft: 'Airbus A320',
    class: 'Economy',
    date: 'June 2, 2025',
    departure: {
      city: 'Tirana',
      airport: 'Tirana International Airport (TIA)',
      terminal: 'Terminal 1',
      time: '10:00 AM',
      date: '2 Jun 2025'
    },
    arrival: {
      city: 'Berlin',
      airport: 'Berlin Brandenburg Airport (BER)',
      terminal: 'Terminal 2',
      time: '1:00 PM',
      date: '2 Jun 2025'
    },
    duration: '3 hours',
    weather: {
      departure: {
        temp: '28°',
        condition: 'sunny'
      },
      arrival: {
        temp: '22°',
        condition: 'cloudy'
      }
    }
  }
];

const FlightDetails = () => {
  const navigate = useNavigate();
  const { flightId } = useParams();
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newDepartureTime, setNewDepartureTime] = useState('');
  const [newArrivalTime, setNewArrivalTime] = useState('');
  const [editFlight, setEditFlight] = useState(null);
  const [weatherData, setWeatherData] = useState({
    departure: { temp: '', condition: '', loading: true, error: null },
    arrival: { temp: '', condition: '', loading: true, error: null }
  });
  
  const [flightsData, setFlightsData] = useState(initialFlightsData);
  const [flightData, setFlightData] = useState(
    flightsData.find(flight => flight.flightNumber === flightId)
  );

  useEffect(() => {
    if (flightData) {
      fetchWeatherData();
    }
  }, [flightData]);

  const fetchWeatherData = async () => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!API_KEY) {
        console.error('Weather API key is missing. Please check your .env file and ensure VITE_WEATHER_API_KEY is set.');
        throw new Error('Weather API key is missing');
      }
      
      const departureResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${flightData.departure.city}&units=metric&appid=${API_KEY}`
      );
      
      if (!departureResponse.ok) {
        throw new Error(`Failed to fetch departure weather: ${departureResponse.statusText}`);
      }
      
      const departureData = await departureResponse.json();
      
      const arrivalResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${flightData.arrival.city}&units=metric&appid=${API_KEY}`
      );
      
      if (!arrivalResponse.ok) {
        throw new Error(`Failed to fetch arrival weather: ${arrivalResponse.statusText}`);
      }
      
      const arrivalData = await arrivalResponse.json();
      
      setWeatherData({
        departure: {
          temp: `${Math.round(departureData.main.temp)}°`,
          condition: getWeatherCondition(departureData.weather[0].id),
          loading: false,
          error: null
        },
        arrival: {
          temp: `${Math.round(arrivalData.main.temp)}°`,
          condition: getWeatherCondition(arrivalData.weather[0].id),
          loading: false,
          error: null
        }
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData({
        departure: { 
          temp: flightData.weather.departure.temp, 
          condition: flightData.weather.departure.condition,
          loading: false, 
          error: error.message 
        },
        arrival: { 
          temp: flightData.weather.arrival.temp, 
          condition: flightData.weather.arrival.condition,
          loading: false, 
          error: error.message 
        }
      });
    }
  };
  
  const getWeatherCondition = (weatherId) => {
    if (weatherId >= 200 && weatherId < 300) return 'thunderstorm';
    if (weatherId >= 300 && weatherId < 600) return 'rain';
    if (weatherId >= 600 && weatherId < 700) return 'snow';
    if (weatherId >= 801 && weatherId < 900) return 'cloudy';
    return 'sunny';
  };
  
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'thunderstorm':
        return <WiThunderstorm className="weather-icon" />;
      case 'rain':
        return <WiRain className="weather-icon" />;
      case 'snow':
        return <WiSnow className="weather-icon" />;
      case 'cloudy':
        return <WiCloudy className="weather-icon" />;
      case 'sunny':
      default:
        return <WiDaySunny className="weather-icon" />;
    }
  };

  if (!flightData) {
    return (
      <div className="flight-details">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBack /> Back to Flight Schedule
        </button>
        <p>Flight not found.</p>
      </div>
    );
  }
  
  const getDuration = () => {
    return calculateDuration(flightData.departure.time, flightData.arrival.time);
  };

  const handleEdit = () => {
    setEditFlight({
      airline: flightData.airline,
      flightNumber: flightData.flightNumber,
      aircraft: flightData.aircraft,
      class: flightData.class,
      departureCity: flightData.departure.city,
      departureAirport: flightData.departure.airport,
      departureTerminal: flightData.departure.terminal,
      departureDate: flightData.departure.date,
      arrivalCity: flightData.arrival.city,
      arrivalAirport: flightData.arrival.airport,
      arrivalTerminal: flightData.arrival.terminal,
      arrivalDate: flightData.arrival.date
    });
    setShowEditModal(true);
  };

  const handleReschedule = () => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    
    const formattedDate = tomorrow.toISOString().split('T')[0];
    setNewDate(formattedDate);
    setNewDepartureTime(flightData.departure.time.replace(' AM', '').replace(' PM', ''));
    setNewArrivalTime(flightData.arrival.time.replace(' AM', '').replace(' PM', ''));
    setShowRescheduleModal(true);
  };

  const handleRefund = () => {
    setShowRefundModal(true);
  };

  const getFormattedTime = (time) => {
    const hour = parseInt(time.split(':')[0]);
    const minutes = time.split(':')[1];
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const confirmReschedule = () => {
    if (!newDate || !newDepartureTime || !newArrivalTime) {
      alert('Please fill in all fields');
      return;
    }
    
    setProcessing(true);
    setTimeout(() => {
      const formattedDate = new Date(newDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      const formattedDateFull = new Date(newDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      const formattedDepartureTime = getFormattedTime(newDepartureTime);
      const formattedArrivalTime = getFormattedTime(newArrivalTime);
      
      const updatedFlightsData = flightsData.map(flight => {
        if (flight.flightNumber === flightData.flightNumber) {
          return {
            ...flight,
            date: formattedDateFull,
            departure: {
              ...flight.departure,
              time: formattedDepartureTime,
              date: formattedDate
            },
            arrival: {
              ...flight.arrival,
              time: formattedArrivalTime,
              date: formattedDate
            }
          };
        }
        return flight;
      });
      
      setFlightsData(updatedFlightsData);
      setFlightData(updatedFlightsData.find(flight => flight.flightNumber === flightId));
      
      setProcessing(false);
      setShowRescheduleModal(false);
      alert(`Flight ${flightData.flightNumber} has been rescheduled. Departure: ${formattedDate} at ${formattedDepartureTime}, Arrival: ${formattedDate} at ${formattedArrivalTime}`);
    }, 1500);
  };

  const confirmRefund = () => {
    setProcessing(true);
    setTimeout(() => {
      const updatedFlightsData = flightsData.filter(
        flight => flight.flightNumber !== flightData.flightNumber
      );
      
      setFlightsData(updatedFlightsData);
      setProcessing(false);
      setShowRefundModal(false);
      alert(`Flight ${flightData.flightNumber} has been cancelled and all passengers will be refunded.`);
      navigate(-1);
    }, 1500);
  };

  const handleUpdateFlight = () => {
    setProcessing(true);
    setTimeout(() => {
      const updatedFlightsData = flightsData.map(flight => {
        if (flight.flightNumber === flightData.flightNumber) {
          return {
            ...flight,
            airline: editFlight.airline,
            flightNumber: editFlight.flightNumber,
            aircraft: editFlight.aircraft,
            class: editFlight.class,
            departure: {
              ...flight.departure,
              city: editFlight.departureCity,
              airport: editFlight.departureAirport,
              terminal: editFlight.departureTerminal,
              date: editFlight.departureDate
            },
            arrival: {
              ...flight.arrival,
              city: editFlight.arrivalCity,
              airport: editFlight.arrivalAirport,
              terminal: editFlight.arrivalTerminal,
              date: editFlight.arrivalDate
            }
          };
        }
        return flight;
      });
      
      setFlightsData(updatedFlightsData);
      setFlightData(updatedFlightsData.find(flight => flight.flightNumber === editFlight.flightNumber));
      
      setProcessing(false);
      setShowEditModal(false);
      alert(`Flight ${flightData.flightNumber} details have been updated.`);
    }, 1500);
  };

  return (
    <div className="flight-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        <IoArrowBack /> Back to Schedule
      </button>
      
      <div className="header-section">
        <div className="airline-info">
          <h2>{flightData.airline}</h2>
          <div className="flight-id">
            <span>{flightData.flightNumber}</span>
            <span className="on-time-tag">On Time</span>
          </div>
        </div>
        <div className="header-date">
          <span>Date: {flightData.date}</span>
        </div>
        <button className="edit-button" onClick={handleEdit}>
          <FaPen className="edit-icon" /> Edit
        </button>
      </div>

      <div className="flight-card">
        <div className="flight-info-section">
          <div className="time-section">
            <div className="departure-time">
              <h3>Departure Time:</h3>
              <div className="time-value">{flightData.departure.time}</div>
              <div className="date-value">{flightData.departure.date}</div>
            </div>
            
            <div className="location-info">
              <div className="city-name">{flightData.departure.city}</div>
              <div className="airport-name">{flightData.departure.airport}</div>
              <div className="terminal-info">{flightData.departure.terminal}</div>
            </div>
          </div>
          
          <div className="flight-details-row">
            <div className="details-item">
              <div className="info-label">Duration of flight:</div>
              <div className="info-value">{getDuration()}</div>
            </div>
            
            <div className="details-item">
              <div className="info-label">Aircraft Model</div>
              <div className="info-value">{flightData.aircraft}</div>
            </div>
            
            <div className="details-item">
              <div className="info-label">Class</div>
              <div className="info-value">{flightData.class}</div>
            </div>
          </div>
          
          <div className="weather-section">
            <div className="info-label">Weather update:</div>
            <div className="weather-cards">
              <div className={`weather-card ${weatherData.departure.condition}`}>
                {weatherData.departure.loading ? (
                  <div>Loading...</div>
                ) : weatherData.departure.error ? (
                  <div>
                    <div className="city-label">{flightData.departure.city}</div>
                    {getWeatherIcon(flightData.weather.departure.condition)}
                    <span className="temp">{flightData.weather.departure.temp}</span>
                  </div>
                ) : (
                  <div>
                    <div className="city-label">{flightData.departure.city}</div>
                    {getWeatherIcon(weatherData.departure.condition)}
                    <span className="temp">{weatherData.departure.temp}</span>
                  </div>
                )}
              </div>
              <div className={`weather-card ${weatherData.arrival.condition}`}>
                {weatherData.arrival.loading ? (
                  <div>Loading...</div>
                ) : weatherData.arrival.error ? (
                  <div>
                    <div className="city-label">{flightData.arrival.city}</div>
                    {getWeatherIcon(flightData.weather.arrival.condition)}
                    <span className="temp">{flightData.weather.arrival.temp}</span>
                  </div>
                ) : (
                  <div>
                    <div className="city-label">{flightData.arrival.city}</div>
                    {getWeatherIcon(weatherData.arrival.condition)}
                    <span className="temp">{weatherData.arrival.temp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="time-section">
            <div className="arrival-time">
              <h3>Arrival Time:</h3>
              <div className="time-value">{flightData.arrival.time}</div>
              <div className="date-value">{flightData.arrival.date}</div>
            </div>
            
            <div className="location-info">
              <div className="city-name">{flightData.arrival.city}</div>
              <div className="airport-name">{flightData.arrival.airport}</div>
              <div className="terminal-info">{flightData.arrival.terminal}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className="action-button reschedule" onClick={handleReschedule}>
          <FaCalendarAlt className="action-icon" />
          <span>Reschedule</span>
        </button>
        <button className="action-button refund" onClick={handleRefund}>
          <FaMoneyBillWave className="action-icon" />
          <span>Cancel & Refund</span>
        </button>
      </div>

      {showRescheduleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Reschedule Flight</h3>
            <p>Select a new date and times for flight {flightData.flightNumber}:</p>
            
            <div className="form-group">
              <label htmlFor="new-date">New Flight Date:</label>
              <input 
                type="date" 
                id="new-date" 
                className="form-input"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="new-departure-time">New Departure Time:</label>
                <input 
                  type="time" 
                  id="new-departure-time" 
                  className="form-input"
                  value={newDepartureTime}
                  onChange={(e) => setNewDepartureTime(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-arrival-time">New Arrival Time:</label>
                <input 
                  type="time" 
                  id="new-arrival-time" 
                  className="form-input"
                  value={newArrivalTime}
                  onChange={(e) => setNewArrivalTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="info-box">
              <div className="info-item">
                <span className="info-label">From:</span>
                <span className="info-value">{flightData.departure.city}</span>
              </div>
              <div className="info-item">
                <span className="info-label">To:</span>
                <span className="info-value">{flightData.arrival.city}</span>
              </div>
            </div>
            
            <p className="note">Note: All passengers will be notified of this change.</p>
            
            <div className="modal-actions">
              <button 
                className="modal-button cancel" 
                onClick={() => setShowRescheduleModal(false)}
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm" 
                onClick={confirmReschedule}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Cancel Flight and Issue Refunds</h3>
            <p>Are you sure you want to cancel flight {flightData.flightNumber}?</p>
            <p>This action will:</p>
            <ul className="action-list">
              <li>Cancel the scheduled flight</li>
              <li>Issue automatic refunds to all passengers</li>
              <li>Send cancellation notifications to all passengers</li>
            </ul>
            <p className="warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                className="modal-button cancel" 
                onClick={() => setShowRefundModal(false)}
                disabled={processing}
              >
                Go Back
              </button>
              <button 
                className="modal-button confirm danger" 
                onClick={confirmRefund}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Cancel Flight'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showEditModal && editFlight && (
        <div className="modal-overlay">
          <div className="modal edit-modal">
            <h3>Edit Flight Details</h3>
            
            <div className="form-row">
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
                <label>Flight Number:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editFlight.flightNumber}
                  onChange={(e) => setEditFlight({...editFlight, flightNumber: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Aircraft:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editFlight.aircraft}
                  onChange={(e) => setEditFlight({...editFlight, aircraft: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Class:</label>
                <select 
                  className="form-input"
                  value={editFlight.class}
                  onChange={(e) => setEditFlight({...editFlight, class: e.target.value})}
                >
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First Class">First Class</option>
                </select>
              </div>
            </div>
            
            <h4>Departure</h4>
            <div className="form-row">
              <div className="form-group">
                <label>City:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editFlight.departureCity}
                  onChange={(e) => setEditFlight({...editFlight, departureCity: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Airport:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editFlight.departureAirport}
                  onChange={(e) => setEditFlight({...editFlight, departureAirport: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Terminal:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.departureTerminal}
                onChange={(e) => setEditFlight({...editFlight, departureTerminal: e.target.value})}
              />
            </div>
            
            <h4>Arrival</h4>
            <div className="form-row">
              <div className="form-group">
                <label>City:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editFlight.arrivalCity}
                  onChange={(e) => setEditFlight({...editFlight, arrivalCity: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Airport:</label>
                <input 
                  type="text" 
                  className="form-input"
                  value={editFlight.arrivalAirport}
                  onChange={(e) => setEditFlight({...editFlight, arrivalAirport: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Terminal:</label>
              <input 
                type="text" 
                className="form-input"
                value={editFlight.arrivalTerminal}
                onChange={(e) => setEditFlight({...editFlight, arrivalTerminal: e.target.value})}
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-button cancel" 
                onClick={() => setShowEditModal(false)}
                disabled={processing}
              >
                Cancel
              </button>
              <button 
                className="modal-button confirm" 
                onClick={handleUpdateFlight}
                disabled={processing}
              >
                {processing ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightDetails;
