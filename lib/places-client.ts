import type { PlaceDetails, PlaceSuggestion } from "@/lib/places";

export async function searchPlaces(
  input: string,
  sessionToken?: string,
): Promise<PlaceSuggestion[]> {
  if (input.trim().length < 2) return [];
  const response = await fetch("/api/places/autocomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, sessionToken }),
  });
  if (!response.ok) return [];
  const payload = (await response.json()) as { suggestions?: PlaceSuggestion[] };
  return payload.suggestions ?? [];
}

export async function fetchPlaceDetails(
  placeId: string,
  sessionToken?: string,
): Promise<PlaceDetails | null> {
  const params = new URLSearchParams({ placeId });
  if (sessionToken) params.set("sessionToken", sessionToken);
  const response = await fetch(`/api/places/details?${params}`);
  if (!response.ok) return null;
  return (await response.json()) as PlaceDetails;
}
