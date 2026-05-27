import type { FC } from 'react';

type Props = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export const OptionChip: FC<Props> = ({ label, selected, disabled = false, onClick }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-full border px-4 py-2 text-base font-medium transition-colors disabled:opacity-40 ${
      selected
        ? 'border-orange-600 bg-orange-600 text-white'
        : 'border-stone-300 bg-white text-stone-700 active:bg-stone-50'
    }`}
  >
    {label}
  </button>
);
