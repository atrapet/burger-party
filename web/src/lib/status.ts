import type { OrderStatus } from '@/types';

type StatusMeta = {
  label: string;
  guestLabel: string;
  emoji: string;
  badge: string; // tailwind classes for the status badge
  column: string; // tailwind classes for the kitchen column accent
};

// Single source of truth for status wording/colors across the kitchen board and
// the guest status screen.
export const STATUS_META: Record<OrderStatus, StatusMeta> = {
  new: {
    label: 'Nouvelle',
    guestLabel: 'Commande reçue, en attente',
    emoji: '🆕',
    badge: 'bg-stone-200 text-stone-700',
    column: 'border-stone-300',
  },
  cooking: {
    label: 'En cuisine',
    guestLabel: 'En préparation',
    emoji: '🔥',
    badge: 'bg-amber-200 text-amber-800',
    column: 'border-amber-400',
  },
  ready: {
    label: 'Prête',
    guestLabel: 'Prête, viens la chercher !',
    emoji: '🎉',
    badge: 'bg-green-200 text-green-800',
    column: 'border-green-500',
  },
  served: {
    label: 'Servie',
    guestLabel: 'Bon appétit !',
    emoji: '😋',
    badge: 'bg-stone-200 text-stone-500',
    column: 'border-stone-200',
  },
  cancelled: {
    label: 'Annulée',
    guestLabel: 'Commande annulée',
    emoji: '❌',
    badge: 'bg-red-200 text-red-700',
    column: 'border-red-300',
  },
};
