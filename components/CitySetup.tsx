"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CityRouteMap } from "@/components/CityRouteMap";
import { TransitBoard, WeatherBoard } from "@/components/TripBoards";
import { eachDate, formatDate, formatDateShort } from "@/lib/dates";
import { fetchPlaceDetails, searchPlaces } from "@/lib/places-client";
import type { PlaceSuggestion } from "@/lib/places";
import type { CityStay } from "@/lib/trip";

type CitySetupProps = {
  cities: CityStay[];
  onChange: (cities: CityStay[]) => void;
  onOpenCity: (id: string) => void;
};

export function CitySetup({ cities, onChange, onOpenCity }: CitySetupProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = cities.find((city) => city.id === editingId);

  function update(id: string, patch: Partial<CityStay>) {
    onChange(cities.map((city) => (city.id === id ? { ...city, ...patch } : city)));
  }

  function add() {
    const last = cities[cities.length - 1];
    const next: CityStay = {
      id: crypto.randomUUID(),
      name: "",
      start: last?.end ?? "2026-11-10",
      end: last?.end ?? "2026-11-12",
      lat: last?.lat ?? 35.68,
      lng: last?.lng ?? 139.76,
    };
    onChange([...cities, next]);
    setEditingId(next.id);
  }

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-jp-paper px-4 py-4 md:px-8 md:py-6">
      <div className="mx-auto max-w-5xl">
        <div>
          <WeatherBoard cities={cities} />
        </div>

        <div className="mt-6">
          <TransitBoard
            cities={cities}
            onSelectCity={setEditingId}
            action={
              <button
                type="button"
                onClick={add}
                className="inline-flex items-center gap-1 text-xs font-medium text-jp-red hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Adicionar cidade
              </button>
            }
          />
          <CityRouteMap cities={cities} />
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-3 sm:items-center sm:p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Editar cidade</h3>
            </div>
            <CityNameSearch
              name={editing.name}
              onPick={(place) =>
                update(editing.id, {
                  name: place.name,
                  lat: place.lat,
                  lng: place.lng,
                })
              }
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
                Chegada
                <input
                  type="date"
                  value={editing.start}
                  onChange={(event) => update(editing.id, { start: event.target.value })}
                  className="rounded-xl border border-rose-100 px-3 py-2 text-sm text-stone-800 outline-none focus:border-jp-red"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
                Saída
                <input
                  type="date"
                  value={editing.end}
                  onChange={(event) => update(editing.id, { end: event.target.value })}
                  className="rounded-xl border border-rose-100 px-3 py-2 text-sm text-stone-800 outline-none focus:border-jp-red"
                />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {eachDate(editing.start, editing.end).map((date) => (
                <span
                  key={date}
                  className="rounded-full bg-jp-paper px-2 py-0.5 text-[11px] text-stone-600"
                >
                  {formatDateShort(date)}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-stone-500">
              {formatDate(editing.start)} — {formatDate(editing.end)}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <button
                type="button"
                aria-label={`Remover ${editing.name}`}
                onClick={() => {
                  onChange(cities.filter((item) => item.id !== editing.id));
                  setEditingId(null);
                }}
                className="inline-flex items-center gap-1 text-xs text-jp-red"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remover
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    onOpenCity(editing.id);
                  }}
                  className="rounded-xl px-3 py-1.5 text-xs font-medium text-jp-red hover:bg-rose-50"
                >
                  Ver locais
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-xl bg-jp-red px-3 py-1.5 text-xs font-medium text-white"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function CityNameSearch({
  name,
  onPick,
}: {
  name: string;
  onPick: (place: { name: string; lat: number; lng: number }) => void;
}) {
  const [query, setQuery] = useState(name);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionToken = useRef(crypto.randomUUID());

  useEffect(() => {
    setQuery(name);
  }, [name]);

  useEffect(() => {
    const value = query.trim();
    if (value.length < 2 || value === name) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const cities = await searchPlaces(value, sessionToken.current, [
        "locality",
        "administrative_area_level_1",
      ]);
      const hits =
        cities.length > 0
          ? cities
          : await searchPlaces(value, sessionToken.current);
      setSuggestions(hits);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, name]);

  async function pick(suggestion: PlaceSuggestion) {
    const details = await fetchPlaceDetails(suggestion.placeId, sessionToken.current);
    sessionToken.current = crypto.randomUUID();
    setSuggestions([]);
    if (!details) return;
    setQuery(details.name);
    onPick({ name: details.name, lat: details.lat, lng: details.lng });
  }

  return (
    <label className="relative flex flex-col gap-1 text-xs font-medium text-stone-600">
      Cidade
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Busque no Google: Osaka, Kanazawa..."
        className="rounded-xl border border-rose-100 px-3 py-2 text-sm text-stone-800 outline-none focus:border-jp-red"
        autoFocus
      />
      {(loading || suggestions.length > 0) && (
        <ul className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-rose-100 bg-white py-1 shadow-lg">
          {loading && suggestions.length === 0 && (
            <li className="px-3 py-2 text-xs text-stone-400">Buscando…</li>
          )}
          {suggestions.map((item) => (
            <li key={item.placeId}>
              <button
                type="button"
                onClick={() => pick(item)}
                className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-rose-50"
              >
                <span className="text-sm font-medium text-stone-800">{item.name}</span>
                <span className="text-xs text-stone-500">{item.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </label>
  );
}
