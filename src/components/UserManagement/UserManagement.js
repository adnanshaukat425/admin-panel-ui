import React, { useState, useEffect } from 'react';
import userManagementService from '../../services/userManagementService';
import staticDataService from '../../services/staticDataService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    bio: '',
    gender: '',
    phoneNumber: '',
    roleId: '',
    profilePicture: null
  });

  // Fetch users on component mount and page change
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await userManagementService.getUsers({page, pageSize});
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await staticDataService.getRoles();
      setRoles(response.data || []);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
      // Not setting error state to avoid blocking the entire UI
    }
  };

  const handleViewUser = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userManagementService.getUserDetails(userId);
      setSelectedUser(response.data);
      setIsViewModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to fetch user details');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await userManagementService.createUser(newUser);
      setIsCreateModalOpen(false);
      fetchUsers(); // Refresh the list
      setNewUser({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '', 
        bio: '', 
        gender: '', 
        phoneNumber: '', 
        roleId: '',
        profilePicture: null 
      });
    } catch (err) {
      setError(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, profilePicture: file });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>User Management</h2>
        <button 
          className="btn-primary" 
          onClick={() => setIsCreateModalOpen(true)}
        >
          <i className="fas fa-plus"></i> Add User
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading-cell">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-cell">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>
                    <div className="user-avatar">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={`${user.firstName}'s avatar`} />
                      ) : (
                        <span>{user.firstName[0]}{user.lastName[0]}</span>
                      )}
                    </div>
                  </td>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge active`}>
                      {'Active'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-icon" 
                      onClick={() => handleViewUser(user.userId)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          className="btn-page" 
          disabled={page === 1 || loading} 
          onClick={() => setPage(p => p - 1)}
        >
          <i className="fas fa-chevron-left"></i> Previous
        </button>
        <span className="page-info">Page {page}</span>
        <button 
          className="btn-page" 
          disabled={users.length < pageSize || loading} 
          onClick={() => setPage(p => p + 1)}
        >
          Next <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New User</h3>
              <button className="btn-close" onClick={() => setIsCreateModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={newUser.bio}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell us a bit about yourself"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={newUser.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={newUser.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="roleId">Role</label>
                <select
                  id="roleId"
                  name="roleId"
                  value={newUser.roleId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select role</option>
                  {roles.map(role => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture">Profile Picture</label>
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {isViewModalOpen && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>User Details</h3>
              <button className="btn-close" onClick={() => setIsViewModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="user-details">
              <div className="user-profile">
                {selectedUser.profilePicture ? (
                  <img src={selectedUser.profilePicture} alt={`${selectedUser.firstName}'s profile`} />
                ) : (
                  <div className="user-avatar large">
                    <span>{selectedUser.firstName[0]}{selectedUser.lastName[0]}</span>
                  </div>
                )}
              </div>
              <div className="user-info">
                <div className="info-group">
                  <label>Name</label>
                  <p>{`${selectedUser.firstName} ${selectedUser.lastName}`}</p>
                </div>
                <div className="info-group">
                  <label>Email</label>
                  <p>{selectedUser.email}</p>
                </div>
                <div className="info-group">
                  <label>Status</label>
                  <p>
                    <span className={`status-badge active`}>
                      {'Active'}
                    </span>
                  </p>
                </div>
                <div className="info-group">
                  <label>Created At</label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="info-group">
                  <label>Last Updated</label>
                  <p>{new Date(selectedUser.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setIsViewModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement; 