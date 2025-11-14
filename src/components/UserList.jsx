import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Spinner from './Spinner';
import AuthContext from '../context/AuthContext';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const { user: currentUser } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authorized to view this page.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not authorized to perform this action.');
      return;
    }

    try {
      const res = await axios.put(
        `${API_URL}/api/users/${userId}`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the user in the local state to reflect the change
      setUsers(users.map(user => user._id === userId ? res.data.data : user));
      setEditingUserId(null); // Exit editing mode
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user role.');
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setSelectedRole(user.role);
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setSelectedRole('');
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not authorized to perform this action.');
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the user from the local state to update the UI
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div className="user-list-container">
      <h3>User Management</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Faculty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {editingUserId === user._id ? (
                  <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                    <option value="student">student</option>
                    <option value="supervisor">supervisor</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td>{user.faculty}</td>
              <td>
                {editingUserId === user._id ? (
                  <>
                    <button onClick={() => handleRoleChange(user._id)} className="btn btn-sm btn-success">Save</button>
                    <button onClick={cancelEditing} className="btn btn-sm btn-secondary" style={{ marginLeft: '5px' }}>Cancel</button>
                  </>
                ) : user._id === currentUser?._id ? (
                  <span className="text-muted">Cannot edit self</span>
                ) : (
                  <div className="action-buttons">
                    <button onClick={() => startEditing(user)} className="btn btn-sm btn-secondary">
                      Edit Role
                    </button>
                    <button onClick={() => handleDeleteUser(user._id)} className="btn btn-sm btn-danger" style={{ marginLeft: '5px' }}>Delete</button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;