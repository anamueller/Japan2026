import { fetchWalkingRoute, straightRoute, type LatLng } from "@/lib/osrm-route";

export type RouteResult = {
  path: LatLng[];
  waypointOrder: number[];
};

export async function fetchGoogleRoute(
  points: { lat: number; lng: number }[],
  optimize = false,
  travelMode: "WALK" | "DRIVE" | "TRANSIT" = "WALK",
): Promise<RouteResult> {
  const fallback: RouteResult = {
    path: straightRoute(points),
    waypointOrder: points.map((_, index) => index),
  };
  if (points.length < 2) return fallback;

  try {
    const response = await fetch("/api/google-route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        waypoints: points.map((point) => ({ lat: point.lat, lng: point.lng })),
        optimize,
        travelMode,
      }),
    });
    if (!response.ok) {
      return {
        path: travelMode === "WALK" ? await fetchWalkingRoute(points) : fallback.path,
        waypointOrder: fallback.waypointOrder,
      };
    }
    const payload = (await response.json()) as RouteResult;
    if (!payload.path?.length) {
      return {
        path: travelMode === "WALK" ? await fetchWalkingRoute(points) : fallback.path,
        waypointOrder: fallback.waypointOrder,
      };
    }
    return payload;
  } catch {
    return {
      path: travelMode === "WALK" ? await fetchWalkingRoute(points) : fallback.path,
      waypointOrder: fallback.waypointOrder,
    };
  }
}
