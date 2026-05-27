import { formatDistanceStrict } from 'date-fns';
import { fr } from 'date-fns/locale';

// "il y a 5 minutes" — elapsed time since an order came in, French locale.
export const formatElapsed = (timestamp: number, now: number): string =>
  formatDistanceStrict(timestamp, now, { locale: fr, addSuffix: true });
