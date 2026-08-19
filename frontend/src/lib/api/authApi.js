'use client';

import { httpClient } from '../utils/httpClient';
import { tokenManager } from '../utils/tokenManager';

/**
 * authApi — API client functions for all authentication endpoints.
 */
export const authApi = {
  /**
   * Register a new user account.
   * @param {object} payload - { fullName, email, password, role, phone? }
   * @returns {Promise<{ user, access_token, token_type, expires_in }>}
   */
  async register(payload) {
    const data = await httpClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data?.access_token) {
      tokenManager.setToken(data.access_token);
    }
    if (data?.user) {
      tokenManager.setUser(data.user);
    }

    return data;
  },

  /**
   * Log into an existing account.
   * @param {object} payload - { email, password, rememberMe }
   * @returns {Promise<{ user, access_token, token_type, expires_in }>}
   */
  async login(payload) {
    const data = await httpClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (data?.access_token) {
      tokenManager.setToken(data.access_token);
    }
    if (data?.user) {
      tokenManager.setUser(data.user);
    }

    return data;
  },

  /**
   * Log out of current session and invalidate refresh token cookie.
   */
  async logout() {
    try {
      await httpClient('/auth/logout', {
        method: 'POST',
      });
    } finally {
      tokenManager.clear();
    }
  },

  /**
   * Send a password reset email to the specified address.
   * @param {string} email
   */
  async forgotPassword(email) {
    return httpClient('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password using a valid token from email link.
   * @param {object} payload - { token, password, confirmPassword }
   */
  async resetPassword(payload) {
    return httpClient('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Verify an email address using the token from verification link.
   * @param {string} token
   */
  async verifyEmail(token) {
    return httpClient(`/auth/verify-email?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    });
  },

  /**
   * Fetch current user details from server using access token.
   * @returns {Promise<{ user }>}
   */
  async me() {
    const data = await httpClient('/auth/me', {
      method: 'GET',
    });
    if (data?.user) {
      tokenManager.setUser(data.user);
    }
    return data;
  },
};
