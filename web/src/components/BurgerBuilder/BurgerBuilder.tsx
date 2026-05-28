import { useEffect, useState } from 'react';
import type { FC } from 'react';
import type { CreateOrderPayload, MenuConfig, QuantityMap, SelectionMap } from '@/types';
import { NamePicker } from '@/components/NamePicker/NamePicker';
import { CategoryPicker } from '@/components/CategoryPicker/CategoryPicker';
import { Button } from '@/ui/Button';
import { missingRequired } from '@/lib/selection';

type Props = {
  menu: MenuConfig;
  submitting: boolean;
  error: string | null;
  disabledStock: Set<string>;
  initialName?: string;
  initialSelections?: SelectionMap;
  initialQuantities?: QuantityMap;
  onSubmit: (payload: CreateOrderPayload) => void;
};

// Self-contained ordering form: name, per-category choices, an optional note, submit.
export const BurgerBuilder: FC<Props> = ({
  menu, submitting, error, disabledStock,
  initialName = '', initialSelections = {}, initialQuantities = {},
  onSubmit,
}) => {
  const [name, setName] = useState(initialName);
  const [selections, setSelections] = useState<SelectionMap>(initialSelections);
  const [quantities, setQuantities] = useState<QuantityMap>(initialQuantities);
  const [note, setNote] = useState('');
  const [splitForTwo, setSplitForTwo] = useState(false);

  // Auto-deselect options that go out of stock while the form is open.
  useEffect(() => {
    if (disabledStock.size === 0) return;
    setSelections((prev) => {
      const next = { ...prev };
      for (const [catId, val] of Object.entries(next)) {
        if (Array.isArray(val)) {
          next[catId] = val.filter((id) => !disabledStock.has(id));
        } else if (typeof val === 'string' && disabledStock.has(val)) {
          next[catId] = '';
        }
      }
      return next;
    });
  }, [disabledStock]);

  const missing = missingRequired(menu.categories, selections);
  const canSubmit = name.trim().length !== 0 && missing.length === 0 && !submitting;

  const updateSelection = (categoryId: string, next: string | string[] | undefined) =>
    setSelections((prev) => ({ ...prev, [categoryId]: next ?? '' }));

  const updateQuantity = (categoryId: string, optionId: string, qty: 1 | 2) =>
    setQuantities((prev) => ({
      ...prev,
      [categoryId]: { ...(prev[categoryId] ?? {}), [optionId]: qty },
    }));

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
          quantities={quantities[category.id]}
          disabledStock={disabledStock}
          onChange={(next) => updateSelection(category.id, next)}
          onQuantityChange={(optionId, qty) => updateQuantity(category.id, optionId, qty)}
        />
      ))}

      <section>
        <button
          type="button"
          onClick={() => setSplitForTwo((v) => !v)}
          className={`w-full rounded-2xl border-2 px-4 py-4 text-left transition-colors ${
            splitForTwo
              ? 'border-orange-400 bg-orange-50'
              : 'border-stone-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-base font-bold text-stone-800">✂️ Burger pour deux</span>
              <p className="mt-0.5 text-sm text-stone-500">Un burger servi coupé en 2 assiettes</p>
            </div>
            <div
              className={`h-6 w-11 rounded-full transition-colors ${
                splitForTwo ? 'bg-orange-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  splitForTwo ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
        </button>
      </section>

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
            onClick={() => onSubmit({ name, selections, quantities, note, splitForTwo })}
          >
            {submitting ? 'Envoi…' : 'Envoyer en cuisine 🍔'}
          </Button>
        </div>
      </div>
    </div>
  );
};
