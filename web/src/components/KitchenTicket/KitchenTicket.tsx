import type { FC } from 'react';
import type { Order } from '@/types';
import { advanceOrder, setOrderStatus } from '@/lib/socket';
import { formatElapsed } from '@/lib/time';
import { Button } from '@/ui/Button';
import { OrderItems } from '@/components/OrderItems/OrderItems';
import { nextAction } from './helpers/nextAction';

type Props = {
  order: Order;
  now: number;
};

// One kitchen ticket: who ordered what, how long ago, and the actions to move it
// forward (advance) or remove it (cancel). Errors are swallowed since the board
// re-syncs from the server broadcast.
export const KitchenTicket: FC<Props> = ({ order, now }) => {
  const action = nextAction(order.status);

  const handleAdvance = () => {
    advanceOrder(order.id).catch(() => undefined);
  };
  const handleCancel = () => {
    setOrderStatus(order.id, 'cancelled').catch(() => undefined);
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-lg font-extrabold text-stone-800">{order.name}</span>
        <span className="text-xs font-medium text-stone-400">n°{order.number}</span>
      </div>
      <OrderItems items={order.items} />
      {order.note && <p className="mt-2 text-sm italic text-stone-600">« {order.note} »</p>}

      <p className="mt-3 text-xs text-stone-400">{formatElapsed(order.createdAt, now)}</p>

      <div className="mt-3 flex gap-2">
        {action && (
          <Button className="flex-1 py-2 text-sm" onClick={handleAdvance}>
            {action.label}
          </Button>
        )}
        <Button variant="ghost" className="py-2 text-sm" onClick={handleCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
};
