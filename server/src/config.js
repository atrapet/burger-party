import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// CONFIG_PATH lets the deployment point at a mounted config file; defaults to the
// config.json shipped next to the server source.
const configPath = process.env.CONFIG_PATH ?? join(here, '..', 'config.json');

export const config = JSON.parse(readFileSync(configPath, 'utf8'));

// Mutable in-memory friends list; updated by the kitchen at runtime.
export let friends = [...config.friends];
export const setFriends = (list) => { friends = list; };

// Index categories and their options once so order validation/label resolution is O(1).
export const categoryById = new Map(config.categories.map((category) => [category.id, category]));

export const optionLabel = (categoryId, optionId) => {
  const category = categoryById.get(categoryId);
  if (!category) return null;
  return category.options.find((option) => option.id === optionId)?.label ?? null;
};
