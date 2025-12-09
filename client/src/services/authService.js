/**
 * Authentication Service
 * Centralized API calls for auth-related operations
 */
import axios from 'axios';

const API_BASE = '/api/users';

/**
 * User registration
 * @param {object} userData - User registration data
 * @returns {Promise} Registration response
 */
export const registerUser = async (userData) => {
  return axios.post(`${API_BASE}/register`, userData);
};

/**
 * User login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} Login response with token
 */
export const loginUser = async (email, password) => {
  return axios.post(`${API_BASE}/login`, { email, password });
};

/**
 * Verify OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise} OTP verification response
 */
export const verifyOtp = async (email, otp) => {
  return axios.post(`${API_BASE}/verify-otp`, { email, otp });
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise} Reset request response
 */
export const requestPasswordReset = async (email) => {
  return axios.post(`${API_BASE}/forgot-password`, { email });
};

/**
 * Verify reset token
 * @param {string} token - Reset token
 * @returns {Promise} Token verification response
 */
export const verifyResetToken = async (token) => {
  return axios.get(`${API_BASE}/verify-token/${token}`);
};

/**
 * Reset password
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise} Reset response
 */
export const resetPassword = async (token, newPassword) => {
  return axios.post(`${API_BASE}/reset-password`, { token, newPassword });
};

/**
 * Get current authenticated user
 * @returns {Promise} User data
 */
export const getAuthUser = async () => {
  return axios.get(`${API_BASE}/me`);
};
