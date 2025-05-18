import api from './api';

/**
 * Service for user management operations
 */
class UserManagementService {
  /**
   * Get paginated list of users
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Number of items per page
   * @returns {Promise<Object>} - Paginated users data
   */
  async getUsers(pagination = { page: 1, pageSize: 10 }) {
    try {
      const response = await api.post('/User/GetSystemUsers', pagination);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get user details by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - User details
   */
  async getUserDetails(userId) {
    try {
      const response = await api.get(`/User/GetUserDetails/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user data
   */
  async createUser(userData) {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('firstName', userData.firstName);
      formData.append('lastName', userData.lastName);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('authProviderId', 1);
      formData.append('bio', userData.bio || '');
      formData.append('gender', userData.gender || '');
      formData.append('phoneNumber', userData.phoneNumber || '');
      formData.append('roleId', userData.roleId || '');
      
      if (userData.profilePicture) {
        formData.append('profilePicture', userData.profilePicture);
      }

      const response = await api.post('/Auth/Register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} - Structured error object
   */
  handleError(error) {
    if (error.response) {
      return {
        message: error.response.data.message || 'Operation failed',
        status: error.response.status,
        details: error.response.data
      };
    } else if (error.request) {
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
        details: error.request
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        details: error
      };
    }
  }
}

export default new UserManagementService(); 