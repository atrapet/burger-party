import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export const useStock = (): Set<string> => {
  const [disabled, setDisabled] = useState<Set<string>>(new Set());

  useEffect(() => {
    const onSync = (ids: string[]) => setDisabled(new Set(ids));
    socket.on('stock:sync', onSync);
    return () => { socket.off('stock:sync', onSync); };
  }, []);

  return disabled;
};
