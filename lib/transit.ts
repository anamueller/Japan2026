import { hoursBetween } from "@/lib/dates";

export type TransitHop = {
  fromId: string;
  toId: string;
  fromName: string;
  toName: string;
  duration: string;
  summary: string;
};

const FALLBACK: Record<string, { seconds: number; summary: string }> = {
  "tokyo>kyoto": { seconds: 7920, summary: "Nozomi (Shinkansen)" },
  "kyoto>hiroshima": { seconds: 6000, summary: "Sakura (Shinkansen)" },
  "hiroshima>gifu": { seconds: 16200, summary: "Shinkansen + Hida" },
  "gifu>hakone": { seconds: 18000, summary: "Hida + Tokaido" },
};

export function fallbackHop(fromId: string, toId: string): {
  seconds: number;
  summary: string;
} {
  return (
    FALLBACK[`${fromId}>${toId}`] ?? {
      seconds: 10800,
      summary: "Transporte público",
    }
  );
}

export function formatDurationSeconds(seconds: number): string {
  const start = new Date(0);
  const end = new Date(seconds * 1000);
  return hoursBetween(start, end);
}

export function parseDuration(iso: string | undefined): number {
  if (!iso) return 0;
  const match = iso.match(/^(\d+)s$/);
  return match ? Number(match[1]) : 0;
}
