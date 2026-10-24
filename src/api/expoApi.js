import api from './axios';

export const expoApi = {
  getAll: async () => {
    const res = await api.get('/expos/all');
    return res.data;
  },

  create: async (data) => {
    // data: { title, description, theme, location, date, createdBy }
    const res = await api.post('/expos/create', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/expos/update/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/expos/delete/${id}`);
    return res.data;
  },
};
