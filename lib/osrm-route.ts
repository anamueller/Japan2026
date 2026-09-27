export type LatLng = [number, number];

export function straightRoute(points: { lat: number; lng: number }[]): LatLng[] {
  return points.map((point) => [point.lat, point.lng]);
}

export function osrmToLatLngs(payload: {
  routes?: { geometry?: { coordinates?: [number, number][] } }[];
}): LatLng[] | null {
  const coords = payload.routes?.[0]?.geometry?.coordinates;
  if (!coords?.length) return null;
  return coords.map(([lng, lat]) => [lat, lng]);
}

export async function fetchWalkingRoute(
  points: { lat: number; lng: number }[],
): Promise<LatLng[]> {
  const fallback = straightRoute(points);
  if (points.length < 2) return fallback;

  const path = points.map((point) => `${point.lng},${point.lat}`).join(";");
  // ponytail: public OSRM demo — swap for a self-hosted router if this rate-limits
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/foot/${path}?overview=full&geometries=geojson`,
    );
    if (!response.ok) return fallback;
    return osrmToLatLngs(await response.json()) ?? fallback;
  } catch {
    return fallback;
  }
}
