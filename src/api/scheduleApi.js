import api from './axios';

// Backend contract (scheduleController.js):
//   POST   /api/schedules/create                    -> { message, schedule }    (admin only)
//   GET    /api/schedules/expo/:expoId               -> [Schedule]              (public)
//   GET    /api/schedules/bookmarked/:userId         -> [Schedule]              (auth; userId must equal req.user.id)
//   DELETE /api/schedules/delete/:id                 -> { message }             (admin only)
export const scheduleApi = {
  // Create a new session/schedule for an expo.
  // Body: { expo, sessionTitle, speaker, topic, timeSlot, location }
  create: async (data) => {
    const res = await api.post('/schedules/create', data);
    return res.data;
  },

  // List sessions for a specific expo (sorted by backend).
  getByExpo: async (expoId) => {
    const res = await api.get(`/schedules/expo/${expoId}`);
    return res.data;
  },

  // Single round-trip: fetch every session the user has bookmarked.
  // The backend populates the parent expo so we can show its title without
  // a second fan-out request.
  getBookmarked: async (userId) => {
    const res = await api.get(`/schedules/bookmarked/${userId}`);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/schedules/delete/${id}`);
    return res.data;
  },
};

export default scheduleApi;
