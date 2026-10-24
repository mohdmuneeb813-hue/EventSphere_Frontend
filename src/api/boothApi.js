import api from './axios';

export const boothApi = {
  getAll: async () => {
    const res = await api.get('/booths/all');
    return res.data;
  },

  apply: async (data) => {
    // data: { expo, exhibitor, boothNumber, category }
    const res = await api.post('/booths/apply', data);
    return res.data;
  },

  updateStatus: async (boothId, status) => {
    // status: 'Approved' | 'Rejected'
    const res = await api.put(`/booths/status/${boothId}`, { status });
    return res.data;
  },
};
