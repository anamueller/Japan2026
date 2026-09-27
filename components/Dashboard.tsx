"use client";

import { ItineraryPanel } from "@/components/ItineraryPanel";
import { MapPanel, type MapView } from "@/components/MapPanel";
import { eachDate } from "@/lib/dates";
import { fetchGoogleRoute } from "@/lib/google-route";
import {
  applyDraft,
  replaceDateOrder,
  type Attraction,
  type AttractionDraft,
} from "@/lib/mock-data";
import type { CityStay, Stay } from "@/lib/trip";

type DashboardProps = {
  city: CityStay;
  stay?: Stay;
  attractions: Attraction[];
  selectedId: string;
  mapView: MapView;
  optimizing: boolean;
  onAttractions: (next: Attraction[]) => void;
  onSelectedId: (id: string) => void;
  onMapView: (view: MapView) => void;
  onOptimizing: (value: boolean) => void;
};

export function Dashboard({
  city,
  stay,
  attractions,
  selectedId,
  mapView,
  optimizing,
  onAttractions,
  onSelectedId,
  onMapView,
  onOptimizing,
}: DashboardProps) {
  const dates = eachDate(city.start, city.end);
  const cityItems = attractions.filter((item) => item.cityId === city.id);
  const routeStart = stay
    ? { lat: stay.lat, lng: stay.lng, label: stay.name || "Airbnb" }
    : { lat: city.lat, lng: city.lng, label: "Airbnb" };
  const mapAttractions =
    mapView === "macro"
      ? cityItems
          .filter((item) => item.date !== null)
          .sort((left, right) => (left.date ?? "").localeCompare(right.date ?? ""))
      : cityItems.filter((item) => item.date === mapView);

  function selectPin(id: string) {
    onSelectedId(id);
  }

  function focus(id: string) {
    onSelectedId(id);
    const item = attractions.find((attraction) => attraction.id === id);
    if (item?.date) onMapView(item.date);
  }

  function changeView(view: MapView) {
    onMapView(view);
    if (view === "macro") return;
    const first = cityItems.find((item) => item.date === view);
    if (first) onSelectedId(first.id);
  }

  function add(draft: AttractionDraft) {
    const attraction = applyDraft({ ...draft, cityId: city.id });
    onAttractions([...attractions, attraction]);
    onSelectedId(attraction.id);
    onMapView(attraction.date ?? "macro");
  }

  function save(id: string, draft: AttractionDraft) {
    onAttractions(
      attractions.map((item) =>
        item.id === id ? applyDraft({ ...draft, cityId: city.id }, item) : item,
      ),
    );
    onSelectedId(id);
    onMapView(draft.date ?? "macro");
  }

  function remove(id: string) {
    const next = attractions.filter((item) => item.id !== id);
    onAttractions(next);
    if (id !== selectedId) return;
    const fallback =
      next.find((item) => item.cityId === city.id && item.date != null) ??
      next.find((item) => item.cityId === city.id);
    onSelectedId(fallback?.id ?? "");
  }

  async function optimizeDate(items: Attraction[], startId?: string) {
    let ordered = items;
    if (startId) {
      const start = items.find((item) => item.id === startId);
      if (start) ordered = [start, ...items.filter((item) => item.id !== startId)];
    }
    if (ordered.length === 0) return ordered;
    const origin = { lat: routeStart.lat, lng: routeStart.lng };
    const points = [origin, ...ordered];
    if (points.length < 2) return ordered;
    const result = await fetchGoogleRoute(points, true);
    return result.waypointOrder
      .map((index) => points[index])
      .filter((point) => "id" in point) as Attraction[];
  }

  async function optimize(scope: "all" | string, startId?: string) {
    const datesToRun =
      scope === "all"
        ? [...new Set(cityItems.filter((item) => item.date).map((item) => item.date!))].sort()
        : [scope];
    onOptimizing(true);
    try {
      let next = attractions;
      for (const date of datesToRun) {
        const items = next.filter(
          (item) => item.cityId === city.id && item.date === date,
        );
        const ordered = await optimizeDate(items, startId);
        next = replaceDateOrder(next, date, ordered);
      }
      onAttractions(next);
      if (scope !== "all") onMapView(scope);
    } finally {
      onOptimizing(false);
    }
  }

  function startFrom(id: string) {
    const item = attractions.find((attraction) => attraction.id === id);
    if (!item?.date) return;
    onSelectedId(id);
    onMapView(item.date);
    void optimize(item.date, id);
  }

  return (
    <>
      <ItineraryPanel
        cityName={city.name}
        cityId={city.id}
        dates={dates}
        attractions={cityItems}
        selectedId={selectedId}
        optimizing={optimizing}
        onFocus={focus}
        onAdd={add}
        onSave={save}
        onDelete={remove}
        onOptimize={optimize}
        onStartFrom={startFrom}
      />
      <MapPanel
        attractions={mapAttractions}
        selectedId={selectedId}
        view={mapView}
        dates={dates}
        cityName={city.name}
        routeStart={routeStart}
        onSelect={selectPin}
        onViewChange={changeView}
      />
    </>
  );
}
