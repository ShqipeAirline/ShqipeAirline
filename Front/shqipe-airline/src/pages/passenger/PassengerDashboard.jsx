import React, { useState } from 'react';
import styles from './PassengerDashboard.module.css';

const promoDestinations = [
  {
    city: 'Rome',
    period: 'July 4, 2025 - August 15, 2025',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  },
  {
    city: 'Berlin',
    period: 'June 10, 2025 - September 10, 2025',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b',
  },
  {
    city: 'Athens',
    period: 'April 25, 2024 - May 5, 2025',
    image: 'https://images.unsplash.com/photo-1505731139091-635cabd21a00',
  },
  {
    city: 'Lugano',
    period: 'October 1, 2025 - November 15, 2025',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
  },
  {
    city: 'Paris',
    period: 'October 1, 2025 - October 15, 2025',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  },
  {
    city: 'London',
    period: 'April 1, 2025 - April 17, 2025',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
  },
];

// temp booking data matching backend fields from booking.py
const bookingsData = [
  {
    bookings_id: 1,
    flight_id: 101,
    seat_number: '12A',
    extra_baggage: 1,
    travel_insurance: 1,
    booking_status: 'Purchased',
    booking_date: '2028-07-20T00:00:00Z',
    total_price: 500.00,
    user_id: 201,
    // for table display only:
    booking_code: 'CN-KL2345',
    route: 'Frankfurt to Bangkok',
  },
  {
    bookings_id: 2,
    flight_id: 101,
    seat_number: '12B',
    extra_baggage: 0,
    travel_insurance: 0,
    booking_status: 'Pending',
    booking_date: '2028-07-20T00:00:00Z',
    total_price: 500.00,
    user_id: 201,
    booking_code: 'CN-KL2345',
    route: 'Frankfurt to Bangkok',
  },
];

const PassengerDashboard = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBookings = bookingsData.filter(b => {
    const matchesSearch = b.booking_code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.booking_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format date for display
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <section className={styles.promosSection}>
        {promoDestinations.map((dest, idx) => (
          <div className={styles.promoCard} key={idx}>
            <img src={dest.image} alt={dest.city} className={styles.promoImage} />
            <div className={styles.promoLabel}>PROMO</div>
            <div className={styles.promoInfo}>
              <div className={styles.promoCity}>{dest.city} <span className={styles.promoPeriod}>- Promo Period</span></div>
              <div className={styles.promoDates}>{dest.period}</div>
            </div>
          </div>
        ))}
      </section>
      <section className={styles.purchasesSection}>
        <div className={styles.purchasesHeader}>
          <h3>Purchases</h3>
        </div>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Search by booking code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', minWidth: 180 }}
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            <option value="All">All Statuses</option>
            <option value="Purchased">Purchased</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
        <table className={styles.purchasesTable}>
          <thead>
            <tr>
              <th>Booking Code</th>
              <th>Route</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b, idx) => (
              <tr key={b.bookings_id}>
                <td>{b.booking_code}</td>
                <td>{b.route}</td>
                <td>{formatDate(b.booking_date)}</td>
                <td>{`$${Number(b.total_price).toFixed(2)}`}</td>
                <td>
                  <span className={b.booking_status === 'Purchased' ? styles.statusPurchased : styles.statusPending}>
                    {b.booking_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <footer className={styles.dashboardFooter}>
       <a href="https://www.rentalcars.com/" target='_blank'> <button className={styles.footerBtn}>Find your ideal rental vehicle!</button></a>
        
        <a href="https://www.booking.com/index.en-gb.html?label=hotel_details-toHLT7%401746313574&sid=e696e4b3b26c9fb223e8f1522697a536&aid=898224" target='_blank'><button className={styles.footerBtn} >Discover the perfect hotel for you!</button></a>
      </footer>
    </>
  );
};

export default PassengerDashboard; 