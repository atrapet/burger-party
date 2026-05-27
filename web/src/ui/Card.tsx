import type { FC, ReactNode } from 'react';

type Props = {
  className?: string;
  children: ReactNode;
};

export const Card: FC<Props> = ({ className = '', children }) => (
  <div className={`rounded-2xl bg-white p-4 shadow-sm ${className}`}>{children}</div>
);
