import React, { useState } from "react";
import "./Profile.css";
import { FaPencilAlt } from "react-icons/fa";

const initialUsers = [
  {
    firstName: "Paris",
    lastName: "Milton",
    birthday: "1992-03-15",
    gender: "Female",
    email: "paris.milton@example.com",
    password: "pMilton92",
    status: "Passenger",
  }
];

export default function Profile() {
  const [users, setUsers] = useState(initialUsers);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const openModal = (user, index) => {
    setEditUser({ ...user });
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedUsers = [...users];
    updatedUsers[editIndex] = editUser;
    setUsers(updatedUsers);
    setModalOpen(false);
  };

  

  return (
    <div className="user-manage">
      <h1 className="text-2xl font-bold mb-4">Profile Management</h1>
      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birthday</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Password</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.birthday}</td>
                <td>{user.gender}</td>
                <td>{user.email}</td>
                <td>{"•".repeat(user.password.length)}</td>
                <td>{user.status}</td>
                <td>
                  <button className="edit-btn" onClick={() => openModal(user, idx)}>
                    <FaPencilAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-overlay"> {/* Modal background */}
          <div className="modal-content"> {/* Modal content */}
            <h2>Edit User</h2>
            <form>
              <input
                type="text"
                value={editUser.firstName}
                onChange={(e) => setEditUser({ ...editUser, firstName: e.target.value })}
                placeholder="First Name"
              />
              <input
                type="text"
                value={editUser.lastName}
                onChange={(e) => setEditUser({ ...editUser, lastName: e.target.value })}
                placeholder="Last Name"
              />
              <input
                type="date"
                value={editUser.birthday}
                onChange={(e) => setEditUser({ ...editUser, birthday: e.target.value })}
              />
              <select
                value={editUser.gender}
                onChange={(e) => setEditUser({ ...editUser, gender: e.target.value })}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
              />
              <input
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                placeholder="Password"
              />
              
             
            </form>
            <div className="modal-buttons">
              <button onClick={handleUpdate} className="btn-update">Update</button>
              
              <button onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
