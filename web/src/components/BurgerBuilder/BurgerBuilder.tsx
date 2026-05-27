import { useState } from 'react';
import type { FC } from 'react';
import type { CreateOrderPayload, MenuConfig, SelectionMap } from '@/types';
import { NamePicker } from '@/components/NamePicker/NamePicker';
import { CategoryPicker } from '@/components/CategoryPicker/CategoryPicker';
import { Button } from '@/ui/Button';
import { missingRequired } from '@/lib/selection';

type Props = {
  menu: MenuConfig;
  submitting: boolean;
  error: string | null;
  onSubmit: (payload: CreateOrderPayload) => void;
};

// Self-contained ordering form: name, per-category choices, an optional note, submit.
export const BurgerBuilder: FC<Props> = ({ menu, submitting, error, onSubmit }) => {
  const [name, setName] = useState('');
  const [selections, setSelections] = useState<SelectionMap>({});
  const [note, setNote] = useState('');

  const missing = missingRequired(menu.categories, selections);
  const canSubmit = name.trim().length !== 0 && missing.length === 0 && !submitting;

  const updateSelection = (categoryId: string, next: string | string[] | undefined) =>
    setSelections((prev) => ({ ...prev, [categoryId]: next ?? '' }));

  return (
    <div className="flex flex-col gap-6 pb-28">
      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-stone-800">👋 Ton prénom</h2>
        <NamePicker friends={menu.friends} value={name} onChange={setName} />
      </section>

      {menu.categories.map((category) => (
        <CategoryPicker
          key={category.id}
          category={category}
          value={selections[category.id]}
          onChange={(next) => updateSelection(category.id, next)}
        />
      ))}

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-stone-800">📝 Une précision ?</h2>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="ex : bien cuit, sans oignon…"
          rows={2}
          className="w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-orange-500"
        />
      </section>

      <div className="fixed inset-x-0 bottom-0 border-t border-orange-100 bg-white/95 p-4 backdrop-blur">
        <div className="mx-auto max-w-xl">
          {error && <p className="mb-2 text-center text-sm font-medium text-red-600">{error}</p>}
          {missing.length !== 0 && (
            <p className="mb-2 text-center text-sm text-stone-500">À choisir : {missing.join(', ')}</p>
          )}
          <Button
            className="w-full"
            disabled={!canSubmit}
            onClick={() => onSubmit({ name, selections, note })}
          >
            {submitting ? 'Envoi…' : 'Envoyer en cuisine 🍔'}
          </Button>
        </div>
      </div>
    </div>
  );
};
