"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { formatDateShort } from "@/lib/dates";
import type { AttractionDraft } from "@/lib/mock-data";
import { fetchPlaceDetails, searchPlaces } from "@/lib/places-client";
import type { PlaceSuggestion } from "@/lib/places";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-slate-400";

type AttractionEditorProps = {
  initial: AttractionDraft;
  dates: string[];
  submitLabel: string;
  onSubmit: (draft: AttractionDraft) => void;
  onCancel: () => void;
};

export function AttractionEditor({
  initial,
  dates,
  submitLabel,
  onSubmit,
  onCancel,
}: AttractionEditorProps) {
  const [draft, setDraft] = useState<AttractionDraft>(initial);
  const [query, setQuery] = useState(initial.name);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionToken = useRef(crypto.randomUUID());

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2 || value === draft.name) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const hits = await searchPlaces(value, sessionToken.current);
      setSuggestions(hits);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, draft.name]);

  async function pickSuggestion(suggestion: PlaceSuggestion) {
    const details = await fetchPlaceDetails(
      suggestion.placeId,
      sessionToken.current,
    );
    sessionToken.current = crypto.randomUUID();
    setSuggestions([]);
    if (!details) return;
    setQuery(details.name);
    setDraft((current) => ({
      ...current,
      name: details.name,
      placeId: details.placeId,
      address: details.address,
      station: details.station,
      rating: details.rating,
      userRatingCount: details.userRatingCount,
      image: details.image,
      lat: details.lat,
      lng: details.lng,
      category: details.category,
      categoryEmoji: details.categoryEmoji,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.placeId || !draft.name.trim()) return;
    onSubmit({ ...draft, name: draft.name.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="relative flex flex-col gap-1 text-xs font-medium text-slate-600">
        Local
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Busque no Google: Senso-ji, Shibuya, ramen..."
          className={fieldClass}
          autoFocus
        />
        {(loading || suggestions.length > 0) && (
          <ul className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
            {loading && suggestions.length === 0 && (
              <li className="px-3 py-2 text-xs text-slate-400">Buscando…</li>
            )}
            {suggestions.map((item) => (
              <li key={item.placeId}>
                <button
                  type="button"
                  onClick={() => pickSuggestion(item)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-slate-50"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-500">{item.subtitle}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </label>

      {draft.address && (
        <p className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
          {draft.categoryEmoji} {draft.category} · {draft.address}
          {draft.station ? ` · Estação ${draft.station}` : ""}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Data
          <select
            value={draft.date ?? ""}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                date: event.target.value || null,
              }))
            }
            className={fieldClass}
          >
            <option value="">Sem data</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {formatDateShort(date)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Permanência
          <input
            value={draft.duration}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                duration: event.target.value,
              }))
            }
            placeholder="2 horas"
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          Valor
          <input
            value={draft.price}
            onChange={(event) =>
              setDraft((current) => ({ ...current, price: event.target.value }))
            }
            placeholder="¥1000"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-3 py-2 text-sm text-slate-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!draft.placeId}
          className="rounded-xl bg-jp-red px-3 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
