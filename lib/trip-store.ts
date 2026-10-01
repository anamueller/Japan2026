import type { Attraction } from "@/lib/mock-data";
import type { CityStay, Flight, Stay } from "@/lib/trip";

const KEY = "japan2026.trip.v1";

export type SavedTrip = {
  cities: CityStay[];
  flights: Flight[];
  stays: Stay[];
  attractions: Attraction[];
};

export function parseTrip(raw: unknown): SavedTrip | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Partial<SavedTrip>;
  if (!Array.isArray(parsed.cities) || !Array.isArray(parsed.flights) || !Array.isArray(parsed.stays)) {
    return null;
  }
  return {
    cities: parsed.cities,
    flights: parsed.flights,
    stays: parsed.stays.map((stay) => ({ ...stay, station: stay.station ?? "" })),
    attractions: (parsed.attractions ?? []).map((item) => ({
      ...item,
      description: item.description ?? "",
    })),
  };
}

export function loadTrip(): SavedTrip | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return parseTrip(JSON.parse(localStorage.getItem(KEY) ?? "null"));
  } catch {
    return null;
  }
}

export function saveTrip(trip: SavedTrip): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(trip));
}

export async function fetchSharedTrip(): Promise<SavedTrip | null> {
  const response = await fetch("/api/trip", { cache: "no-store" });
  if (!response.ok) return null;
  return parseTrip(await response.json());
}

export async function publishSharedTrip(trip: SavedTrip): Promise<string | null> {
  try {
    const response = await fetch("/api/trip", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(trip),
    });
    if (response.ok) return null;
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? `HTTP ${response.status}`;
  } catch (error) {
    return error instanceof Error ? error.message : "falha ao publicar";
  }
}
