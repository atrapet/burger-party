import { io } from 'socket.io-client';
import type { CreateOrderPayload, Order, OrderAck, OrderStatus } from '@/types';

// Same-origin connection; socket.io-client falls back to HTTP long-polling when a
// reverse proxy blocks the WebSocket upgrade, and auto-reconnects on flaky cellular.
export const socket = io({ autoConnect: true });

const emitOrder = (event: string, payload: unknown): Promise<Order> =>
  new Promise((resolve, reject) => {
    socket.timeout(8000).emit(event, payload, (timeoutError: Error | null, ack: OrderAck) => {
      if (timeoutError) return reject(new Error('Connexion perdue, réessaie.'));
      if ('error' in ack) return reject(new Error(ack.error));
      resolve(ack.order);
    });
  });

export const submitOrder = (payload: CreateOrderPayload) => emitOrder('order:create', payload);

export const advanceOrder = (id: string) => emitOrder('order:advance', { id });

export const setOrderStatus = (id: string, status: OrderStatus) =>
  emitOrder('order:status', { id, status });
