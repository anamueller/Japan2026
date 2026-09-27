"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  ExternalLink,
  Hotel,
  Pencil,
  Plane,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  formatDate,
  formatDateTime,
  formatDayMonth,
  type TimeZoneId,
} from "@/lib/dates";
import {
  airportFlag,
  buildFlightDays,
  travelerHeader,
  emptyFlight,
  emptyStay,
  groupFlights,
  stayDisplayName,
  type Flight,
  type Stay,
} from "@/lib/trip";

const fieldClass =
  "w-full rounded-xl border border-rose-100 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-jp-red";

type OverviewPanelProps = {
  flights: Flight[];
  stays: Stay[];
  onFlights: (flights: Flight[]) => void;
  onStays: (stays: Stay[]) => void;
};

export function OverviewPanel({
  flights,
  stays,
  onFlights,
  onStays,
}: OverviewPanelProps) {
  const days = buildFlightDays(flights);
  const groups = groupFlights(flights);
  const orderedStays = [...stays].sort((left, right) =>
    left.checkIn.localeCompare(right.checkIn),
  );
  const [editIds, setEditIds] = useState<string[] | null>(null);
  const editingFlights = flights.filter((item) => editIds?.includes(item.id));
  const editing = editingFlights.length
    ? {
        traveler: groupFlights(editingFlights)[0]?.traveler ?? "",
        flights: editingFlights,
      }
    : null;

  function patchGroup(ids: string[], patch: Partial<Flight>) {
    onFlights(
      flights.map((item) => (ids.includes(item.id) ? { ...item, ...patch } : item)),
    );
  }

  function patchStay(id: string, patch: Partial<Stay>) {
    onStays(stays.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addFlight() {
    const flight = emptyFlight();
    onFlights([...flights, flight]);
    setEditIds([flight.id]);
  }

  return (
    <section className="min-h-0 flex-1 overflow-y-auto bg-jp-paper px-8 py-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg font-semibold text-stone-900">Visão geral 🇯🇵</h2>
        <p className="mt-1 text-sm text-stone-500">
          Voos e acomodações na ordem da viagem.
        </p>

        <div className="mt-6 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-800">Linha do tempo</h3>
          <button
            type="button"
            onClick={addFlight}
            className="inline-flex items-center gap-1 text-xs font-medium text-jp-red hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </button>
        </div>
        <FlightTimeline
          days={days}
          onOpen={(key) =>
            setEditIds(
              groups.find((group) => group.key === key)?.flights.map((item) => item.id) ?? null,
            )
          }
        />

        <div className="mt-8 flex items-center justify-between">
          <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Hotel className="h-4 w-4 text-jp-red" />
            Acomodações
          </h3>
          <button
            type="button"
            onClick={() => onStays([...stays, emptyStay()])}
            className="inline-flex items-center gap-1 text-xs font-medium text-jp-red hover:underline"
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </button>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orderedStays.map((stay) => (
            <StayPreview
              key={stay.id}
              stay={stay}
              onChange={(patch) => patchStay(stay.id, patch)}
              onRemove={() =>
                onStays(stays.filter((item) => item.id !== stay.id))
              }
            />
          ))}
        </div>
      </div>

      {editing && (
        <FlightEditor
          traveler={editing.traveler}
          flight={editing.flights[0]}
          onChange={(patch) =>
            patchGroup(
              editing.flights.map((item) => item.id),
              patch,
            )
          }
          onRemove={() => {
            onFlights(
              flights.filter(
                (item) => !editing.flights.some((row) => row.id === item.id),
              ),
            );
            setEditIds(null);
          }}
          onClose={() => setEditIds(null)}
        />
      )}
    </section>
  );
}

function FlightTimeline({
  days,
  onOpen,
}: {
  days: ReturnType<typeof buildFlightDays>;
  onOpen: (id: string) => void;
}) {
  if (days.length === 0) {
    return (
      <p className="mt-3 text-sm text-stone-500">
        Adicione voos para montar a linha do tempo.
      </p>
    );
  }

  return (
    <div className="mt-4 overflow-x-auto pb-2">
      <div className="relative flex min-w-max">
        <div className="absolute top-8 right-12 left-12 h-px bg-rose-200" />
        {days.map((day) => (
          <div
            key={day.date}
            className={`flex flex-col items-center px-2 ${day.ellipsis ? "w-12" : "w-56"}`}
          >
            <p className="h-5 text-xs font-medium text-stone-500">
              {day.ellipsis ? "…" : formatDayMonth(day.date)}
            </p>
            <span
              className={`relative z-10 my-1.5 h-3 w-3 rounded-full border-2 ${
                day.cards.length > 0
                  ? "border-jp-red bg-jp-red"
                  : "border-rose-300 bg-white"
              }`}
            />
            <div className="flex w-full flex-col gap-2">
              {day.cards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onOpen(card.id)}
                  className="overflow-hidden rounded-xl border border-rose-100 bg-white text-left shadow-sm"
                >
                  <div
                    className="flex items-center gap-2 px-2.5 py-1.5"
                    style={travelerHeader(card.traveler)}
                  >
                    <span className="text-sm leading-none">{airportFlag(card.from)}</span>
                    <p className="truncate text-xs font-semibold">{card.traveler}</p>
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="text-[10px] text-stone-400">
                      {card.airline} {card.number} · {card.from}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-stone-900">
                      {card.departTime}
                      <Plane className="h-3.5 w-3.5 text-jp-red" />
                      {card.to}
                    </p>
                    <p className="mt-0.5 text-[10px] text-stone-500">
                      {card.arriveTime} · {card.duration}
                      {card.connection ? ` · conexão ${card.connection}` : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlightEditor({
  traveler,
  flight,
  onChange,
  onRemove,
  onClose,
}: {
  traveler: string;
  flight: Flight;
  onChange: (patch: Partial<Flight>) => void;
  onRemove: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-stone-900">Editar voo</h3>
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-md p-1 text-stone-400 hover:bg-rose-50 hover:text-jp-red"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Viajante" value={traveler} onChange={(value) => onChange({ traveler: value })} />
          <Field label="PNR" value={flight.pnr} onChange={(pnr) => onChange({ pnr })} />
          <Field label="Companhia" value={flight.airline} onChange={(airline) => onChange({ airline })} />
          <Field label="Número" value={flight.number} onChange={(number) => onChange({ number })} />
          <Field label="De" value={flight.from} onChange={(from) => onChange({ from })} />
          <Field label="Para" value={flight.to} onChange={(to) => onChange({ to })} />
        </div>
        <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
          <Field
            label="Partida"
            type="datetime-local"
            value={flight.departAt}
            onChange={(departAt) => onChange({ departAt })}
          />
          <TzField value={flight.departTz} onChange={(departTz) => onChange({ departTz })} />
          <Field
            label="Chegada"
            type="datetime-local"
            value={flight.arriveAt}
            onChange={(arriveAt) => onChange({ arriveAt })}
          />
          <TzField value={flight.arriveTz} onChange={(arriveTz) => onChange({ arriveTz })} />
        </div>
        <p className="mt-2 text-xs text-stone-500">
          {formatDateTime(flight.departAt, flight.departTz)} →{" "}
          {formatDateTime(flight.arriveAt, flight.arriveTz)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-xs text-jp-red"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remover
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-jp-red px-3 py-1.5 text-xs font-medium text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function StayPreview({
  stay,
  onChange,
  onRemove,
}: {
  stay: Stay;
  onChange: (patch: Partial<Stay>) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const name = stayDisplayName(stay.name);

  if (editing) {
    return (
      <article className="rounded-xl border border-rose-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-2">
          <Field label="Nome" value={stay.name} onChange={(value) => onChange({ name: value })} />
          <Field label="Link da reserva" value={stay.link} onChange={(link) => onChange({ link })} />
          <Field label="Endereço" value={stay.address} onChange={(address) => onChange({ address })} />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Check-in"
              type="datetime-local"
              value={stay.checkIn}
              onChange={(checkIn) => onChange({ checkIn })}
            />
            <Field
              label="Check-out"
              type="datetime-local"
              value={stay.checkOut}
              onChange={(checkOut) => onChange({ checkOut })}
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md px-2 py-1 text-xs text-jp-red"
          >
            Excluir
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-xl bg-jp-red px-3 py-1.5 text-xs font-medium text-white"
          >
            Fechar
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-rose-100 bg-white shadow-sm">
      <div className="flex gap-3 p-2.5">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-rose-100">
          {stay.image ? (
            <img src={stay.image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-jp-red">
              <Hotel className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-stone-900">{name}</h3>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-stone-500">
                {stay.address}
              </p>
            </div>
            <button
              type="button"
              aria-label={`Editar ${name}`}
              onClick={() => setEditing(true)}
              className="rounded-md p-1 text-stone-400 hover:bg-rose-50 hover:text-jp-red"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-600">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3 text-stone-400" />
              {formatDate(stay.checkIn.slice(0, 10))}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3 text-stone-400" />
              {stay.checkIn.slice(11, 16)} – {stay.checkOut.slice(11, 16)}
            </span>
          </div>
          {stay.link && (
            <a
              href={stay.link}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-jp-red hover:underline"
            >
              Reserva
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

function TzField({
  value,
  onChange,
}: {
  value: TimeZoneId;
  onChange: (value: TimeZoneId) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-stone-600">
      Fuso
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as TimeZoneId)}
        className={fieldClass}
      >
        <option value="America/Sao_Paulo">BRT</option>
        <option value="GMT-4">GMT-4</option>
        <option value="America/New_York">NY</option>
        <option value="Asia/Tokyo">JST</option>
      </select>
    </label>
  );
}
