import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import type { Order } from '@/types';

const isActive = (order: Order) => order.status !== 'served' && order.status !== 'cancelled';

const upsert = (orders: Order[], incoming: Order): Order[] => {
  const without = orders.filter((order) => order.id !== incoming.id);
  return isActive(incoming) ? [...without, incoming] : without;
};

// Live list of active orders for the kitchen board, kept in sync over the socket.
export const useKitchenOrders = (): Order[] => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const onSync = (all: Order[]) => setOrders(all.filter(isActive));
    const onChange = (order: Order) => setOrders((prev) => upsert(prev, order));

    socket.on('orders:sync', onSync);
    socket.on('order:new', onChange);
    socket.on('order:update', onChange);
    return () => {
      socket.off('orders:sync', onSync);
      socket.off('order:new', onChange);
      socket.off('order:update', onChange);
    };
  }, []);

  return orders;
};
