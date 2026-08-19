'use client';

import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { tokenManager } from '../utils/tokenManager';

/**
 * Custom React hook for managing authentication state and actions.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from local storage initially, then sync with server
  const loadUser = useCallback(async () => {
    setIsLoading(true);
    const storedToken = tokenManager.getToken();
    const storedUser = tokenManager.getUser();

    if (!storedToken) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }

    try {
      // Fetch fresh user from backend
      const res = await authApi.me();
      if (res?.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.warn('Could not refresh user session:', err.message);
      // If 401 and refresh failed inside httpClient, tokenManager is already cleared
      if (!tokenManager.getToken()) {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (data) => {
    const res = await authApi.register(data);
    if (res?.user) {
      setUser(res.user);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    reload: loadUser,
  };
}
