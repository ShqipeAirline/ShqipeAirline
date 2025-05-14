import React, { useState, useEffect } from "react";
import "./TransactionStyles.css";
import api from '../api/axios';
import { FaTrash, FaSearch } from 'react-icons/fa';

const getStatusClass = (status) => {
  switch (status) {
    case "completed": return "badge badge-confirmed";
    case "pending": return "badge badge-pending";
    case "cancelled": return "badge badge-cancelled";
    default: return "badge";
  }
};

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search term
    const filtered = transactions.filter(tx => 
      tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(filtered);
  }, [searchTerm, transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/admin/transactions');
      setTransactions(response.data);
      setFilteredTransactions(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.response?.data?.message || 'Failed to load transactions');
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      // Update transaction status
      await api.put('/admin/transactions', {
        transaction_id: transactionId,
        status: newStatus
      });
      
      // Find the transaction to get the booking ID
      const transaction = transactions.find(tx => tx.transaction_id === transactionId);
      if (transaction) {
        // Extract booking ID from booking code (format: BK-XXXXXX)
        const bookingId = parseInt(transaction.booking_code.split('-')[1]);
        
        // Update booking status based on transaction status
        const bookingStatus = newStatus === 'completed' ? 'confirmed' : 
                            newStatus === 'cancelled' ? 'cancelled' : 'pending';
        
        try {
          await api.put(`/admin/bookings/${bookingId}`, {
            booking_status: bookingStatus
          });
        } catch (bookingErr) {
          console.error('Error updating booking status:', bookingErr);
          // Continue with transaction update even if booking update fails
        }
      }
      
      // Update local state
      setTransactions(prevTransactions => 
        prevTransactions.map(tx => 
          tx.transaction_id === transactionId 
            ? { ...tx, status: newStatus }
            : tx
        )
      );
    } catch (err) {
      console.error('Error updating transaction status:', err);
      alert(err.response?.data?.message || 'Failed to update transaction status');
    }
  };

  const handleDelete = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/admin/transactions/${transactionId}`);
        // Update local state
        setTransactions(prevTransactions => 
          prevTransactions.filter(tx => tx.transaction_id !== transactionId)
        );
        setFilteredTransactions(prevTransactions => 
          prevTransactions.filter(tx => tx.transaction_id !== transactionId)
        );
      } catch (err) {
        console.error('Error deleting transaction:', err);
        alert(err.response?.data?.message || 'Failed to delete transaction');
      }
    }
  };

  if (loading) {
    return <div className="transaction">Loading transactions...</div>;
  }

  if (error) {
    return <div className="transaction">Error: {error}</div>;
  }

  return (
    <div className="transaction">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Booking Code</th>
              <th>Airline</th>
              <th>Route</th>
              <th>Billing Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Change Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx) => (
              <tr key={tx.transaction_id}>
                <td>{tx.name}</td>
                <td>{tx.booking_code}</td>
                <td>{tx.airline}</td>
                <td>{tx.route}</td>
                <td>{tx.billing_date}</td>
                <td>{tx.amount}</td>
                <td><span className={getStatusClass(tx.status)}>{tx.status}</span></td>
                <td>
                  <select
                    value={tx.status}
                    className={`select-status status-${tx.status.toLowerCase()}`}
                    onChange={(e) => handleStatusChange(tx.transaction_id, e.target.value)}
                  >
                    <option value="completed" className="select-status status-confirmed">Completed</option>
                    <option value="pending" className="select-status status-pending">Pending</option>
                    <option value="cancelled" className="select-status status-cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <button
                    className="transaction-delete-button"
                    onClick={() => handleDelete(tx.transaction_id)}
                    title="Delete Transaction"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
