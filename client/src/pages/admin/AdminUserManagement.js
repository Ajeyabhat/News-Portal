import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import './UserManagement.css';

const UserManagement = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
      toast.success('User promoted to admin successfully!');
    } catch (err) {
      console.error('Error promoting user:', err);
      toast.error('Failed to promote user.');
    }
  };
  
  const handleDeleteClick = (userId, userName) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/users/${userToDelete.id}`);
      fetchUsers();
      toast.success('User deleted successfully!');
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Failed to delete user.');
    } finally {
      setIsDeleting(false);
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
                   <button onClick={() => handleDeleteClick(user._id, user.username)} className="delete-user-btn">
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

      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
      />
    </div>
  );
};

export default UserManagement;