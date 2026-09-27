import { cacheGet, cacheKey, cacheSet } from "@/lib/google-cache";
import {
  fallbackHop,
  formatDurationSeconds,
  parseDuration,
} from "@/lib/transit";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fromId?: string;
    toId?: string;
    fromName?: string;
    toName?: string;
    fromLat?: number;
    fromLng?: number;
    toLat?: number;
    toLng?: number;
    date?: string;
  };

  const fallback = fallbackHop(body.fromId ?? "", body.toId ?? "");
  const hitKey = cacheKey({
    kind: "transit",
    fromId: body.fromId,
    toId: body.toId,
    fromLat: body.fromLat,
    fromLng: body.fromLng,
    toLat: body.toLat,
    toLng: body.toLng,
    date: body.date,
  });
  const cached = cacheGet<{ duration: string; summary: string }>(hitKey);
  if (cached) return Response.json(cached);

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key || body.fromLat == null || body.toLat == null) {
    return Response.json({
      duration: formatDurationSeconds(fallback.seconds),
      summary: fallback.summary,
    });
  }

  const payload = {
    origin: {
      location: { latLng: { latitude: body.fromLat, longitude: body.fromLng } },
    },
    destination: {
      location: { latLng: { latitude: body.toLat, longitude: body.toLng } },
    },
    travelMode: "TRANSIT",
    departureTime: `${body.date ?? "2026-11-14"}T11:00:00+09:00`,
    computeAlternativeRoutes: true,
    languageCode: "pt-BR",
    regionCode: "JP",
  };

  try {
    const response = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "routes.duration,routes.description,routes.legs.stepsOverview",
        },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) {
      return Response.json(
        cacheSet(hitKey, {
          duration: formatDurationSeconds(fallback.seconds),
          summary: fallback.summary,
        }),
      );
    }
    const data = (await response.json()) as {
      routes?: { duration?: string; description?: string }[];
    };
    const fastest = [...(data.routes ?? [])].sort(
      (left, right) => parseDuration(left.duration) - parseDuration(right.duration),
    )[0];
    const seconds = parseDuration(fastest?.duration);
    if (!seconds) {
      return Response.json(
        cacheSet(hitKey, {
          duration: formatDurationSeconds(fallback.seconds),
          summary: fallback.summary,
        }),
      );
    }
    return Response.json(
      cacheSet(hitKey, {
        duration: formatDurationSeconds(seconds),
        summary: fastest.description || "Transporte público",
      }),
    );
  } catch {
    return Response.json(
      cacheSet(hitKey, {
        duration: formatDurationSeconds(fallback.seconds),
        summary: fallback.summary,
      }),
    );
  }
}
