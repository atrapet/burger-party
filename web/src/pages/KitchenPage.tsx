import { useState } from 'react';
import type { FC } from 'react';
import type { Order, OrderStatus } from '@/types';
import { useKitchenOrders } from '@/hooks/useKitchenOrders';
import { useConnection } from '@/hooks/useConnection';
import { useNow } from '@/hooks/useNow';
import { useMenu } from '@/hooks/useMenu';
import { useStock } from '@/hooks/useStock';
import { toggleStock } from '@/lib/socket';
import { KitchenColumn } from '@/components/KitchenColumn/KitchenColumn';

const COLUMNS: OrderStatus[] = ['new', 'cooking', 'ready'];

const byNumber = (a: Order, b: Order) => a.number - b.number;

export const KitchenPage: FC = () => {
  const orders = useKitchenOrders();
  const connected = useConnection();
  const now = useNow();
  const { menu } = useMenu();
  const disabledStock = useStock();
  const [showStock, setShowStock] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-stone-200">
      <header className="flex items-center justify-between px-5 py-3">
        <h1 className="text-2xl font-extrabold text-stone-800">🍔 Cuisine</h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowStock((v) => !v)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
              showStock ? 'bg-orange-600 text-white' : 'bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            📦 Stock
          </button>
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
        <div className="flex flex-1 gap-3 overflow-hidden">
          {COLUMNS.map((status) => (
            <KitchenColumn
              key={status}
              status={status}
              orders={orders.filter((order) => order.status === status).sort(byNumber)}
              now={now}
            />
          ))}
        </div>

        {showStock && menu && (
          <aside className="w-64 shrink-0 overflow-y-auto rounded-xl bg-white shadow-lg">
            <div className="sticky top-0 flex items-center justify-between border-b border-stone-100 bg-white px-4 py-3">
              <h2 className="font-bold text-stone-800">📦 Stock</h2>
              <button
                type="button"
                onClick={() => setShowStock(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 p-4">
              {menu.categories.map((category) => (
                <div key={category.id}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">
                    {category.emoji} {category.label}
                  </p>
                  <div className="flex flex-col gap-1">
                    {category.options.map((option) => {
                      const disabled = disabledStock.has(option.id);
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => toggleStock(option.id)}
                          className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                            disabled
                              ? 'bg-red-50 text-red-500 line-through'
                              : 'bg-stone-50 text-stone-800 hover:bg-stone-100'
                          }`}
                        >
                          <span>{option.label}</span>
                          <span>{disabled ? '❌' : '✅'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
