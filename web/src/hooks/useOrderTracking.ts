import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import type { Order } from '@/types';

// Follows a single order after submission so the guest sees its status change live.
export const useOrderTracking = (initial: Order): Order => {
  const [order, setOrder] = useState(initial);

  useEffect(() => {
    const onUpdate = (incoming: Order) => {
      if (incoming.id === initial.id) setOrder(incoming);
    };
    socket.on('order:update', onUpdate);
    return () => {
      socket.off('order:update', onUpdate);
    };
  }, [initial.id]);

  return order;
};
