import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

/**
 * Normalize a user object so that BOTH `user._id` (raw Mongoose shape) and
 * `user.id` (string, what the JWT payload uses and what every frontend page
 * reads) are present. This self-heals any user previously stored in
 * localStorage before the backend response-shape fix.
 *
 * @param {object|null} u
 * @returns {object|null}
 */
const normalizeUser = (u) => {
  if (!u || typeof u !== 'object') return null;
  const normalized = { ...u };
  if (!normalized.id && normalized._id) {
    normalized.id = String(normalized._id);
  }
  if (!normalized._id && normalized.id) {
    normalized._id = normalized.id;
  }
  return normalized;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('eventsphere_user');
      return stored ? normalizeUser(JSON.parse(stored)) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage validity on initial load and re-normalize in case
    // the stored user predates the backend's `id` field fix.
    const storedUser = localStorage.getItem('eventsphere_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        const normalized = normalizeUser(parsed);
        // If the stored user was missing `id`, persist the normalized version
        // so subsequent reads don't have to re-normalize.
        if (normalized && !parsed.id) {
          localStorage.setItem('eventsphere_user', JSON.stringify(normalized));
        }
        setUser(normalized);
      } catch {
        localStorage.removeItem('eventsphere_user');
        localStorage.removeItem('eventsphere_token');
        setUser(null);
      }
    }
    setLoading(false);

    // Listen to 401 unauthorized events from Axios
    const handleUnauthorized = () => {
      setUser(null);
      toast.error('Session expired. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      // Backend (authRoutes.js login) returns:
      //   { token, user: { _id, id, name, email, role, companyDetails, createdAt, updatedAt } }
      // The JWT payload is { id, role, email } — server-issued, 7-day expiry.
      const authenticatedUser = normalizeUser(res.user);
      if (!res.token) {
        // No fallback token synthesis — surface the issue rather than masking it.
        throw new Error('Server did not return an auth token.');
      }
      if (!authenticatedUser?.id) {
        throw new Error('Server did not return a valid user id.');
      }

      localStorage.setItem('eventsphere_user', JSON.stringify(authenticatedUser));
      localStorage.setItem('eventsphere_token', res.token);
      setUser(authenticatedUser);

      toast.success(`Welcome back, ${authenticatedUser.name}!`);
      return authenticatedUser;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      toast.error(message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      toast.success(res.message || 'Account created successfully!');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(message);
      throw err;
    }
  };

  const resetPassword = async (email, newPassword) => {
    try {
      const res = await authApi.resetPassword({ email, newPassword });
      toast.success(res.message || 'Password reset successfully!');
      return res;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Password reset failed';
      toast.error(message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('eventsphere_user');
    localStorage.removeItem('eventsphere_token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  // Local-state sync helper. Called by pages after a successful PUT /api/auth/profile
  // so that every page that reads useAuth().user sees the updated fields without
  // a page reload. NOT a substitute for the API call itself.
  const updateUserProfile = (patch) => {
    if (!user) return;
    const updated = normalizeUser({ ...user, ...patch });
    setUser(updated);
    localStorage.setItem('eventsphere_user', JSON.stringify(updated));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isExhibitor: user?.role === 'exhibitor',
    isAttendee: user?.role === 'attendee',
    login,
    register,
    resetPassword,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
