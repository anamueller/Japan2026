import type { Attraction } from "@/lib/mock-data";
import type { CityStay, Flight, Stay } from "@/lib/trip";

const KEY = "japan2026.trip.v1";

export type SavedTrip = {
  cities: CityStay[];
  flights: Flight[];
  stays: Stay[];
  attractions: Attraction[];
};

export function loadTrip(): SavedTrip | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedTrip>;
    if (!parsed.cities || !parsed.flights || !parsed.stays) return null;
    return {
      cities: parsed.cities,
      flights: parsed.flights,
      stays: parsed.stays.map((stay) => ({ ...stay, station: stay.station ?? "" })),
      attractions: (parsed.attractions ?? []).map((item) => ({
        ...item,
        description: item.description ?? "",
      })),
    };
  } catch {
    return null;
  }
}

export function saveTrip(trip: SavedTrip): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(trip));
}