import api from './api';

/**
 * Authentication service for managing user login, registration and session
 */
class AuthService {
  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Response with user data and token
   */
  async login(email, password) {
    try {
      const response = await api.post('/Auth/Login', { email, password });
      
      if (response.data && response.data.data) {
        // Store auth token and user data
        this.setToken(response.data.data.token);
        this.setUserData(response.data.data.user);
        return response.data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  }

  /**
   * Check if user is logged in
   * @returns {boolean} - True if user is logged in
   */
  isLoggedIn() {
    return !!localStorage.getItem('auth_token');
  }

  /**
   * Get the current user data
   * @returns {Object|null} - User data or null if not logged in
   */
  getCurrentUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Store authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Store user data
   * @param {Object} user - User data
   */
  setUserData(user) {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   * @returns {Object} - Structured error object
   */
  handleError(error) {
    if (error.response) {
      // The server responded with an error status code
      return {
        message: error.response.data.message || 'Authentication failed',
        status: error.response.status,
        details: error.response.data
      };
    } else if (error.request) {
      // The request was made but no response was received
      return {
        message: 'No response from server. Please check your connection.',
        status: 0,
        details: error.request
      };
    } else {
      // Something happened in setting up the request
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        details: error
      };
    }
  }
}

export default new AuthService(); 