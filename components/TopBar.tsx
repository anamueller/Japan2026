"use client";

import { Menu } from "lucide-react";
import { CountryFlag } from "@/components/CountryFlag";

type TopBarProps = {
  daysLeft: number;
  onMenu: () => void;
};

export function TopBar({ daysLeft, onMenu }: TopBarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between gap-3 bg-jp-red px-3 text-white md:h-14 md:px-6">
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={onMenu}
        className="rounded-md p-1.5 hover:bg-white/10 lg:invisible lg:pointer-events-none"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="inline-flex items-center gap-1.5 text-base font-semibold tracking-tight md:gap-2 md:text-lg">
        Japan 2026
        <CountryFlag iso="JP" className="h-4 w-6" title="Japão" />
      </h1>
      <p className="min-w-12 text-right text-xs text-white/80 md:text-sm">
        <span className="font-semibold text-white">{daysLeft}</span> Dias
      </p>
    </header>
  );
}
