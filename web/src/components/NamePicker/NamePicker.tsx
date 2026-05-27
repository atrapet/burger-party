import { useState } from 'react';
import type { FC } from 'react';

type Props = {
  friends: string[];
  value: string;
  onChange: (name: string) => void;
};

const CUSTOM = '__custom__';

export const NamePicker: FC<Props> = ({ friends, value, onChange }) => {
  const isCustom = value !== '' && !friends.includes(value);
  const [custom, setCustom] = useState(isCustom);

  const handleSelect = (selected: string) => {
    if (selected === CUSTOM) {
      setCustom(true);
      onChange('');
    } else {
      setCustom(false);
      onChange(selected);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <select
        value={custom ? CUSTOM : value}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-orange-500"
      >
        <option value={CUSTOM}>Choisis ton prénom…</option>
        {friends.map((friend) => (
          <option key={friend} value={friend}>{friend}</option>
        ))}
      </select>
      {custom && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ton prénom"
          autoFocus
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-orange-500"
        />
      )}
    </div>
  );
};
