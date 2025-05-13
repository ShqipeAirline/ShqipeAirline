import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PassangerFeedback.css';
import api from '../api/axios';
import useUserStore from '../store/userStore';
import Swal from 'sweetalert2';

const FeedbackForm = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [rating, setRating] = useState(0);
    const [comments, setComments] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isLoadingBookings, setIsLoadingBookings] = useState(true);

    useEffect(() => {
        const fetchCompletedBookings = async () => {
            try {
                const response = await api.get(`/user/${user.user_id}/bookings`);
                console.log(response.data);
                const confirmedBookings = response.data.filter(
                    booking => booking.booking_status === 'confirmed'
                );
                setBookings(confirmedBookings);
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load your bookings. Please try again.');
            } finally {
                setIsLoadingBookings(false);
            }
        };

        if (user?.user_id) {
            fetchCompletedBookings();
        }
    }, [user]);

    // Group bookings by flight number
    const groupedBookings = bookings.reduce((groups, booking) => {
        const flightNumber = booking.flight.flight_number;
        if (!groups[flightNumber]) {
            groups[flightNumber] = {
                flightNumber,
                departure: booking.flight.departure_airport,
                arrival: booking.flight.arrival_airport,
                bookings: []
            };
        }
        groups[flightNumber].bookings.push(booking);
        return groups;
    }, {});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!selectedFlight) {
            setError("Please select a flight");
            setLoading(false);
            return;
        }

        try {
            const feedbackData = {
                flight_id: selectedFlight.flight.flight_id,
                rating: rating,
                comments: comments,
                user_id: user.user_id
            };

            const response = await api.post(`/user/${user.user_id}/feedbacks`, feedbackData);
            
            if (response.data) {
                await Swal.fire({
                    title: 'Thank you!',
                    text: 'Your feedback has been submitted successfully.',
                    icon: 'success',
                    confirmButtonColor: '#E4C779',
                    confirmButtonText: 'OK'
                });
                navigate('/passenger-dashboard');
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
            setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isLoadingBookings) {
        return (
            <div className="feedback-container">
                <h2>Loading your bookings...</h2>
            </div>
        );
    }

    if (bookings.length === 0) {
        return (
            <div className="feedback-container">
                <h2>No Confirmed Flights</h2>
                <p>You don't have any confirmed flights to provide feedback for.</p>
                <button 
                    onClick={() => navigate('/passenger-dashboard')}
                    className="back-button"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="feedback-container">
            <div className="feedback-header">
                <h2>Flight Feedback</h2>
                <button 
                    onClick={() => navigate('/passenger-dashboard/feedbacks')}
                    className="view-feedbacks-button"
                >
                    View All Feedbacks
                </button>
            </div>
            {error && <div className="feedback-error">{error}</div>}
            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="flight-selection">
                    <label htmlFor="flight-select">Select Flight</label>
                    <select
                        id="flight-select"
                        value={selectedFlight?.bookings_id || ''}
                        onChange={(e) => {
                            const booking = bookings.find(b => b.bookings_id === parseInt(e.target.value));
                            setSelectedFlight(booking);
                        }}
                        required
                        className="flight-select"
                    >
                        <option value="">Select a flight</option>
                        {Object.values(groupedBookings).map((group) => (
                            <optgroup 
                                key={group.flightNumber} 
                                label={`${group.flightNumber} - ${group.departure} to ${group.arrival}`}
                            >
                                {group.bookings.map((booking) => (
                                    <option 
                                        key={booking.bookings_id} 
                                        value={booking.bookings_id}
                                    >
                                        {new Date(booking.flight.departure_date).toLocaleDateString()} - {booking.flight.departure_time}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>

                <div className="rating-container">
                    <label>Rating</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= rating ? 'filled' : ''}`}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <label htmlFor="comments">Comments</label>
                <textarea
                    id="comments"
                    rows="6"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    required
                    placeholder="Share your experience with us..."
                />

                <button 
                    type="submit" 
                    disabled={loading || rating === 0 || !selectedFlight}
                    className={loading ? 'loading' : ''}
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
