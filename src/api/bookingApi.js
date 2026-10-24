import api from './axios';

export const bookingApi = {
  book: async (data) => {
    // data: { expo, attendee }
    const res = await api.post('/bookings/book', data);
    return res.data;
  },

  getAttendeeBookings: async (attendeeId) => {
    const res = await api.get(`/bookings/attendee/${attendeeId}`);
    return res.data;
  },

  getAll: async () => {
    const res = await api.get('/bookings/all');
    return res.data;
  },
};
