"use client";

import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  Marker,
  Polyline,
  useMap,
} from "@vis.gl/react-google-maps";
import type { DayMapProps } from "@/components/DayMap";
import { numberedPinUrl } from "@/lib/map-pin";
import type { LatLng } from "@/lib/osrm-route";

export default function GoogleDayMap({
  apiKey,
  attractions,
  selectedId,
  showRoute,
  showPins,
  route,
  fitKey,
  routeStart,
  onSelect,
}: DayMapProps & { apiKey: string }) {
  const start = routeStart ?? attractions[0];
  const selected = attractions.find((item) => item.id === selectedId);
  const fitPoints = [
    ...(routeStart ? [[routeStart.lat, routeStart.lng] as LatLng] : []),
    ...attractions.map((item) => [item.lat, item.lng] as LatLng),
  ];
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <APIProvider
        apiKey={apiKey}
        language="pt-BR"
        region="JP"
        onError={() =>
          setError(
            "Não deu para carregar o Google Maps. Confira se a Maps JavaScript API está ativada e se a chave permite localhost.",
          )
        }
      >
        <Map
          defaultCenter={{
            lat: start?.lat ?? 35.68,
            lng: start?.lng ?? 139.76,
          }}
          defaultZoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapTypeControl={false}
          streetViewControl={false}
          fullscreenControl={false}
          style={{ width: "100%", height: "100%" }}
        >
          <FitToView points={fitPoints} fitKey={fitKey} />
          <PanToSelected
            position={selected ? [selected.lat, selected.lng] : null}
            fitKey={fitKey}
          />
          {showRoute && route.length > 1 && (
            <Polyline
              path={route.map(([lat, lng]) => ({ lat, lng }))}
              strokeColor="#bc002d"
              strokeWeight={2}
              strokeOpacity={0.55}
            />
          )}
          {showPins && routeStart && (
            <Marker
              position={{ lat: routeStart.lat, lng: routeStart.lng }}
              title={routeStart.label ?? "Airbnb"}
              icon={{
                url: numberedPinUrl("A"),
                scaledSize: { width: 20, height: 20 } as google.maps.Size,
                anchor: { x: 10, y: 10 } as google.maps.Point,
              }}
              zIndex={0}
            />
          )}
          {showPins &&
            attractions.map((attraction, index) => (
              <Marker
                key={attraction.id}
                position={{ lat: attraction.lat, lng: attraction.lng }}
                title={attraction.name}
                icon={{
                  url: numberedPinUrl(String(index + 1), attraction.id === selectedId),
                  scaledSize: { width: 20, height: 20 } as google.maps.Size,
                  anchor: { x: 10, y: 10 } as google.maps.Point,
                }}
                zIndex={attraction.id === selectedId ? 10 : 1}
                onClick={() => onSelect(attraction.id)}
              />
            ))}
        </Map>
        {error ? (
          <div className="absolute inset-x-6 top-1/2 z-[1000] -translate-y-1/2 rounded-xl bg-white/95 p-4 text-center text-sm text-slate-700 shadow-lg">
            {error}
          </div>
        ) : null}
      </APIProvider>
    </div>
  );
}

function FitToView({ points, fitKey }: { points: LatLng[]; fitKey: string }) {
  const map = useMap();
  const pointsKey = points.map(([lat, lng]) => `${lat},${lng}`).join("|");

  useEffect(() => {
    if (!map || points.length === 0) return;

    if (points.length === 1) {
      map.setCenter({ lat: points[0][0], lng: points[0][1] });
      map.setZoom(fitKey === "macro" ? 12 : 15);
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    for (const [lat, lng] of points) bounds.extend({ lat, lng });
    const maxZoom = fitKey === "macro" ? 12 : 16;
    map.fitBounds(bounds, 72);
    const listener = map.addListener("idle", () => {
      if ((map.getZoom() ?? maxZoom) > maxZoom) map.setZoom(maxZoom);
      google.maps.event.removeListener(listener);
    });
    return () => google.maps.event.removeListener(listener);
  }, [map, fitKey, pointsKey, points]);

  return null;
}

function PanToSelected({
  position,
  fitKey,
}: {
  position: LatLng | null;
  fitKey: string;
}) {
  const map = useMap();
  const lastFit = useRef(fitKey);
  const skipFirst = useRef(true);

  useEffect(() => {
    if (!map || !position) return;
    if (lastFit.current !== fitKey) {
      lastFit.current = fitKey;
      return;
    }
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    map.panTo({ lat: position[0], lng: position[1] });
  }, [map, position, fitKey]);

  return null;
}
