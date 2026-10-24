import api from './axios';

// Cross-cutting "extra" endpoints (extraController.js under /api/extra)
//   GET    /api/extra/exhibitors/search?keyword=&category=    -> [User]   (no auth)
//   POST   /api/extra/schedule/bookmark                        -> Schedule  (auth required, body { scheduleId, userId })
//   GET    /api/extra/admin/analytics                          -> { totalUsers, totalExhibitors, totalAttendees, totalBookings, totalBooths, approvedBooths }  (admin only)
export const extraApi = {
  // Search exhibitors by keyword (name / companyName / productsOrServices) and/or category
  searchExhibitors: async (keyword = '', category = '') => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    const res = await api.get('/extra/exhibitors/search', { params });
    return res.data;
  },

  // Toggle the calling user's bookmark on a session
  // Body: { scheduleId, userId } — userId must equal the JWT-decoded req.user.id
  toggleSessionBookmark: async (scheduleId, userId) => {
    const res = await api.post('/extra/schedule/bookmark', { scheduleId, userId });
    return res.data;
  },

  // Admin dashboard stats
  getAnalytics: async () => {
    const res = await api.get('/extra/admin/analytics');
    return res.data;
  },
};

export default extraApi;
