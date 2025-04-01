import { useState } from "react";
import { FaExchangeAlt } from "react-icons/fa";
import "./../../pages/acd/AcdSchedule.css";

const flights = [
  {  departurePlace: "Tirana", arrivalPlace: "Berlin", duration: "3 hours" },
  {  departurePlace: "London",  arrivalPlace: "Rome", duration: "3.5 hours" },
  {  departurePlace: "Paris",  arrivalPlace: "New York", duration: "6.5 hours" },
];

export default function FlightSearch({ setResults }) {
  const [from, setFrom] = useState(""); // Default empty
  const [to, setTo] = useState(""); // Default empty
  const [seatClass, setSeatClass] = useState(""); // Default empty

  const handleSearch = () => {
    if (!from && !to && !date) {
      setResults(flights); // Show all flights if no input is provided
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
        <div className="flight-search-group">
          <label>Seat Class</label>
          <select
            value={seatClass}
            onChange={(e) => setSeatClass(e.target.value)}
          >
            <option value="">Select a seat class</option>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First Class">First Class</option>
          </select>
        </div>
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
}
