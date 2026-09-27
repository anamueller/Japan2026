import { cacheGet, cacheKey, cacheSet } from "@/lib/google-cache";
import { decodePolyline, waypointOrder } from "@/lib/polyline";
import { straightRoute } from "@/lib/osrm-route";

type Waypoint = { lat: number; lng: number };

export async function POST(request: Request) {
  const body = (await request.json()) as {
    waypoints?: Waypoint[];
    optimize?: boolean;
    travelMode?: "WALK" | "DRIVE" | "TRANSIT";
  };
  const waypoints = body.waypoints ?? [];
  const identity = waypoints.map((_, index) => index);
  const travelMode =
    body.travelMode === "DRIVE" || body.travelMode === "TRANSIT"
      ? body.travelMode
      : "WALK";
  const optimize = Boolean(body.optimize);
  const hitKey = cacheKey({
    kind: "route",
    travelMode,
    waypoints,
  });
  const cached = cacheGet<{ path: ReturnType<typeof straightRoute>; waypointOrder: number[] }>(hitKey);
  if (!optimize && cached) return Response.json(cached);

  if (waypoints.length < 2) {
    return Response.json({
      path: straightRoute(waypoints),
      waypointOrder: identity,
    });
  }

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key) {
    return Response.json(
      { error: "Missing Google Maps key", path: straightRoute(waypoints), waypointOrder: identity },
      { status: 500 },
    );
  }

  const origin = toLatLng(waypoints[0]);
  const destination = toLatLng(waypoints[waypoints.length - 1]);
  const intermediates = waypoints.slice(1, -1).map((point) => ({
    location: { latLng: toLatLng(point) },
  }));

  const payload = {
    origin: { location: { latLng: origin } },
    destination: { location: { latLng: destination } },
    intermediates,
    travelMode,
    polylineQuality: "OVERVIEW",
    languageCode: "pt-BR",
    optimizeWaypointOrder: optimize && intermediates.length > 0,
  };

  const response = await fetch(
    "https://routes.googleapis.com/directions/v2:computeRoutes",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "routes.polyline.encodedPolyline,routes.optimizedIntermediateWaypointIndex",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const fallback = { path: straightRoute(waypoints), waypointOrder: identity };
    return Response.json(optimize ? fallback : cacheSet(hitKey, fallback));
  }

  const data = (await response.json()) as {
    routes?: {
      polyline?: { encodedPolyline?: string };
      optimizedIntermediateWaypointIndex?: number[];
    }[];
  };
  const route = data.routes?.[0];
  const path = route?.polyline?.encodedPolyline
    ? decodePolyline(route.polyline.encodedPolyline)
    : straightRoute(waypoints);

  const result = {
    path,
    waypointOrder: waypointOrder(
      waypoints.length,
      route?.optimizedIntermediateWaypointIndex,
    ),
  };
  return Response.json(optimize ? result : cacheSet(hitKey, result));
}

function toLatLng(point: Waypoint) {
  return { latitude: point.lat, longitude: point.lng };
}
