import { useState } from 'react';
import type { FC, KeyboardEvent } from 'react';
import { setFriends } from '@/lib/socket';

type Props = {
  friends: string[];
  onClose: () => void;
};

export const FriendsEditor: FC<Props> = ({ friends, onClose }) => {
  const [input, setInput] = useState('');

  const commit = (next: string[]) => setFriends(next);

  const handleAdd = () => {
    const name = input.trim();
    if (name.length === 0 || friends.includes(name)) return;
    commit([...friends, name]);
    setInput('');
  };

  const handleRemove = (name: string) => commit(friends.filter((f) => f !== name));

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <aside className="w-64 shrink-0 overflow-y-auto rounded-xl bg-white shadow-lg">
      <div className="sticky top-0 flex items-center justify-between border-b border-stone-100 bg-white px-4 py-3">
        <h2 className="font-bold text-stone-800">👥 Invités</h2>
        <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-600">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1 p-4">
        {friends.length === 0 && (
          <p className="text-sm text-stone-400">Aucun invité pour l'instant.</p>
        )}
        {friends.map((name) => (
          <div key={name} className="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-sm font-medium text-stone-800">
            <span>{name}</span>
            <button
              type="button"
              onClick={() => handleRemove(name)}
              className="ml-2 text-stone-300 hover:text-red-500 transition-colors"
              aria-label={`Retirer ${name}`}
            >
              ✕
            </button>
          </div>
        ))}

        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ajouter un invité…"
            className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-orange-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={input.trim().length === 0}
            className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>
    </aside>
  );
};
