import apiClient from '../api/apiClient';

export const authService = {
  /**
   * Register a new user
   * @param {Object} data - User registration data
   * @param {Object} data.user - User object wrapper
   * @returns {Promise}
   */
  signUp: async (data) => {
    // Expecting data structure: { user: { username, email, password, password_confirmation, ... } }
    return apiClient.post('/api/v1/users/sign_up', data);
  },

  /**
   * Sign in a user
   * @param {Object} data - Login credentials
   * @param {Object} data.user - User object wrapper
   * @returns {Promise}
   */
  signIn: async (data) => {
    // Expecting data structure: { user: { email_or_username, password } }
    return apiClient.post('/api/v1/users/sign_in', data);
  }
};
