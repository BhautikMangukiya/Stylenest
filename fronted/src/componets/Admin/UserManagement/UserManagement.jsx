import React, { useState } from 'react';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([
    {
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      role: "customer",
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    };

    setUsers([...users, newUser]);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'customer',
    });
  };

  const handleDelete = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
  };

  return (
    <div className="user-management">
      {/* Heading */}
      <div className="heading">
        <h1>User Management</h1>
      </div>

      {/* Add New User Form */}
      <div className="form-section">
        <h3 className="form-heading">Add New User</h3>
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">Add User</button>
        </form>
      </div>

      {/* User List */}
      <div className="user-list">
        <h3>User List</h3>
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(index)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No users available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
