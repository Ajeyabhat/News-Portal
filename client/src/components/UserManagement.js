import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './UserManagement.css';

const UserManagement = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (err) { console.error('Error fetching users:', err); }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromote = async (userId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userId}/role`, { role: 'Admin' });
      fetchUsers();
    } catch (err) {
      console.error('Error promoting user:', err);
      alert('Failed to promote user.');
    }
  };
  
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user.');
      }
    }
  };

  return (
    <div className="user-management">
      <h2>User Management</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td className="action-cell">
                {/* Show Promote button for Readers */}
                {user.role === 'Reader' && (
                  <button onClick={() => handlePromote(user._id)} className="promote-btn">
                    Promote
                  </button>
                )}
                
                {/* Show Delete button for any user that is NOT the currently logged-in user */}
                {loggedInUser && user._id !== loggedInUser._id && (
                   <button onClick={() => handleDelete(user._id)} className="delete-user-btn">
                    Delete
                  </button>
                )}

                {/* New: Show a placeholder for the admin's own row to fix alignment */}
                {loggedInUser && user._id === loggedInUser._id && (
                   <span>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;