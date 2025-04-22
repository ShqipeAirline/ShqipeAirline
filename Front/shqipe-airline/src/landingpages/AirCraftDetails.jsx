import React from 'react'
import './AircraftDetails.css'
import earth from '../images/earth.png'
import shqipelogo from '../images/shqipelogo.png'
import aircraft1 from '../images/aircraft1.png'
import aircraft2 from '../images/aircraft2.png'
import aircraft3 from '../images/aircraft3.png'

const AircraftDetails = () => {
  const aircraftData = [
    {
      name: 'Boeing 737 MAX 10',
      img: aircraft1,
      details: {
        capacity: 186,
        fuel: '25941.00 L',
        load: '88030.00 Kg',
        speed: '838 Kmph',
        manufacturer: 'Boeing Commercial',
      },
    },
    {
      name: 'Boeing 757 300',
      img: aircraft2,
      details: {
        capacity: 242,
        fuel: '43400.00 L',
        load: '123830.00 Kg',
        speed: '918 Kmph',
        manufacturer: 'Boeing Commercial',
      },
    },
    {
      name: 'Airbus A380 800',
      img: aircraft3,
      details: {
        capacity: 568,
        fuel: '323456.00 L',
        load: '570000.00 Kg',
        speed: '903 Kmph',
        manufacturer: 'Airbus',
      },
    },
  ]

  return (
    <>
    
      <section className="aircraft-cards">
        {aircraftData.map((aircraft, idx) => (
          <div className="aircraft-card" key={idx}>
            <img src={aircraft.img} alt={aircraft.name} />
            <h2>{aircraft.name}</h2>
            <ul className="aircraft-specs">
              <li><strong>Max Passenger Capacity:</strong> {aircraft.details.capacity}</li>
              <li><strong>Fuel Capacity:</strong> {aircraft.details.fuel}</li>
              <li><strong>Max Load:</strong> {aircraft.details.load}</li>
              <li><strong>Avg Air Speed:</strong> {aircraft.details.speed}</li>
              <li><strong>Manufacturer:</strong> {aircraft.details.manufacturer}</li>
            </ul>
          </div>
        ))}
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={shqipelogo} alt="Shqipe Airline" />
            <p>Flying the Shqipe Way – Bold, Fast, Free!</p>
            <div className="social-icons">
              <a href="#">🔗</a>
              <a href="#">🔗</a>
              <a href="#">🔗</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Address</h4>
            <p>Autostrada Tirane-Rinas, km 12, 1000</p>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li>Home</li>
              <li>Aircraft Details</li>
              <li>Minishop</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <p>+355 69 666 1995</p>
            <p>shqipeairlinevip@gmail.com</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default AircraftDetails
