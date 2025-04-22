import React, { useState } from "react";
import "./TransactionStyles.css";
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
  },
  {
    firstName: "Elena",
    lastName: "Winston",
    birthday: "1988-10-22",
    gender: "Female",
    email: "elena.winston@example.com",
    password: "elenaWin88",
    status: "Passenger",
  },
  {
    firstName: "Roger",
    lastName: "Piston",
    birthday: "1979-04-12",
    gender: "Male",
    email: "roger.piston@example.com",
    password: "rogerP79",
    status: "Admin",
  },
  {
    firstName: "Paula",
    lastName: "Ortega",
    birthday: "1990-08-09",
    gender: "Female",
    email: "paula.ortega@example.com",
    password: "paulaO90",
    status: "Passenger",
  },
  {
    firstName: "Jackie",
    lastName: "Long",
    birthday: "1985-12-17",
    gender: "Female",
    email: "jackie.long@example.com",
    password: "jackieL85",
    status: "AirControl Dept",
  },
  {
    firstName: "Oscar",
    lastName: "Bolster",
    birthday: "1993-11-03",
    gender: "Male",
    email: "oscar.bolster@example.com",
    password: "oscarB93",
    status: "Passenger",
  },
  {
    firstName: "Yuri",
    lastName: "Wakamura",
    birthday: "1996-06-27",
    gender: "Male",
    email: "yuri.wakamura@example.com",
    password: "yuriW96",
    status: "Admin",
  },
  {
    firstName: "Santo",
    lastName: "Reagan",
    birthday: "1987-01-15",
    gender: "Male",
    email: "santo.reagan@example.com",
    password: "santoR87",
    status: "AirControl Dept",
  },
  {
    firstName: "Vicky",
    lastName: "Wisteria",
    birthday: "1991-09-11",
    gender: "Female",
    email: "vicky.wisteria@example.com",
    password: "vickyW91",
    status: "Passenger",
  },
  {
    firstName: "Adam",
    lastName: "Stewart",
    birthday: "1983-05-06",
    gender: "Male",
    email: "adam.stewart@example.com",
    password: "adamS83",
    status: "Admin",
  },
  {
    firstName: "Marcus",
    lastName: "Levin",
    birthday: "1994-02-19",
    gender: "Male",
    email: "marcus.levin@example.com",
    password: "marcusL94",
    status: "Passenger",
  },
  {
    firstName: "Lindsey",
    lastName: "Carder",
    birthday: "1997-07-08",
    gender: "Female",
    email: "lindsey.carder@example.com",
    password: "lindseyC97",
    status: "AirControl Dept",
  },
];

export default function UserManage() {
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

  const handleDelete = () => {
    const updatedUsers = users.filter((_, idx) => idx !== editIndex);
    setUsers(updatedUsers);
    setModalOpen(false);
  };

  return (
    <div className="user-manage">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
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
              <select
                value={editUser.status}
                onChange={(e) => setEditUser({ ...editUser, status: e.target.value })}
              >
                <option>Passenger</option>
                <option>Admin</option>
                <option>AirControl Dept</option>
              </select>
            </form>
            <div className="modal-buttons">
              <button onClick={handleUpdate} className="btn-update">Update</button>
              <button onClick={handleDelete} className="btn-delete">Remove</button>
              <button onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
