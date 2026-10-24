import api from './axios';

// Feedback / support ticket related API calls
// Backend contract (feedbackController.js):
//   GET    /api/feedback             -> [Feedback]            (admin only, sorted createdAt desc)
//   POST   /api/feedback              -> Feedback              (auth required, broadcasts FEEDBACK_SUBMITTED)
//   PUT    /api/feedback/:id          -> Feedback              (admin only, body { status: 'Open'|'Resolved' })
//   DELETE /api/feedback/:id          -> { message: string }   (admin only)
export const feedbackApi = {
  // List all feedback (admin only)
  getAll: async () => {
    const res = await api.get('/feedback');
    return res.data;
  },

  // Submit new feedback
  // Body: { category, subject, message, userName, userEmail, role }
  create: async (feedbackData) => {
    const res = await api.post('/feedback', feedbackData);
    return res.data;
  },

  // Update feedback status (Open <-> Resolved)
  updateStatus: async (id, status) => {
    const res = await api.put(`/feedback/${id}`, { status });
    return res.data;
  },

  // Delete feedback by _id
  delete: async (id) => {
    const res = await api.delete(`/feedback/${id}`);
    return res.data;
  },
};

export default feedbackApi;
