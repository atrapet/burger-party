import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderPage } from '@/pages/OrderPage';
import { KitchenPage } from '@/pages/KitchenPage';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const App: FC = () => (
  <BrowserRouter basename={base}>
    <Routes>
      <Route path="/" element={<OrderPage />} />
      <Route path="/kitchen" element={<KitchenPage />} />
    </Routes>
  </BrowserRouter>
);
