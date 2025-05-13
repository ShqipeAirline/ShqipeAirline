import React, { useState, useEffect, useMemo } from 'react';
import styles from './PassengerDashboard.module.css';
import useUserStore from '../../store/userStore';
import api from '../../api/axios';

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

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const PassengerDashboard = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUserStore();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/user/${user.user_id}/bookings`);
        setBookings(data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [user]);

  const filteredBookings = useMemo(() => {
    const searchVal = debouncedSearch.toLowerCase();
    return bookings.filter(b => {
      const matchesSearch = b.bookings_id && String(b.bookings_id).includes(searchVal);
      const matchesStatus = statusFilter === 'All' || b.booking_status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, debouncedSearch, statusFilter]);

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
            placeholder="Search by booking ID..."
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
            <option value="confirmed">confirmed</option>
            <option value="canceled">canceled</option>
          </select>
        </div>
        {loading ? (
          <div>Loading bookings...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <table className={styles.purchasesTable}>
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Seat Number</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.bookings_id}>
                  <td>{b.bookings_id}</td>
                  <td>{b.seat_number}</td>
                  <td>{formatDate(b.booking_date)}</td>
                  <td>{`$${Number(b.total_price).toFixed(2)}`}</td>
                  <td>
                    <span className={
                      b.booking_status === 'Purchased' || b.booking_status === 'confirmed'
                        ? styles.statusPurchased
                        : styles.statusPending
                    }>
                      {capitalize(b.booking_status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <footer className={styles.dashboardFooter}>
       <a href="https://www.rentalcars.com/" target='_blank'> <button className={styles.footerBtn}>Find your ideal rental vehicle!</button></a>
        
        <a href="https://www.booking.com/index.en-gb.html?label=hotel_details-toHLT7%401746313574&sid=e696e4b3b26c9fb223e8f1522697a536&aid=898224" target='_blank'><button className={styles.footerBtn} >Discover the perfect hotel for you!</button></a>
      </footer>
    </>
  );
};

export default PassengerDashboard; 