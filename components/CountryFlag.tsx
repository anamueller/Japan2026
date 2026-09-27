import { BR, JP, US } from "country-flag-icons/react/3x2";

const FLAGS = { BR, JP, US };

export function CountryFlag({
  iso,
  className = "h-3.5 w-[1.3rem]",
  title,
}: {
  iso: string;
  className?: string;
  title?: string;
}) {
  const Flag = FLAGS[iso as keyof typeof FLAGS];
  if (!Flag) return null;
  return <Flag title={title ?? iso} className={`shrink-0 rounded-[1px] ${className}`} />;
}

export function RouteFlags({
  from,
  to,
  className = "h-2 w-3",
}: {
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <CountryFlag iso={from} className={className} />
      <span className="text-[8px] font-semibold opacity-70">-&gt;</span>
      <CountryFlag iso={to} className={className} />
    </span>
  );
}
