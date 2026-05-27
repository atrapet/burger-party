import { useEffect, useState } from 'react';
import type { MenuConfig } from '@/types';

type MenuState = {
  menu: MenuConfig | null;
  error: string | null;
};

// Loads the event menu + friends list from the server config.
export const useMenu = (): MenuState => {
  const [state, setState] = useState<MenuState>({ menu: null, error: null });

  useEffect(() => {
    fetch('/api/config')
      .then((res) => res.json())
      .then((menu: MenuConfig) => setState({ menu, error: null }))
      .catch(() => setState({ menu: null, error: 'Impossible de charger le menu' }));
  }, []);

  return state;
};
