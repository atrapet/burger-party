// Shared API contract between the React app and the Node server.

export type SelectionMode = 'single' | 'multi';

export type OptionType = {
  id: string;
  label: string;
};

export type CategoryType = {
  id: string;
  label: string;
  emoji?: string;
  selection: SelectionMode;
  required?: boolean;
  max?: number;
  quantifiable?: boolean;
  options: OptionType[];
};

export type MenuConfig = {
  eventName: string;
  subtitle?: string;
  friends: string[];
  categories: CategoryType[];
};

// Raw selections collected in the order form: one option id (single) or many (multi).
export type SelectionMap = Record<string, string | string[]>;

// Per-category, per-option quantity (1 or 2). Only present for quantifiable categories.
export type QuantityMap = Record<string, Record<string, 1 | 2>>;

export type CreateOrderPayload = {
  name: string;
  selections: SelectionMap;
  quantities?: QuantityMap;
  note?: string;
};

// Display-ready line resolved server-side so the kitchen ticket is readable.
export type OrderItem = {
  categoryId: string;
  label: string;
  emoji: string;
  options: string[];
};

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'served' | 'cancelled';

export type Order = {
  id: string;
  number: number;
  name: string;
  items: OrderItem[];
  note: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
};

// Socket ack: either the mutated order, or a validation error string.
export type OrderAck = { order: Order } | { error: string };
