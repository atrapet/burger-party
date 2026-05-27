import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { CreateOrderPayload, Order, QuantityMap, SelectionMap } from '@/types';
import { useMenu } from '@/hooks/useMenu';
import { useStock } from '@/hooks/useStock';
import { submitOrder } from '@/lib/socket';
import { ConnectionBanner } from '@/ui/ConnectionBanner';
import { BurgerBuilder } from '@/components/BurgerBuilder/BurgerBuilder';
import { OrderStatusView } from '@/components/OrderStatusView/OrderStatusView';

const ORDER_ID_KEY = 'burger-party-order-id';
const LAST_ORDER_KEY = 'burger-party-last-order';

type SavedOrder = { name: string; selections: SelectionMap; quantities: QuantityMap };

const fetchOrder = (id: string): Promise<Order | null> =>
  fetch(`/api/orders/${id}`)
    .then((res) => (res.ok ? (res.json() as Promise<Order>) : null))
    .catch(() => null);

const loadLastOrder = (): SavedOrder | null => {
  try {
    const raw = localStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as SavedOrder) : null;
  } catch {
    return null;
  }
};

export const OrderPage: FC = () => {
  const { menu, error: menuError } = useMenu();
  const disabledStock = useStock();
  const [order, setOrder] = useState<Order | null>(null);
  const [lastOrder, setLastOrder] = useState<SavedOrder | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLastOrder(loadLastOrder());
    const savedId = localStorage.getItem(ORDER_ID_KEY);
    if (!savedId) return;
    fetchOrder(savedId).then((recovered) => {
      if (recovered && recovered.status !== 'served' && recovered.status !== 'cancelled') {
        setOrder(recovered);
      } else {
        localStorage.removeItem(ORDER_ID_KEY);
      }
    });
  }, []);

  const handleSubmit = (payload: CreateOrderPayload) => {
    setSubmitting(true);
    setError(null);
    submitOrder(payload)
      .then((submitted) => {
        localStorage.setItem(ORDER_ID_KEY, submitted.id);
        localStorage.setItem(
          LAST_ORDER_KEY,
          JSON.stringify({ name: payload.name, selections: payload.selections, quantities: payload.quantities ?? {} }),
        );
        setOrder(submitted);
      })
      .catch((submitError: Error) => setError(submitError.message))
      .finally(() => setSubmitting(false));
  };

  const handleReset = () => {
    localStorage.removeItem(ORDER_ID_KEY);
    setOrder(null);
  };

  if (menuError) {
    return <p className="p-8 text-center text-stone-500">{menuError}</p>;
  }

  if (!menu) {
    return <p className="p-8 text-center text-stone-400">Chargement du menu…</p>;
  }

  return (
    <div className="min-h-full">
      <ConnectionBanner />
      <div className="mx-auto max-w-xl px-4">
        <header className="py-6 text-center">
          <h1 className="text-3xl font-extrabold text-orange-600">{menu.eventName}</h1>
          {menu.subtitle && <p className="mt-1 text-stone-500">{menu.subtitle}</p>}
        </header>

        {order ? (
          <OrderStatusView order={order} onReset={handleReset} />
        ) : (
          <BurgerBuilder
            menu={menu}
            submitting={submitting}
            error={error}
            disabledStock={disabledStock}
            initialName={lastOrder?.name}
            initialSelections={lastOrder?.selections}
            initialQuantities={lastOrder?.quantities}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};
