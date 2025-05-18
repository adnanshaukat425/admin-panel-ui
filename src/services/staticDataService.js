import api from './api';

/**
 * Service for static data operations
 */
class StaticDataService {
  /**
   * Get all system roles
   * @returns {Promise<Object>} - Roles data
   */
  async getRoles() {
    try {
      const response = await api.get('/StaticData/GetRoles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
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

export default new StaticDataService(); 