import type { FC } from 'react';
import { useConnection } from '@/hooks/useConnection';

// Slides in only while the socket is down, reassuring guests the app is reconnecting.
export const ConnectionBanner: FC = () => {
  const connected = useConnection();
  if (connected) return null;

  return (
    <div className="sticky top-0 z-10 bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white">
      Reconnexion en cours…
    </div>
  );
};
