import type { FC } from 'react';

type Props = {
  friends: string[];
  value: string;
  onChange: (name: string) => void;
};

export const NamePicker: FC<Props> = ({ friends, value, onChange }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-orange-500"
  >
    <option value="" disabled>Choisis ton prénom…</option>
    {friends.map((friend) => (
      <option key={friend} value={friend}>{friend}</option>
    ))}
  </select>
);
