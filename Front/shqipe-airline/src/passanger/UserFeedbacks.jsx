import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserFeedbacks.css';
import api from '../api/axios';
import useUserStore from '../store/userStore';
import { FaStar, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UserFeedbacks = () => {
    const { user } = useUserStore();
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await api.get(`/user/${user.user_id}/feedbacks`);
                setFeedbacks(response.data);
            } catch (err) {
                console.error('Error fetching feedbacks:', err);
                setError('Failed to load your feedbacks. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.user_id) {
            fetchFeedbacks();
        }
    }, [user]);

    const handleDelete = async (feedbackId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#E4C779',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) {
            return;
        }

        setDeleteLoading(feedbackId);
        try {
            await api.delete(`/user/${user.user_id}/feedbacks/${feedbackId}`);
            setFeedbacks(feedbacks.filter(f => f.feedback_id !== feedbackId));
            
            await Swal.fire({
                title: 'Deleted!',
                text: 'Your feedback has been deleted.',
                icon: 'success',
                confirmButtonColor: '#E4C779'
            });
        } catch (err) {
            console.error('Error deleting feedback:', err);
            setError('Failed to delete feedback. Please try again.');
            
            await Swal.fire({
                title: 'Error!',
                text: 'Failed to delete feedback. Please try again.',
                icon: 'error',
                confirmButtonColor: '#E4C779'
            });
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="feedbacks-container">
                <h2>Loading your feedbacks...</h2>
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="feedbacks-container">
                <h2>No Feedbacks</h2>
                <p>You haven't submitted any feedbacks yet.</p>
                <button 
                    onClick={() => navigate('/passenger-dashboard/feedback')}
                    className="submit-feedback-button"
                >
                    Submit Feedback
                </button>
            </div>
        );
    }

    return (
        <div className="feedbacks-container">
            <div className="feedbacks-header">
                <h2>Your Feedbacks</h2>
                <button 
                    onClick={() => navigate('/passenger-dashboard/feedback')}
                    className="submit-feedback-button"
                >
                    Submit New Feedback
                </button>
            </div>

            {error && <div className="feedback-error">{error}</div>}

            <div className="feedbacks-list">
                {feedbacks.map((feedback) => (
                    <div key={feedback.feedback_id} className="feedback-card">
                        <div className="feedback-header">
                            <div className="flight-info">
                                <h3>{feedback.flight.flight_number}</h3>
                                <p>{feedback.flight.departure_airport} → {feedback.flight.arrival_airport}</p>
                            </div>
                            <div className="feedback-rating">
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        className={index < feedback.rating ? 'star-filled' : 'star-empty'}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="feedback-content">
                            <p className="feedback-comment">{feedback.comments}</p>
                            <p className="feedback-date">Submitted on {formatDate(feedback.feedback_date)}</p>
                        </div>

                        <button
                            className="delete-button"
                            onClick={() => handleDelete(feedback.feedback_id)}
                            disabled={deleteLoading === feedback.feedback_id}
                        >
                            {deleteLoading === feedback.feedback_id ? (
                                'Deleting...'
                            ) : (
                                <>
                                    <FaTrash /> Delete
                                </>
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserFeedbacks; 