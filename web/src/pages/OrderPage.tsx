import { useState } from 'react';
import type { FC } from 'react';
import type { CreateOrderPayload, Order } from '@/types';
import { useMenu } from '@/hooks/useMenu';
import { submitOrder } from '@/lib/socket';
import { ConnectionBanner } from '@/ui/ConnectionBanner';
import { BurgerBuilder } from '@/components/BurgerBuilder/BurgerBuilder';
import { OrderStatusView } from '@/components/OrderStatusView/OrderStatusView';

export const OrderPage: FC = () => {
  const { menu, error: menuError } = useMenu();
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (payload: CreateOrderPayload) => {
    setSubmitting(true);
    setError(null);
    submitOrder(payload)
      .then(setOrder)
      .catch((submitError: Error) => setError(submitError.message))
      .finally(() => setSubmitting(false));
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
          <OrderStatusView order={order} onReset={() => setOrder(null)} />
        ) : (
          <BurgerBuilder menu={menu} submitting={submitting} error={error} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};
