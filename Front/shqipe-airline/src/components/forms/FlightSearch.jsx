import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "./../../pages/acd/AcdSchedule.css";
import deviderv from '../../images/dividerv.png';

export default function FlightSearch({ setResults, flights }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState(""); 
  const [date, setDate] = useState(""); 

  const handleSearch = () => {
    if (!from && !to && !date) {
      setResults(flights); 
      return;
    }

    const filteredFlights = flights.filter(
      (flight) =>
        (!from || flight.departurePlace.toLowerCase() === from.toLowerCase()) &&
        (!to || flight.arrivalPlace.toLowerCase() === to.toLowerCase())
    );

    setResults(filteredFlights);
  };

  return (
    <div className="flight-search-container">
      <div className="flight-search-fields">
        <div className="flight-search-group">
          <label>From</label>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            placeholder="Departure city"
          />
        </div>
        <button
          className="swap-button"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          <FaExchangeAlt />
        </button>
        <div className="flight-search-group">
          <label>To</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Arrival city"
          />
        </div>
        <img src={deviderv} alt="" />
        <div className="flight-search-group">
          <label>Departure Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
