import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * useSocket Hook
 * Manages a singleton socket connection for real-time room communication.
 */
export const useSocket = (url: string, roomId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    const s = io(url, {
      query: { roomId },
      reconnectionAttempts: 5,
    });

    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [url, roomId]);

  return { socket, isConnected };
};
