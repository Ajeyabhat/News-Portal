import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/ConfirmModal';
import { Users, Shield, Trash2, Search, Crown, Building2, CheckCircle2, Circle } from 'lucide-react';


const UserManagement = () => {
  const { user: loggedInUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bulkAction, setBulkAction] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (err) { console.error('Error fetching users:', err); }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Toggle single user selection
  const toggleUserSelection = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      const allUserIds = new Set(users.map(u => u._id));
      setSelectedUsers(allUserIds);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) {
      toast.error('No users selected');
      return;
    }
    setBulkAction('delete');
    setShowDeleteModal(true);
  };

  // Confirm bulk delete
  const handleConfirmBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.post('/api/users/bulk-delete', { 
        userIds: Array.from(selectedUsers) 
      });
      fetchUsers();
      setSelectedUsers(new Set());
      toast.success(`${selectedUsers.size} user(s) deleted successfully!`);
      setShowDeleteModal(false);
      setBulkAction(null);
    } catch (err) {
      console.error('Error deleting users:', err);
      toast.error('Failed to delete users.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-lg">
            <Users className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
              Manage users {selectedUsers.size > 0 && `(${selectedUsers.size} selected)`}
            </p>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {selectedUsers.size > 0 && (
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-800 shadow-md">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {selectedUsers.size} user(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedUsers(new Set())}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-white font-semibold rounded-lg transition-all duration-300"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid gap-4">
        {users.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
              <button
                onClick={toggleSelectAll}
                className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                {selectedUsers.size === users.length ? (
                  <CheckCircle2 className="w-6 h-6 text-blue-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {selectedUsers.size === users.length ? 'Unselect All' : 'Select All'}
              </span>
            </div>

            {/* User List */}
            {users.map(user => (
              <div
                key={user._id}
                className={`bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border ${
                  selectedUsers.has(user._id)
                    ? 'border-blue-500 bg-blue-50 dark:bg-slate-700'
                    : 'border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Checkbox + User Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleUserSelection(user._id)}
                      className="flex-shrink-0 mt-1 p-1 hover:bg-gray-100 dark:hover:bg-slate-600 rounded transition-colors"
                    >
                      {selectedUsers.has(user._id) ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {user.username}
                        </h3>
                        {loggedInUser && user._id === loggedInUser._id && (
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-medium rounded-full">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2">
                        {user.role === 'Admin' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-md">
                            <Crown className="w-3 h-3" />
                            Admin
                          </div>
                        ) : user.role === 'Institution' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-semibold rounded-full shadow-md">
                            <Building2 className="w-3 h-3" />
                            Institution
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                            <Users className="w-3 h-3" />
                            Reader
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Delete Button */}
                  {loggedInUser && user._id !== loggedInUser._id && !selectedUsers.has(user._id) && (
                    <button
                      onClick={() => {
                        setSelectedUsers(new Set([user._id]));
                        setBulkAction('delete');
                        setShowDeleteModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title={bulkAction === 'delete' ? `Delete ${selectedUsers.size} User(s)?` : 'Delete User'}
        message={bulkAction === 'delete' 
          ? `Are you sure you want to delete ${selectedUsers.size} user(s)? This action cannot be undone.`
          : `Are you sure you want to delete this user? This action cannot be undone.`
        }
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => {
          setShowDeleteModal(false);
          setBulkAction(null);
        }}
      />
    </div>
  );
};

export default UserManagement;