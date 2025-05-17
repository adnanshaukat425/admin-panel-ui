import api from './api';

/**
 * User service for user-related operations
 */
class UserService {
  /**
   * Get active users count and other user metrics
   * @returns {Promise<Object>} - User count data
   */
  async getUserCounts() {
    try {
      const response = await api.get('/User/GetSystemStats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user counts:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all users with pagination
   * @param {Object} pagination - Pagination parameters
   * @returns {Promise<Object>} - Paginated users data
   */
  async getAllUsers(pagination = { page: 1, pageSize: 10 }) {
    try {
      const response = await api.post('/User/GetAllUsers', pagination);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching users:', error);
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
        message: error.response.data.message || 'Failed to fetch user data',
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

export default new UserService(); 