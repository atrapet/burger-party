import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

// Tracks live socket connectivity so the UI can show a reconnecting banner.
export const useConnection = (): boolean => {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return connected;
};
