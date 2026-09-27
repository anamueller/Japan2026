type TopBarProps = {
  daysLeft: number;
};

export function TopBar({ daysLeft }: TopBarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between bg-jp-red px-6 text-white">
      <div className="w-40" />
      <h1 className="text-lg font-semibold tracking-tight">Japan 2026 🇯🇵</h1>
      <p className="w-40 text-right text-sm text-white/80">
        <span className="font-semibold text-white">{daysLeft}</span> Dias
      </p>
    </header>
  );
}
