import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { messageApi } from '../../api/messageApi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Slide-out chat drawer — wired to /api/messages (REST) + Socket.io NEW_CHAT_MESSAGE.
// The backend persists the message on POST and broadcasts NEW_CHAT_MESSAGE via
// io.emit; we just subscribe. The drawer is open to authenticated users only;
// unauthenticated users see a sign-in CTA so they cannot post.
export const MessagingDrawer = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const { subscribe, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  // Lazy-load chat history only when the drawer is opened.
  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  useEffect(() => {
    const unsub = subscribe('NEW_CHAT_MESSAGE', (newMsg) => {
      if (!newMsg) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMsg._id || m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });
    return unsub;
  }, [subscribe]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim() || sending) return;
    if (!isAuthenticated) {
      toast.error('Please sign in to send messages.');
      return;
    }

    const payload = {
      senderId: user?.id || user?._id || 'guest',
      senderName: user?.companyDetails?.companyName || user?.name || 'User',
      role: user?.role || 'attendee',
      text: inputVal.trim(),
      channel: 'organizers',
    };

    try {
      setSending(true);
      const saved = await messageApi.create(payload);
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

  if (!isOpen) return null;

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-terracotta-600/30 border border-terracotta-400/40 flex items-center justify-center text-terracotta-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Expo Live Messenger</h3>
            <p className="text-[11px] text-slate-400 flex items-center space-x-1">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isConnected ? 'Real-time channel active' : 'Connecting...'}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {loading ? (
          <div className="text-center text-slate-500 text-sm py-8">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-slate-400 text-sm py-8">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe =
              msg.senderId === user?.id || msg.senderId === user?._id;
            return (
              <div
                key={msg._id || msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-slate-400">
                  {!isMe && <User className="w-3 h-3" />}
                  <span className="font-semibold text-slate-600">
                    {isMe ? 'You' : msg.senderName}
                  </span>
                  {msg.role && (
                    <span className="text-[10px] uppercase px-1.5 py-0.2 bg-slate-200/80 rounded font-medium text-slate-600">
                      {msg.role}
                    </span>
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    isMe
                      ? 'bg-terracotta-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/70 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1 text-right ${
                      isMe ? 'text-terracotta-200' : 'text-slate-400'
                    }`}
                  >
                    {formatTime(msg.createdAt || msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input box or sign-in CTA */}
      {isAuthenticated ? (
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a message to organizers & exhibitors..."
            className="flex-1 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/20 focus:border-terracotta-500"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || sending}
            className="p-2.5 bg-terracotta-600 text-white rounded-xl hover:bg-terracotta-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-4 bg-white border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500 mb-2">Sign in to send messages.</p>
          <Link
            to="/login"
            className="inline-block px-5 py-2 bg-terracotta-600 text-white text-xs font-bold rounded-xl hover:bg-terracotta-700 transition"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
};

export default MessagingDrawer;
