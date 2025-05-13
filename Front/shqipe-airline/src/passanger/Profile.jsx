import React, { useState, useEffect } from "react";
import "./Profile.css";
import { FaPencilAlt } from "react-icons/fa";
import api from '../api/axios';
import useUserStore from '../store/userStore';
import Swal from 'sweetalert2';

export default function Profile() {
  const { user, updateUser } = useUserStore();
  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user/${user.user_id}`);
        const userData = {
          ...response.data,
          gender: response.data.gender || 'Male'
        };
        setUserData(userData);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data. Please try again.');
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to load user data. Please try again.',
          icon: 'error',
          confirmButtonColor: '#E4C779'
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      fetchUserData();
    }
  }, [user]);

  const openModal = () => {
    // Ensure gender is set when opening modal
    setEditUser({ 
      ...userData,
      gender: userData.gender || 'Male'
    });
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const updateData = {
        first_name: editUser.first_name,
        last_name: editUser.last_name,
        email: editUser.email,
        birthday: editUser.date_of_birth,
        gender: editUser.gender || 'Male',
        password: editUser.password || undefined
      };

      console.log('Sending update data:', updateData);
      
      const response = await api.put(`/user/${user.user_id}`, updateData);
      
      if (response.data) {
        setUserData(response.data);
        updateUser({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email
        });
        setModalOpen(false);
        await Swal.fire({
          title: 'Success!',
          text: 'Your profile has been updated successfully.',
          icon: 'success',
          confirmButtonColor: '#E4C779'
        });
      }
    } catch (err) {
      console.error('Error updating user data:', err);
      console.error('Error response:', err.response?.data);
      const errorMessage = err.response?.data?.message || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      await Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#E4C779'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData) {
    return (
      <div className="user-manage">
        <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="user-manage">
        <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="user-manage">
      <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userData && (
              <tr>
                <td>{userData.first_name}</td>
                <td>{userData.last_name}</td>
                <td>{userData.email}</td>
                <td>{"•".repeat(8)}</td>
                <td>
                  <button className="edit-btn" onClick={openModal}>
                    <FaPencilAlt />
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editUser.first_name}
                onChange={(e) => setEditUser({ ...editUser, first_name: e.target.value })}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                value={editUser.last_name}
                onChange={(e) => setEditUser({ ...editUser, last_name: e.target.value })}
                placeholder="Last Name"
                required
              />
              <input
                type="date"
                value={editUser.date_of_birth}
                onChange={(e) => setEditUser({ ...editUser, date_of_birth: e.target.value })}
                required
              />
              <select
                value={editUser.gender || 'Male'}
                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={editUser.password || ''}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                placeholder="New Password (leave blank to keep current)"
                minLength={6}
              />
              
              <div className="modal-buttons">
                <button 
                  type="submit" 
                  className="btn-update"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)} 
                  className="btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
