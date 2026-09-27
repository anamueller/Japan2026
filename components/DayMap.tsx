"use client";

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Attraction } from "@/lib/mock-data";
import { numberedPinSvg } from "@/lib/map-pin";
import type { LatLng } from "@/lib/osrm-route";

export type RouteStart = { lat: number; lng: number; label?: string };

export type DayMapProps = {
  attractions: Attraction[];
  selectedId: string | null;
  showRoute: boolean;
  showPins: boolean;
  route: LatLng[];
  fitKey: string;
  routeStart?: RouteStart | null;
  onSelect: (id: string) => void;
};

function pinIcon(label: string, active: boolean) {
  return L.divIcon({
    className: "bg-transparent border-0",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    html: numberedPinSvg(label, active),
  });
}

function FitToView({ points, fitKey }: { points: LatLng[]; fitKey: string }) {
  const map = useMap();
  const pointsKey = points.map(([lat, lng]) => `${lat},${lng}`).join("|");

  useEffect(() => {
    if (points.length === 0) return;
    map.fitBounds(points, {
      padding: [64, 64],
      maxZoom: fitKey === "macro" ? 12 : 16,
    });
  }, [map, fitKey, pointsKey, points]);

  return null;
}

function FlyToSelected({
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
    if (!position) return;
    if (lastFit.current !== fitKey) {
      lastFit.current = fitKey;
      return;
    }
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    map.flyTo(position, Math.max(map.getZoom(), 14), { duration: 0.5 });
  }, [map, position, fitKey]);

  return null;
}

export default function DayMap({
  attractions,
  selectedId,
  showRoute,
  showPins,
  route,
  fitKey,
  routeStart,
  onSelect,
}: DayMapProps) {
  const points = useMemo(() => {
    const pins = attractions.map((item) => [item.lat, item.lng] as LatLng);
    return routeStart ? [[routeStart.lat, routeStart.lng] as LatLng, ...pins] : pins;
  }, [attractions, routeStart]);
  const selected = attractions.find((item) => item.id === selectedId);

  return (
    <MapContainer
      center={points[0] ?? [35.68, 139.76]}
      zoom={13}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <FitToView points={points} fitKey={fitKey} />
      <FlyToSelected
        position={selected ? [selected.lat, selected.lng] : null}
        fitKey={fitKey}
      />
      {showRoute && route.length > 1 && (
        <Polyline
          positions={route}
          pathOptions={{ color: "#bc002d", weight: 2, opacity: 0.55 }}
        />
      )}
      {showPins && routeStart && (
        <Marker
          position={[routeStart.lat, routeStart.lng]}
          icon={pinIcon("A", false)}
        />
      )}
      {showPins &&
        attractions.map((attraction, index) => (
          <Marker
            key={attraction.id}
            position={[attraction.lat, attraction.lng]}
            icon={pinIcon(String(index + 1), attraction.id === selectedId)}
            eventHandlers={{ click: () => onSelect(attraction.id) }}
          />
        ))}
    </MapContainer>
  );
}
