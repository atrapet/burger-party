import { randomUUID } from 'node:crypto';
import { config, categoryById, optionLabel } from './config.js';
import { insertOrder, updateOrderStatus, getOrder } from './db.js';

// Status progression for the kitchen board; 'advance' walks this list, 'cancelled' is terminal.
export const STATUS_FLOW = ['new', 'cooking', 'ready', 'served'];

const asArray = (value) => (Array.isArray(value) ? value : [value]);

const resolveSelection = (category, raw, qtys = {}) => {
  const ids = asArray(raw).filter(Boolean);
  const labels = ids.map((id) => {
    const base = optionLabel(category.id, id);
    if (!base) return null;
    return qtys[id] === 2 ? `${base} ×2` : base;
  }).filter(Boolean);
  return { categoryId: category.id, label: category.label, emoji: category.emoji ?? '', options: labels };
};

const validateCategory = (category, raw) => {
  const ids = asArray(raw).filter(Boolean);
  if (category.required && ids.length === 0) {
    return `Choix obligatoire manquant : ${category.label}`;
  }
  if (category.selection === 'single' && ids.length > 1) {
    return `Un seul choix autorisé pour ${category.label}`;
  }
  if (category.selection === 'multi' && category.max && ids.length > category.max) {
    return `Maximum ${category.max} choix pour ${category.label}`;
  }
  if (ids.some((id) => optionLabel(category.id, id) === null)) {
    return `Option inconnue dans ${category.label}`;
  }
  return null;
};

// Validates the raw selections against config and returns either an error or the
// display-ready items (labels resolved now so the kitchen ticket survives config edits).
const buildItems = (selections, quantities = {}) => {
  const items = [];
  for (const category of config.categories) {
    const error = validateCategory(category, selections[category.id]);
    if (error) return { error };
    const resolved = resolveSelection(category, selections[category.id], quantities[category.id] ?? {});
    if (resolved.options.length !== 0) items.push(resolved);
  }
  return { items };
};

export const createOrder = ({ name, selections, note, quantities }) => {
  const trimmedName = typeof name === 'string' ? name.trim() : '';
  if (trimmedName.length === 0) return { error: 'Indique ton prénom' };

  const { error, items } = buildItems(selections ?? {}, quantities ?? {});
  if (error) return { error };

  const now = Date.now();
  const order = insertOrder({
    id: randomUUID(),
    name: trimmedName,
    items,
    note: typeof note === 'string' ? note.trim().slice(0, 280) : '',
    status: 'new',
    createdAt: now,
    updatedAt: now,
  });
  return { order };
};

export const advanceOrder = (id) => {
  const current = getOrder(id);
  if (!current) return { error: 'Commande introuvable' };
  const next = STATUS_FLOW[STATUS_FLOW.indexOf(current.status) + 1];
  if (!next) return { order: current };
  return { order: updateOrderStatus(id, next, Date.now()) };
};

export const setOrderStatus = (id, status) => {
  if (![...STATUS_FLOW, 'cancelled'].includes(status)) return { error: 'Statut invalide' };
  if (!getOrder(id)) return { error: 'Commande introuvable' };
  return { order: updateOrderStatus(id, status, Date.now()) };
};
