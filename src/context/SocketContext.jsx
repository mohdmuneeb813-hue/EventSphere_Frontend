import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

// Real Socket.io context. The backend (app.js) only emits these 4 events:
//   NEW_CHAT_MESSAGE, BOOTH_STATUS_CHANGED, EXPO_CREATED, FEEDBACK_SUBMITTED
// Pages should NOT emit these from the client — the backend already broadcasts
// them when the corresponding REST endpoint is called. Pages should only
// `subscribe(eventName, cb)` to react to those server-side broadcasts.
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribersRef = useRef({}); // event name -> Set of callbacks

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    const socket = io(socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    // ===== Server-emitted events forwarded to local subscribers =====
    // Keep this list in sync with the events the backend actually emits.
    const realTimeEvents = [
      'NEW_CHAT_MESSAGE',
      'BOOTH_STATUS_CHANGED',
      'EXPO_CREATED',
      'FEEDBACK_SUBMITTED',
    ];

    realTimeEvents.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        const subs = subscribersRef.current[eventName];
        if (subs) {
          subs.forEach((cb) => cb(payload));
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Emit a client-side event to the server. Only used for events the server
  // actually listens for (currently none that aren't already triggered by the
  // REST endpoints). Most pages should NOT need to call this.
  const emitEvent = (eventName, payload) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, payload);
    }
  };

  // Subscribe to a server-emitted event. Returns an unsubscribe function.
  const subscribe = (eventName, callback) => {
    if (!subscribersRef.current[eventName]) {
      subscribersRef.current[eventName] = new Set();
    }
    subscribersRef.current[eventName].add(callback);

    return () => {
      const subs = subscribersRef.current[eventName];
      if (subs) {
        subs.delete(callback);
      }
    };
  };

  const value = {
    socket: socketRef.current,
    isConnected,
    emitEvent,
    subscribe,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    // Safe fallback when used outside of provider (e.g. in unit tests).
    return {
      isConnected: false,
      emitEvent: () => {},
      subscribe: () => () => {},
    };
  }
  return ctx;
};

export default SocketContext;
