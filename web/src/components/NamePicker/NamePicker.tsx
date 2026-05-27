import type { FC } from 'react';
import { OptionChip } from '@/ui/OptionChip';

type Props = {
  friends: string[];
  value: string;
  onChange: (name: string) => void;
};

// Friends pick their name from the list, or type a custom one in the field below.
export const NamePicker: FC<Props> = ({ friends, value, onChange }) => (
  <div className="flex flex-col gap-3">
    <div className="flex flex-wrap gap-2">
      {friends.map((friend) => (
        <OptionChip
          key={friend}
          label={friend}
          selected={value === friend}
          onClick={() => onChange(friend)}
        />
      ))}
    </div>
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="…ou écris ton prénom"
      className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-orange-500"
    />
  </div>
);
