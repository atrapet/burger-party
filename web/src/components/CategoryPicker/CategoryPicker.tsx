import type { FC } from 'react';
import type { CategoryType } from '@/types';
import { OptionChip } from '@/ui/OptionChip';
import { isSelected, toggleOption } from '@/lib/selection';

type Props = {
  category: CategoryType;
  value: string | string[] | undefined;
  onChange: (next: string | string[] | undefined) => void;
};

const hint = (category: CategoryType): string => {
  if (category.selection === 'single') return category.required ? 'Choix unique' : 'Optionnel';
  return category.max ? `Plusieurs choix · max ${category.max}` : 'Plusieurs choix';
};

// One ingredient category rendered as a row of selectable chips (single or multi).
export const CategoryPicker: FC<Props> = ({ category, value, onChange }) => {
  const atMax =
    category.selection === 'multi' &&
    Boolean(category.max) &&
    Array.isArray(value) &&
    value.length >= category.max!;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-stone-800">
          {category.emoji} {category.label}
        </h2>
        <span className="text-xs font-medium text-stone-400">{hint(category)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {category.options.map((option) => (
          <OptionChip
            key={option.id}
            label={option.label}
            selected={isSelected(value, option.id)}
            disabled={atMax && !isSelected(value, option.id)}
            onClick={() => onChange(toggleOption(category, value, option.id))}
          />
        ))}
      </div>
    </section>
  );
};
