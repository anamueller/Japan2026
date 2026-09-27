"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { CityRouteMap } from "@/components/CityRouteMap";
import { TransitBoard, WeatherBoard } from "@/components/TripBoards";
import { eachDate, formatDate, formatDateShort } from "@/lib/dates";
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
      name: "Nova cidade",
      start: last?.end ?? "2026-11-10",
      end: last?.end ?? "2026-11-12",
      lat: last?.lat ?? 35.68,
      lng: last?.lng ?? 139.76,
    };
    onChange([...cities, next]);
    setEditingId(next.id);
  }

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-jp-paper px-8 py-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-lg font-semibold text-stone-900">Cidades da viagem</h2>
        <p className="mt-1 text-sm text-stone-500">
          Clima e o trecho mais rápido entre as cidades. Clique numa cidade da
          rota para editar.
        </p>

        <div className="mt-5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-900">Editar cidade</h3>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setEditingId(null)}
                className="rounded-md p-1 text-stone-400 hover:bg-rose-50 hover:text-jp-red"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
              Cidade
              <input
                value={editing.name}
                onChange={(event) => update(editing.id, { name: event.target.value })}
                className="rounded-xl border border-rose-100 px-3 py-2 text-sm text-stone-800 outline-none focus:border-jp-red"
              />
            </label>
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
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  onOpenCity(editing.id);
                }}
                className="rounded-xl bg-jp-red px-3 py-1.5 text-xs font-medium text-white"
              >
                Ver locais
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
