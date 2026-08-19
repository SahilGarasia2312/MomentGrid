'use client';

const TOKEN_KEY = 'mg_access_token';
const USER_KEY  = 'mg_user';

/**
 * TokenManager — manages the access token in localStorage.
 *
 * Refresh token lives in httpOnly cookie (managed by browser/server).
 * This module only handles the access token side.
 */
export const tokenManager = {
  /** Store access token */
  setToken(token) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  /** Retrieve access token */
  getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  /** Store user snapshot (from toPublic()) */
  setUser(user) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  /** Retrieve user snapshot */
  getUser() {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Clear all auth state */
  clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /** True if an access token is present (does not validate expiry) */
  isAuthenticated() {
    return Boolean(this.getToken());
  },

  /**
   * Decode JWT payload without verification (client-side only).
   * @returns {object|null}
   */
  decodeToken(token) {
    try {
      const base64Payload = token.split('.')[1];
      const decoded = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  },

  /** Check if stored access token is expired */
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;
    return Date.now() >= payload.exp * 1000;
  },

  /** Get role from stored access token */
  getRole() {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token)?.role ?? null;
  },
};
