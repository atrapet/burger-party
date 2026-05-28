import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';

export const useFriends = (initial: string[]): string[] => {
  const [friends, setFriends] = useState(initial);

  useEffect(() => {
    if (initial.length !== 0) setFriends(initial);
  }, [initial]);

  useEffect(() => {
    const handler = (list: string[]) => setFriends(list);
    socket.on('friends:sync', handler);
    return () => { socket.off('friends:sync', handler); };
  }, []);

  return friends;
};
