import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import './FlightDetails.css';
import api from '../../api/axios';

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

const FlightDetails = () => {
  const navigate = useNavigate();
  const {flight_id} = useParams();
  const [weatherData, setWeatherData] = useState({
    departure: { temp: '', condition: '', loading: true, error: null },
    arrival: { temp: '', condition: '', loading: true, error: null }
  });
  
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      if (!flight_id) {
        console.error('No flight ID provided');
        setError('No flight ID provided');
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get(`/flights/${flight_id}`);
        console.log('Received flight data:', data);
        setFlightData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flight data:', error);
        setError(error.response?.data?.message || 'Failed to fetch flight details');
        setLoading(false);
      }
    };

    fetchFlightData();
  }, [flight_id]);

  useEffect(() => {
    if (flightData) {
      fetchWeatherData();
    }
  }, [flightData]);

  const fetchWeatherData = async () => {
    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
      
      if (!API_KEY) {
        console.warn('Weather API key is missing. Weather information will not be available.');
        setWeatherData({
          departure: { 
            temp: 'N/A', 
            condition: 'sunny',
            loading: false, 
            error: 'Weather data unavailable' 
          },
          arrival: { 
            temp: 'N/A', 
            condition: 'sunny',
            loading: false, 
            error: 'Weather data unavailable' 
          }
        });
        return;
      }
      
      const departureResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${flightData.departure_country}&units=metric&appid=${API_KEY}`
      );
      
      if (!departureResponse.ok) {
        throw new Error(`Failed to fetch departure weather: ${departureResponse.statusText}`);
      }
      
      const departureData = await departureResponse.json();
      
      const arrivalResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${flightData.arrival_country}&units=metric&appid=${API_KEY}`
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
          temp: 'N/A', 
          condition: 'sunny',
          loading: false, 
          error: error.message 
        },
        arrival: { 
          temp: 'N/A', 
          condition: 'sunny',
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

  if (loading) {
    return (
      <div className="flight-details">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBack /> Back to Schedule
        </button>
        <p>Loading flight details...</p>
      </div>
    );
  }

  if (error || !flightData) {
    return (
      <div className="flight-details">
        <button className="back-button" onClick={() => navigate(-1)}>
          <IoArrowBack /> Back to Schedule
        </button>
        <p>{error || 'Flight not found.'}</p>
      </div>
    );
  }
  
  const getDuration = () => {
    return calculateDuration(flightData.departure_time, flightData.arrival_time);
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
            <span>{flightData.flight_number}</span>
            <span className="on-time-tag">{flightData.status}</span>
          </div>
        </div>
        <div className="header-date">
          <span>Date: {new Date(flightData.departure_date).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flight-card">
        <div className="flight-info-section">
          <div className="time-section">
            <div className="departure-time">
              <h3>Departure Time:</h3>
              <div className="time-value">{flightData.departure_time}</div>
              <div className="date-value">{new Date(flightData.departure_date).toLocaleDateString()}</div>
            </div>
            
            <div className="location-info">
              <div className="city-name">{flightData.departure_country}</div>
              <div className="airport-name">{flightData.departure_airport}</div>
            </div>
          </div>
          
          <div className="flight-details-row">
            <div className="details-item">
              <div className="info-label">Duration of flight:</div>
              <div className="info-value">{getDuration()}</div>
            </div>
            
            <div className="details-item">
              <div className="info-label">Available Seats</div>
              <div className="info-value">{flightData.available_seats} / {flightData.total_capacity}</div>
            </div>
            
            <div className="details-item">
              <div className="info-label">Base Price</div>
              <div className="info-value">${parseFloat(flightData.base_price).toFixed(2)}</div>
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
                    <div className="city-label">{flightData.departure_country}</div>
                    {getWeatherIcon('sunny')}
                    <span className="temp">N/A</span>
                  </div>
                ) : (
                  <div>
                    <div className="city-label">{flightData.departure_country}</div>
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
                    <div className="city-label">{flightData.arrival_country}</div>
                    {getWeatherIcon('sunny')}
                    <span className="temp">N/A</span>
                  </div>
                ) : (
                  <div>
                    <div className="city-label">{flightData.arrival_country}</div>
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
              <div className="time-value">{flightData.arrival_time}</div>
              <div className="date-value">{new Date(flightData.departure_date).toLocaleDateString()}</div>
            </div>
            
            <div className="location-info">
              <div className="city-name">{flightData.arrival_country}</div>
              <div className="airport-name">{flightData.arrival_airport}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
