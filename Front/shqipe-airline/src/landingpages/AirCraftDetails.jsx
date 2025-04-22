import React from 'react'
import './AircraftDetails.css'
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
  )
}

export default AircraftDetails
