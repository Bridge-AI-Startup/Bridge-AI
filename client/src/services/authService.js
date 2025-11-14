import { API_URL } from '@/config';

/**
 * Authentication Service
 * Handles all authentication-related API calls using native fetch()
 * Follows coding standards: Always use fetch(), never axios
 */

/**
 * Student sign-up
 * @param {string} idToken - Firebase ID token
 * @param {string} name - Full name
 * @param {string} university - University name
 * @param {string} photoURL - Photo URL (optional)
 * @returns {Promise<Object>} User data and JWT token
 */
export const studentSignUp = async (idToken, name, university, photoURL = null) => {
  const response = await fetch(`${API_URL}/api/auth/student/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      name,
      university,
      photoURL,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Student sign-up failed');
  }

  return data;
};

/**
 * Student sign-in
 * @param {string} idToken - Firebase ID token
 * @param {string} photoURL - Optional photo URL
 * @returns {Promise<Object>} User data and JWT token
 */
export const studentSignIn = async (idToken, photoURL = null) => {
  const response = await fetch(`${API_URL}/api/auth/student/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      photoURL,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Student sign-in failed');
  }

  return data;
};

/**
 * Employer sign-up
 * @param {string} idToken - Firebase ID token
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} companyName - Company name
 * @param {string} companyWebsite - Company website (optional)
 * @param {string} industry - Industry (optional)
 * @param {string} photoURL - Photo URL (optional)
 * @returns {Promise<Object>} Employer data and JWT token
 */
export const employerSignUp = async (idToken, firstName, lastName, companyName, companyWebsite = '', industry = '', photoURL = null) => {
  const response = await fetch(`${API_URL}/api/auth/employer/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      firstName,
      lastName,
      companyName,
      companyWebsite,
      industry,
      photoURL,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Employer sign-up failed');
  }

  return data;
};

/**
 * Employer sign-in
 * @param {string} idToken - Firebase ID token
 * @param {string} photoURL - Optional photo URL
 * @returns {Promise<Object>} Employer data and JWT token
 */
export const employerSignIn = async (idToken, photoURL = null) => {
  const response = await fetch(`${API_URL}/api/auth/employer/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      photoURL,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Employer sign-in failed');
  }

  return data;
};

/**
 * Store auth data in localStorage
 * @param {Object} data - Response data from sign-in/sign-up
 * @param {string} userType - 'student' or 'employer'
 */
export const storeAuthData = (data, userType) => {
  localStorage.setItem('token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
  localStorage.setItem('userType', userType);
  localStorage.setItem('role', data.data.role);

  if (userType === 'employer' && data.data.company) {
    localStorage.setItem('company', JSON.stringify(data.data.company));
  }
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userType');
  localStorage.removeItem('role');
  localStorage.removeItem('company');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get current user type
 * @returns {string|null} 'student' or 'employer' or null
 */
export const getUserType = () => {
  return localStorage.getItem('userType');
};

/**
 * Get current user data
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};
