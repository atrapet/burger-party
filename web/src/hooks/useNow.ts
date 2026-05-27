import { useEffect, useState } from 'react';

// Ticking clock so elapsed-time labels on kitchen tickets stay fresh.
export const useNow = (intervalMs = 30000): number => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
};
