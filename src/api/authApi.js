import api from './axios';

// Backend contract (authController.js):
//   POST /api/auth/register         -> { message, token, user }       (no auth)
//   POST /api/auth/login             -> { message, token, user }       (no auth)
//   POST /api/auth/reset-password     -> { message } or { message, user } (no auth, requires email+newPassword)
//   PUT  /api/auth/profile            -> { message, user }              (auth required; updates name and/or companyDetails)
export const authApi = {
  // Register a new user. Backend returns { message, token, user } but the
  // current frontend Register flow only reads `message` and routes the user
  // to /login — we keep the same shape for forward-compat.
  register: async (payload) => {
    const res = await api.post('/auth/register', payload);
    return res.data;
  },

  // Login. Backend returns { message, token, user: { _id, name, email, role, companyDetails } }
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },

  // Reset password using email + new password (no email-verification flow exists
  // in the backend — the route accepts the old-password-style payload directly).
  resetPassword: async (payload) => {
    const res = await api.post('/auth/reset-password', payload);
    return res.data;
  },

  // Update authenticated user's profile (name and/or companyDetails).
  // Backend returns { message, user }.
  updateProfile: async (payload) => {
    const res = await api.put('/auth/profile', payload);
    return res.data;
  },
};

export default authApi;
