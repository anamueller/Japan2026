"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Flag,
  MapPinned,
  Pencil,
  Star,
  Trash2,
  ThumbsDown,
  ThumbsUp,
  TrainFront,
  Wallet,
} from "lucide-react";
import { AttractionEditor } from "@/components/AttractionEditor";
import {
  attractionToDraft,
  type Attraction,
  type AttractionDraft,
} from "@/lib/mock-data";
import { formatDateShort } from "@/lib/dates";

type AttractionCardProps = {
  attraction: Attraction;
  focused?: boolean;
  onFocus?: (id: string) => void;
  onSave?: (id: string, draft: AttractionDraft) => void;
  onDelete?: (id: string) => void;
  onStartFrom?: (id: string) => void;
  dates?: string[];
};

export function AttractionCard({
  attraction,
  focused = false,
  onFocus,
  onSave,
  onDelete,
  onStartFrom,
  dates = [],
}: AttractionCardProps) {
  const [editing, setEditing] = useState(false);
  const [upvotes, setUpvotes] = useState(attraction.upvotes);
  const [downvotes, setDownvotes] = useState(attraction.downvotes);
  const [vote, setVote] = useState<"up" | "down" | null>(null);

  function castVote(next: "up" | "down") {
    if (vote === next) {
      if (next === "up") setUpvotes((value) => value - 1);
      else setDownvotes((value) => value - 1);
      setVote(null);
      return;
    }
    if (vote === "up") setUpvotes((value) => value - 1);
    if (vote === "down") setDownvotes((value) => value - 1);
    if (next === "up") setUpvotes((value) => value + 1);
    else setDownvotes((value) => value + 1);
    setVote(next);
  }

  return (
    <article
      className={`rounded-xl border bg-white shadow-sm transition ${
        focused
          ? "border-jp-red ring-2 ring-jp-red/10"
          : "border-slate-200"
      }`}
    >
      {editing && onSave ? (
        <div className="p-3">
          <AttractionEditor
            initial={attractionToDraft(attraction)}
            dates={dates}
            submitLabel="Salvar"
            onSubmit={(draft) => {
              onSave(attraction.id, draft);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <div className="flex gap-3 p-2.5">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-200">
            {attraction.image ? (
              <img
                src={attraction.image}
                alt={attraction.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-slate-400">
                {attraction.imageLabel}
              </div>
            )}
            <span className="absolute top-1 left-1 rounded-full bg-white/95 px-1.5 py-0.5 text-[10px] font-medium text-slate-800 shadow-sm">
              {attraction.categoryEmoji} {attraction.category}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-slate-900">
                  {attraction.name}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-slate-500">
                  {attraction.address || attraction.name}
                </p>
              </div>
              <div className="flex shrink-0">
                {onSave && (
                  <button
                    type="button"
                    aria-label={`Editar ${attraction.name}`}
                    onClick={() => setEditing(true)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    aria-label={`Excluir ${attraction.name}`}
                    onClick={() => onDelete(attraction.id)}
                    className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            <Stars
              value={attraction.rating}
              count={attraction.userRatingCount}
            />
            <PlaceNote text={attraction.description ?? ""} />
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3 text-slate-400" />
                {attraction.date ? formatDateShort(attraction.date) : "Sem data"}
              </span>
              <span className="inline-flex items-center gap-1">
                <TrainFront className="h-3 w-3 text-slate-400" />
                {attraction.station}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3 text-slate-400" />
                {attraction.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <Wallet className="h-3 w-3 text-slate-400" />
                {attraction.price}
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-pressed={vote === "up"}
                  aria-label={`Curtir ${attraction.name}`}
                  onClick={() => castVote("up")}
                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] ${
                    vote === "up"
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-500 hover:bg-emerald-50"
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                  {upvotes}
                </button>
                <button
                  type="button"
                  aria-pressed={vote === "down"}
                  aria-label={`Não curtir ${attraction.name}`}
                  onClick={() => castVote("down")}
                  className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] ${
                    vote === "down"
                      ? "bg-rose-50 text-rose-700"
                      : "text-slate-500 hover:bg-rose-50"
                  }`}
                >
                  <ThumbsDown className="h-3 w-3" />
                  {downvotes}
                </button>
              </div>
              <div className="flex items-center">
                {onStartFrom && (
                  <button
                    type="button"
                    aria-label={`Começar a rota em ${attraction.name}`}
                    title="Começar a otimização neste local"
                    onClick={() => onStartFrom(attraction.id)}
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                  >
                    <Flag className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  aria-label={`Focar ${attraction.name} no mapa`}
                  onClick={() => onFocus?.(attraction.id)}
                  className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
                >
                  <MapPinned className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

function PlaceNote({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const note = text.trim();
  if (!note) return null;
  const long = note.length > 90;
  return (
    <div className="mt-1.5">
      <p
        className={`text-[11px] leading-snug text-slate-600 ${
          open || !long ? "" : "line-clamp-2"
        }`}
      >
        {note}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-0.5 text-[11px] font-medium text-jp-red hover:underline"
        >
          {open ? "ver menos" : "ver mais"}
        </button>
      ) : null}
    </div>
  );
}

function Stars({ value, count }: { value: number; count: number }) {
  const filled = Math.round(value);

  return (
    <p className="mt-1 flex items-center gap-0.5" aria-label={`${value} de 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-3 w-3 ${
            index < filled
              ? "fill-amber-400 text-amber-400"
              : "text-slate-300"
          }`}
        />
      ))}
      <span className="ml-1 text-[11px] text-slate-500">
        {value > 0 ? value.toFixed(1) : "—"}
        {count > 0 ? ` (${count.toLocaleString("pt-BR")})` : ""}
      </span>
    </p>
  );
}
