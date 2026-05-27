import type { CategoryType, SelectionMap } from '@/types';

export const isSelected = (value: string | string[] | undefined, optionId: string): boolean =>
  Array.isArray(value) ? value.includes(optionId) : value === optionId;

// Returns the next selection value for a category after tapping an option.
export const toggleOption = (
  category: CategoryType,
  value: string | string[] | undefined,
  optionId: string,
): string | string[] | undefined => {
  if (category.selection === 'single') {
    if (value === optionId) return category.required ? optionId : undefined;
    return optionId;
  }

  const current = Array.isArray(value) ? value : [];
  if (current.includes(optionId)) return current.filter((id) => id !== optionId);
  if (category.max && current.length >= category.max) return current;
  return [...current, optionId];
};

const hasValue = (value: string | string[] | undefined): boolean =>
  Array.isArray(value) ? value.length !== 0 : Boolean(value);

// Required categories must all have a selection before the order can be sent.
export const missingRequired = (categories: CategoryType[], selections: SelectionMap): string[] =>
  categories
    .filter((category) => category.required && !hasValue(selections[category.id]))
    .map((category) => category.label);
