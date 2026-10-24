import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { messageApi } from '../../api/messageApi';
import toast from 'react-hot-toast';

// Exhibitor live chat — wired to /api/messages (REST) + Socket.io NEW_CHAT_MESSAGE.
// On POST the backend (messageController.createMessage) persists the message and
// broadcasts NEW_CHAT_MESSAGE via io.emit; this page only needs to subscribe to
// that socket event for cross-client updates. We do NOT re-emit from the client.
export const ExhibitorMessages = () => {
  const { user } = useAuth();
  const { subscribe } = useSocket();

  const [activeChannel, setActiveChannel] = useState('organizers');
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatBottomRef = useRef(null);

  // Fetch chat history from the backend on mount.
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const history = await messageApi.getAll();
        setMessages(history || []);
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load chat history';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Real-time: append any new message broadcast by the backend.
  useEffect(() => {
    const unsub = subscribe('NEW_CHAT_MESSAGE', (newMsg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id || m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
    return unsub;
  }, [subscribe]);

  // Auto-scroll to the latest message.
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist the message via REST. The backend will broadcast NEW_CHAT_MESSAGE
  // to all clients (including this one) — but we optimistically append locally
  // to keep the UX snappy. Dedup on socket echo is handled in the subscriber.
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || sending) return;

    const payload = {
      senderId: user?.id || user?._id || 'exhibitor_guest',
      senderName: user?.companyDetails?.companyName || user?.name || 'Exhibitor',
      role: 'exhibitor',
      text: inputVal.trim(),
      channel: activeChannel,
    };

    try {
      setSending(true);
      const saved = await messageApi.create(payload);
      // Backend returns the raw saved document (no wrapper).
      if (saved) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === saved._id)) return prev;
          return [...prev, saved];
        });
      }
      setInputVal('');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send message';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Exhibitor Communications & Organizer Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct real-time channel with event organizers, hall technicians, and fellow exhibitors.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {activeChannel === 'organizers'
                  ? 'Organizer Desk'
                  : activeChannel === 'booth_neighbors'
                  ? 'Booth Neighbors'
                  : 'Attendees Lounge'}
              </h2>
              <p className="text-xs text-slate-500">Real-time chat support</p>
            </div>
          </div>

          {/* Channel switcher */}
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveChannel('organizers')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChannel === 'organizers'
                  ? 'bg-white text-terracotta-600 shadow'
                  : 'text-slate-500'
              }`}
            >
              Organizers
            </button>
            <button
              onClick={() => setActiveChannel('booth_neighbors')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeChannel === 'booth_neighbors'
                  ? 'bg-white text-terracotta-600 shadow'
                  : 'text-slate-500'
              }`}
            >
              Booth Neighbors
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/50">
          {loading ? (
            <div className="text-center text-slate-500 text-sm py-8">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-8">
              No messages yet. Be the first to say hello!
            </div>
          ) : (
            messages
              .filter((m) => !m.channel || m.channel === activeChannel)
              .map((m) => {
                const isMe = m.senderId === user?.id || m.senderId === user?._id;
                return (
                  <div
                    key={m._id || m.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {!isMe && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="w-3 h-3 text-slate-600" />
                          </div>
                          <span className="text-xs font-semibold text-slate-700">
                            {m.senderName}
                          </span>
                          {m.role === 'admin' && (
                            <ShieldCheck className="w-3 h-3 text-terracotta-500" />
                          )}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm ${
                          isMe
                            ? 'bg-terracotta-600 text-white rounded-br-md'
                            : m.role === 'admin'
                            ? 'bg-terracotta-50 text-slate-900 border border-terracotta-100 rounded-bl-md'
                            : 'bg-white text-slate-900 border border-slate-200 rounded-bl-md'
                        }`}
                      >
                        {m.text}
                      </div>
                      <div className={`text-xs text-slate-400 mt-1 ${isMe ? 'text-right' : ''}`}>
                        {formatTime(m.createdAt || m.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="px-4 py-3 border-t border-slate-200 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || sending}
            className="p-2.5 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExhibitorMessages;
