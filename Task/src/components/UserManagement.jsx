import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import '../stylePages/UserManagement.css';

function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [taskCounts, setTaskCounts] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data);
      
      const counts = {};
      for (const user of data) {
        try {
          const countData = await userAPI.getUserTaskCount(user._id);
          counts[user._id] = countData.taskCount;
        } catch (err) {
          counts[user._id] = 0;
        }
      }
      setTaskCounts(counts);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userAPI.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await userAPI.updateUserRole(userId, newRole);
      setUsers(prevUsers => prevUsers.map(u =>
        u._id === userId ? { ...u, role: newRole } : u
      ));
    } catch (error) {
      console.error('Error updating role:', error);
      alert(error.message || 'Failed to update role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserTaskCount = (userId) => {
    return taskCounts[userId] || 0;
  };

  if (currentUser.role !== 'admin') {
    return (
      <div className="user-management-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Only administrators can access user management.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management-container">
      <div className="user-management-header">
        <h2>User Management</h2>
        <div className="user-stats">
          <span className="stat">Total Users: {users.length}</span>
          <span className="stat admin">Admins: {users.filter(u => u.role === 'admin').length}</span>
          <span className="stat user">Users: {users.filter(u => u.role === 'user').length}</span>
        </div>
      </div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tasks Assigned</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-users">No users found</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user._id || user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.username}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                      className={`role-select role-${user.role}`}
                      disabled={(user._id || user.id) === currentUser.id}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className="task-badge">{getUserTaskCount(user._id || user.id)}</span>
                  </td>
                  <td>
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td>
                    <button
                      onClick={() => setShowDeleteConfirm(user._id || user.id)}
                      className="btn-delete-user"
                      disabled={(user._id || user.id) === currentUser.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="confirm-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">⚠️</div>
            <h3>Delete User</h3>
            <p>
              Are you sure you want to delete this user? All tasks assigned to this user will also be deleted.
              This action cannot be undone.
            </p>
            <div className="confirm-actions">
              <button onClick={() => setShowDeleteConfirm(null)} className="btn-cancel-confirm">
                Cancel
              </button>
              <button onClick={() => handleDeleteUser(showDeleteConfirm)} className="btn-confirm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
