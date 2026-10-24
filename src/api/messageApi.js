import api from './axios';

// Messages (chat) related API calls
// Backend contract (messageController.js):
//   GET    /api/messages            -> [Message]            (no auth, sorted createdAt asc)
//   POST   /api/messages            -> Message              (no auth, broadcasts via Socket.io)
//   DELETE /api/messages/:id        -> { message: string }  (no auth)
export const messageApi = {
  // Fetch full chat history (sorted oldest-first by backend)
  getAll: async () => {
    const res = await api.get('/messages');
    return res.data;
  },

  // Persist a new message; backend will broadcast NEW_CHAT_MESSAGE via Socket.io
  // Body: { senderId, senderName, role, text, channel }
  create: async (messageData) => {
    const res = await api.post('/messages', messageData);
    return res.data;
  },

  // Delete a message by _id
  delete: async (id) => {
    const res = await api.delete(`/messages/${id}`);
    return res.data;
  },
};

export default messageApi;
