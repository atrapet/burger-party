import type { FC } from 'react';
import type { OrderItem } from '@/types';

type Props = {
  items: OrderItem[];
};

// Compact recap of an order's choices, reused by the guest screen and kitchen ticket.
export const OrderItems: FC<Props> = ({ items }) => (
  <ul className="flex flex-col gap-1">
    {items.map((item) => (
      <li key={item.categoryId} className="text-sm">
        <span className="text-stone-400">{item.emoji} {item.label} : </span>
        <span className="font-medium text-stone-800">{item.options.join(', ')}</span>
      </li>
    ))}
  </ul>
);
