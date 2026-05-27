import type { FC } from 'react';
import type { CategoryType } from '@/types';
import { OptionChip } from '@/ui/OptionChip';
import { isSelected, toggleOption } from '@/lib/selection';

type Props = {
  category: CategoryType;
  value: string | string[] | undefined;
  onChange: (next: string | string[] | undefined) => void;
  quantities?: Record<string, 1 | 2>;
  onQuantityChange?: (optionId: string, qty: 1 | 2) => void;
  disabledStock?: Set<string>;
};

const hint = (category: CategoryType): string => {
  if (category.selection === 'single') return category.required ? 'Choix unique' : 'Optionnel';
  return category.max ? `Plusieurs choix · max ${category.max}` : 'Plusieurs choix';
};

// One ingredient category rendered as a row of selectable chips (single or multi).
export const CategoryPicker: FC<Props> = ({
  category,
  value,
  onChange,
  quantities = {},
  onQuantityChange,
  disabledStock = new Set(),
}) => {
  const atMax =
    category.selection === 'multi' &&
    Boolean(category.max) &&
    Array.isArray(value) &&
    value.length >= category.max!;

  const selectedIds = category.options
    .map((o) => o.id)
    .filter((id) => isSelected(value, id));

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-stone-800">
          {category.emoji} {category.label}
        </h2>
        <span className="text-xs font-medium text-stone-400">{hint(category)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.options.map((option) => {
          const outOfStock = disabledStock.has(option.id);
          return (
            <OptionChip
              key={option.id}
              label={outOfStock ? `${option.label} · épuisé` : option.label}
              selected={isSelected(value, option.id)}
              disabled={(atMax && !isSelected(value, option.id)) || outOfStock}
              onClick={() => onChange(toggleOption(category, value, option.id))}
            />
          );
        })}
      </div>
      {category.quantifiable && selectedIds.length !== 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedIds.map((id) => {
            const label = category.options.find((o) => o.id === id)?.label ?? id;
            const qty = quantities[id] ?? 1;
            return (
              <div key={id} className="flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm">
                <span className="font-medium text-orange-800">{label}</span>
                <span className="mx-1 text-orange-300">·</span>
                <button
                  type="button"
                  onClick={() => onQuantityChange?.(id, 1)}
                  className={`rounded px-1 font-semibold transition-colors ${qty === 1 ? 'text-orange-600' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  ×1
                </button>
                <button
                  type="button"
                  onClick={() => onQuantityChange?.(id, 2)}
                  className={`rounded px-1 font-semibold transition-colors ${qty === 2 ? 'text-orange-600' : 'text-stone-400 hover:text-stone-600'}`}
                >
                  ×2
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
