import type { OrderStatus } from '@/types';

type NextAction = { label: string } | null;

// Label for the button that advances a ticket to its next kitchen stage.
const ACTIONS: Partial<Record<OrderStatus, NextAction>> = {
  new: { label: 'Commencer 🔥' },
  cooking: { label: "C'est prêt 🎉" },
  ready: { label: 'Servie 😋' },
};

export const nextAction = (status: OrderStatus): NextAction => ACTIONS[status] ?? null;
