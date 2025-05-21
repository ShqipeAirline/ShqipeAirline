import React, { useState, useEffect } from "react";
import "./TransactionStyles.css";
import { FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import api from '../api/axios';

const roleOptions = ["Passenger", "Admin", "AirControl Dept"];

const roleMapping = {
  "Passenger": "user",
  "Admin": "admin",
  "AirControl Dept": "air control staff"
};

const roleEndpoints = {
  "user": {
    get: '/users',
    post: '/users',
    delete: (id) => `/user/${id}`,
    idField: 'user_id',
  },
  "admin": {
    get: '/admin',
    post: '/admin',
    delete: (id) => `/admin/${id}`,
    idField: 'admin_id',
  },
  "air control staff": {
    get: '/aircontrol',
    post: '/aircontrol',
    delete: (id) => `/aircontrol/${id}`,
    idField: 'staff_id',
  },
};

export default function UserManage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      (user.first_name || user.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.last_name || user.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.role || user.status || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchAllUsers = async () => {
    try {
      const all = [];
      for (const role of roleOptions) {
        const res = await api.get(roleEndpoints[roleMapping[role]].get);
        const data = res.data.map(u => {
          let displayRole;
          if (u.role === 'air control staff') {
            displayRole = 'AirControl Dept';
          } else if (u.role === 'admin') {
            displayRole = 'Admin';
          } else if (u.role === 'user') {
            displayRole = 'Passenger';
          } else {
            if (roleEndpoints[roleMapping[role]].get.includes('admin')) {
              displayRole = 'Admin';
            } else if (roleEndpoints[roleMapping[role]].get.includes('aircontrol')) {
              displayRole = 'AirControl Dept';
            } else {
              displayRole = 'Passenger';
            }
          }
          return { ...u, role: displayRole };
        });
        all.push(...data);
      }
      setUsers(all);
      setFilteredUsers(all);
    } catch (error) {
      console.error('Fetch users error:', error);
      alert("Failed to fetch users");
    }
  };

  const openAddModal = () => {
    setEditUser({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      birthday: "",
      gender: "Male",
      role: "user"
    });
    setModalOpen(true);
  };

  const handleAdd = async () => {
    try {
      const displayRole = editUser.role;
      const dbRole = roleMapping[displayRole];
      const endpoint = roleEndpoints[dbRole].post;

      // Base payload with common fields
      const basePayload = {
        email: editUser.email,
        password: editUser.password,
        first_name: editUser.first_name,
        last_name: editUser.last_name
      };

      // Prepare specific payload based on role
      let payload;
      if (dbRole === 'admin') {
        payload = {
          ...basePayload,
          username: editUser.email.split('@')[0]
        };
      } else if (dbRole === 'air control staff') {
        payload = {
          ...basePayload,
          username: editUser.email.split('@')[0],
          phone_number: editUser.phone_number || null,
          department: 'Flight Operations',
          admin_id: 1
        };
      } else {
        // For regular users
        payload = {
          ...basePayload,
          phone_number: editUser.phone_number || null,
          date_of_birth: editUser.date_of_birth || null,
          account_status: 1  // Active by default
        };
      }

      console.log('Adding new user with payload:', payload);

      // Remove undefined or empty fields
      Object.keys(payload).forEach(key => {
        if (payload[key] === undefined || payload[key] === "") {
          delete payload[key];
        }
      });

      const response = await api.post(endpoint, payload);
      console.log('User added successfully:', response.data);
      setModalOpen(false);
      fetchAllUsers();
    } catch (error) {
      console.error('Add user error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      alert(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      // Determine the role based on the user object properties
      let dbRole;
      if (user.admin_id) {
        dbRole = 'admin';
      } else if (user.staff_id) {
        dbRole = 'air control staff';
      } else {
        dbRole = 'user';
      }
      
      const idField = roleEndpoints[dbRole].idField;
      const id = user[idField];
      
      console.log('Deleting user:', {
        user,
        dbRole,
        idField,
        id,
        endpoint: roleEndpoints[dbRole].delete(id)
      });
      
      await api.delete(roleEndpoints[dbRole].delete(id));
      fetchAllUsers();
    } catch (error) {
      console.error('Delete user error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="user-manage">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        <button className="add-user-btn" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaPlus /> Add User
        </button>
      </div>
      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={idx}>
                <td>{user.first_name || user.firstName}</td>
                <td>{user.last_name || user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.role || (user.admin_id ? 'Admin' : user.staff_id ? 'AirControl Dept' : 'Passenger')}</td>
                <td>
                  <button className="transaction-delete-button" onClick={() => handleDelete(user)} title="Delete User">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add User</h2>
            <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
              <input
                type="text"
                value={editUser.first_name || editUser.firstName || ''}
                onChange={e => setEditUser({ ...editUser, first_name: e.target.value })}
                placeholder="First Name"
                required
              />
              <input
                type="text"
                value={editUser.last_name || editUser.lastName || ''}
                onChange={e => setEditUser({ ...editUser, last_name: e.target.value })}
                placeholder="Last Name"
                required
              />
              <input
                type="email"
                value={editUser.email}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={editUser.password}
                onChange={e => setEditUser({ ...editUser, password: e.target.value })}
                placeholder="Password"
                required
              />
              <select
                value={editUser.role}
                onChange={e => setEditUser({ ...editUser, role: e.target.value })}
                required
              >
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              <input
                type="text"
                value={editUser.phone_number || ''}
                onChange={e => setEditUser({ ...editUser, phone_number: e.target.value })}
                placeholder="Phone Number"
              />
              <input
                type="date"
                value={editUser.date_of_birth || ''}
                onChange={e => setEditUser({ ...editUser, date_of_birth: e.target.value })}
                placeholder="Date of Birth"
              />
              <button type="submit" className="btn-update">Add</button>
              <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
