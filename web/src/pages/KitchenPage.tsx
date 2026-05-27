import type { FC } from 'react';
import type { Order, OrderStatus } from '@/types';
import { useKitchenOrders } from '@/hooks/useKitchenOrders';
import { useConnection } from '@/hooks/useConnection';
import { useNow } from '@/hooks/useNow';
import { KitchenColumn } from '@/components/KitchenColumn/KitchenColumn';

const COLUMNS: OrderStatus[] = ['new', 'cooking', 'ready'];

const byNumber = (a: Order, b: Order) => a.number - b.number;

export const KitchenPage: FC = () => {
  const orders = useKitchenOrders();
  const connected = useConnection();
  const now = useNow();

  return (
    <div className="flex h-screen flex-col bg-stone-200">
      <header className="flex items-center justify-between px-5 py-3">
        <h1 className="text-2xl font-extrabold text-stone-800">🍔 Cuisine</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-stone-500">{orders.length} en cours</span>
          <span
            className={`flex items-center gap-1.5 text-sm font-medium ${
              connected ? 'text-green-600' : 'text-amber-600'
            }`}
          >
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500' : 'bg-amber-500'}`} />
            {connected ? 'En ligne' : 'Reconnexion…'}
          </span>
        </div>
      </header>

      <div className="flex flex-1 gap-3 overflow-hidden px-3 pb-3">
        {COLUMNS.map((status) => (
          <KitchenColumn
            key={status}
            status={status}
            orders={orders.filter((order) => order.status === status).sort(byNumber)}
            now={now}
          />
        ))}
      </div>
    </div>
  );
};
