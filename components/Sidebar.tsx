"use client";

import {
  FileText,
  LayoutDashboard,
  MapPin,
  Plane,
} from "lucide-react";
import { CountryFlag } from "@/components/CountryFlag";
import type { CityStay } from "@/lib/trip";

export type AppView =
  | { kind: "overview" }
  | { kind: "cities" }
  | { kind: "city"; id: string };

type SidebarProps = {
  cities: CityStay[];
  view: AppView;
  open: boolean;
  onView: (view: AppView) => void;
  onClose: () => void;
};

export function Sidebar({ cities, view, open, onView, onClose }: SidebarProps) {
  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-stone-900/40 lg:hidden"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 max-w-[80vw] flex-col overflow-y-auto bg-jp-ink px-4 py-5 text-rose-100 transition-transform lg:static lg:z-0 lg:w-56 lg:max-w-none lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <p className="mb-6 flex items-center gap-2 px-2 text-sm font-semibold tracking-wide text-white">
        Trip: Japan
        <CountryFlag iso="JP" className="h-3.5 w-[1.3rem]" title="Japão" />
      </p>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto text-sm">
        <NavItem
          icon={LayoutDashboard}
          label="Visão Geral"
          active={view.kind === "overview"}
          onClick={() => onView({ kind: "overview" })}
        />
        <div>
          <NavItem
            icon={MapPin}
            label="Cidades"
            active={view.kind === "cities"}
            onClick={() => onView({ kind: "cities" })}
          />
          <ul className="mt-1 ml-9 flex flex-col gap-1 text-rose-200/70">
            {cities.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onClick={() => onView({ kind: "city", id: city.id })}
                  className={`w-full rounded-md px-2 py-1 text-left transition hover:bg-white/5 hover:text-white ${
                    view.kind === "city" && view.id === city.id
                      ? "font-medium text-white"
                      : ""
                  }`}
                >
                  {city.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <NavItem icon={FileText} label="Documentos" active={false} />
          <ul className="mt-1 ml-9 flex flex-col gap-1 text-rose-200/70">
            <li>
              <span className="inline-flex w-full items-center gap-2 rounded-md px-2 py-1">
                <FileText className="h-3.5 w-3.5" />
                PDFs
              </span>
            </li>
            <li>
              <span className="inline-flex w-full items-center gap-2 rounded-md px-2 py-1">
                <Plane className="h-3.5 w-3.5" />
                Voos
              </span>
            </li>
          </ul>
        </div>
      </nav>
    </aside>
    </>
  );
}

function NavItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: typeof LayoutDashboard;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition hover:bg-white/5 hover:text-white ${
        active ? "bg-jp-red font-medium text-white" : ""
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
