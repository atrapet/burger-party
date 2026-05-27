import type { FC } from 'react';
import type { Order, OrderStatus } from '@/types';
import { STATUS_META } from '@/lib/status';
import { KitchenTicket } from '@/components/KitchenTicket/KitchenTicket';

type Props = {
  status: OrderStatus;
  orders: Order[];
  now: number;
};

// One column of the kitchen board (New / Cooking / Ready) with its tickets.
export const KitchenColumn: FC<Props> = ({ status, orders, now }) => {
  const meta = STATUS_META[status];

  return (
    <div className={`flex min-w-0 flex-1 flex-col rounded-2xl border-t-4 bg-stone-100 ${meta.column}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-bold text-stone-700">
          {meta.emoji} {meta.label}
        </h2>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-sm font-bold text-stone-600">
          {orders.length}
        </span>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto px-3 pb-3">
        {orders.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-stone-400">Rien ici</p>
        ) : (
          orders.map((order) => <KitchenTicket key={order.id} order={order} now={now} />)
        )}
      </div>
    </div>
  );
};
