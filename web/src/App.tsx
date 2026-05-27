import type { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { OrderPage } from '@/pages/OrderPage';
import { KitchenPage } from '@/pages/KitchenPage';

export const App: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<OrderPage />} />
      <Route path="/kitchen" element={<KitchenPage />} />
    </Routes>
  </BrowserRouter>
);
