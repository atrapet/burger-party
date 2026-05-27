import type { FC } from 'react';
import type { Order } from '@/types';
import { useOrderTracking } from '@/hooks/useOrderTracking';
import { STATUS_META } from '@/lib/status';
import { Card } from '@/ui/Card';
import { Button } from '@/ui/Button';
import { OrderItems } from '@/components/OrderItems/OrderItems';

type Props = {
  order: Order;
  onReset: () => void;
};

// Confirmation + live status screen shown to a guest after they submit their order.
export const OrderStatusView: FC<Props> = ({ order, onReset }) => {
  const tracked = useOrderTracking(order);
  const meta = STATUS_META[tracked.status];

  return (
    <div className="flex flex-col items-center gap-6 pt-8 text-center">
      <div className="text-6xl">{meta.emoji}</div>
      <div>
        <p className="text-sm font-medium text-stone-500">Commande n°{tracked.number}</p>
        <h1 className="text-2xl font-extrabold text-stone-800">{meta.guestLabel}</h1>
      </div>

      <Card className="w-full text-left">
        <p className="mb-2 font-bold text-stone-800">{tracked.name}</p>
        <OrderItems items={tracked.items} />
        {tracked.note && <p className="mt-2 text-sm italic text-stone-500">« {tracked.note} »</p>}
      </Card>

      <Button variant="secondary" onClick={onReset}>
        Passer une autre commande
      </Button>
    </div>
  );
};
