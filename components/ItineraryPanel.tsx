"use client";

import { useState, type ReactNode } from "react";
import { CalendarDays, Plus, Route } from "lucide-react";
import { AttractionCard } from "@/components/AttractionCard";
import { AttractionEditor } from "@/components/AttractionEditor";
import { formatDate, formatDateShort } from "@/lib/dates";
import {
  emptyAttractionDraft,
  type Attraction,
  type AttractionDraft,
} from "@/lib/mock-data";

type Tab = "roteiro" | "ideias";

type ItineraryPanelProps = {
  cityName: string;
  cityId: string;
  dates: string[];
  attractions: Attraction[];
  selectedId: string;
  optimizing?: boolean;
  onFocus: (id: string) => void;
  onAdd: (draft: AttractionDraft) => void;
  onSave: (id: string, draft: AttractionDraft) => void;
  onDelete: (id: string) => void;
  onOptimize: (scope: "all" | string) => void;
  onStartFrom: (id: string) => void;
};

export function ItineraryPanel({
  cityName,
  cityId,
  dates,
  attractions,
  selectedId,
  onFocus,
  onAdd,
  onSave,
  onDelete,
  onOptimize,
  onStartFrom,
  optimizing = false,
}: ItineraryPanelProps) {
  const [tab, setTab] = useState<Tab>("roteiro");
  const [adding, setAdding] = useState(false);
  const [optimizeScope, setOptimizeScope] = useState("all");

  const scheduled = attractions.filter((item) => item.date !== null);
  const ideas = attractions.filter((item) => item.date === null);
  const usedDates = [...new Set(scheduled.map((item) => item.date!))].sort();

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-jp-paper">
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Roteiro & Ideias
        </h2>
        <div className="mt-3 flex gap-2">
          <TabButton
            active={tab === "roteiro"}
            onClick={() => setTab("roteiro")}
          >
            Roteiro
          </TabButton>
          <TabButton
            active={tab === "ideias"}
            onClick={() => setTab("ideias")}
          >
            Caixa de Ideias
          </TabButton>
        </div>
      </div>

      <div className="shrink-0 space-y-3 border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
            <CalendarDays className="h-4 w-4 text-slate-500" />
            {cityName}
          </div>
          <div className="flex items-center gap-2">
            <select
              aria-label="Escopo da otimização"
              value={optimizeScope}
              onChange={(event) => setOptimizeScope(event.target.value)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="all">Todos os dias</option>
              {usedDates.map((date) => (
                <option key={date} value={date}>
                  {formatDateShort(date)}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={optimizing}
              onClick={() => onOptimize(optimizeScope === "all" ? "all" : optimizeScope)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <Route className="h-3.5 w-3.5" />
              {optimizing ? "Otimizando…" : "Otimizar rota"}
            </button>
          </div>
        </div>
        {adding ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <AttractionEditor
              initial={emptyAttractionDraft(
                tab === "ideias" ? null : (dates[0] ?? null),
                cityId,
              )}
              dates={dates}
              submitLabel="Adicionar"
              onSubmit={(draft) => {
                onAdd(draft);
                setAdding(false);
                setTab(draft.date === null ? "ideias" : "roteiro");
              }}
              onCancel={() => setAdding(false)}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Adicionar Nova Atração
          </button>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
        {tab === "roteiro" ? (
          <div className="flex flex-col gap-6">
            {usedDates.length === 0 && (
              <p className="text-sm text-slate-500">
                Nenhuma atração no roteiro. Adicione uma e escolha a data.
              </p>
            )}
            {usedDates.map((date) => (
              <section key={date} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-slate-800">
                  {formatDate(date)}
                </h3>
                {scheduled
                  .filter((item) => item.date === date)
                  .map((attraction) => (
                    <AttractionCard
                      key={attraction.id}
                      attraction={attraction}
                      focused={attraction.id === selectedId}
                      dates={dates}
                      onFocus={onFocus}
                      onSave={onSave}
                      onDelete={onDelete}
                      onStartFrom={onStartFrom}
                    />
                  ))}
              </section>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-slate-500">
              Sem data no roteiro. Edite o card para encaixar em um dia.
            </p>
            {ideas.map((attraction) => (
              <AttractionCard
                key={attraction.id}
                attraction={attraction}
                focused={attraction.id === selectedId}
                dates={dates}
                onFocus={onFocus}
                onSave={onSave}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-jp-red text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
