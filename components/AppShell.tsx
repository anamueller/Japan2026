"use client";

import { useEffect, useState } from "react";
import { CitySetup } from "@/components/CitySetup";
import { Dashboard } from "@/components/Dashboard";
import { OverviewPanel } from "@/components/OverviewPanel";
import { Sidebar, type AppView } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { daysUntil } from "@/lib/dates";
import {
  dayAttractions,
  ideaCards,
  type Attraction,
} from "@/lib/mock-data";
import { fetchPlaceDetails, searchPlaces } from "@/lib/places-client";
import {
  defaultCities,
  defaultFlights,
  defaultStays,
  stayDisplayName,
  type CityStay,
  type Flight,
  type Stay,
} from "@/lib/trip";

const initialAttractions = [...dayAttractions, ...ideaCards];

export function AppShell() {
  const [view, setView] = useState<AppView>({ kind: "overview" });
  const [cities, setCities] = useState<CityStay[]>(defaultCities);
  const [flights, setFlights] = useState<Flight[]>(defaultFlights);
  const [stays, setStays] = useState<Stay[]>(defaultStays);
  const [attractions, setAttractions] = useState<Attraction[]>(initialAttractions);
  const [selectedId, setSelectedId] = useState(dayAttractions[0]?.id ?? "");
  const [mapView, setMapView] = useState<"macro" | string>("macro");
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all(initialAttractions.map(enrichFromPlaces)).then((list) => {
      if (live) setAttractions(list);
    });
    Promise.all(defaultStays.map(enrichStay)).then((list) => {
      if (live) setStays(list);
    });
    return () => {
      live = false;
    };
  }, []);

  const city =
    view.kind === "city" ? cities.find((item) => item.id === view.id) : undefined;
  const countdownStart = cities[0]?.start ?? "2026-11-10";

  function openCity(id: string) {
    setView({ kind: "city", id });
    setMapView("macro");
    const first = attractions.find((item) => item.cityId === id);
    if (first) setSelectedId(first.id);
  }

  function changeView(next: AppView) {
    if (next.kind === "city") {
      openCity(next.id);
      return;
    }
    setView(next);
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <TopBar daysLeft={daysUntil(countdownStart)} />
      <div className="flex min-h-0 flex-1">
        <Sidebar cities={cities} view={view} onView={changeView} />
        {view.kind === "overview" && (
          <OverviewPanel
            flights={flights}
            stays={stays}
            onFlights={setFlights}
            onStays={setStays}
          />
        )}
        {view.kind === "cities" && (
          <CitySetup
            cities={cities}
            onChange={setCities}
            onOpenCity={openCity}
          />
        )}
        {city && (
          <Dashboard
            city={city}
            stay={stays.find((item) => item.cityId === city.id)}
            attractions={attractions}
            selectedId={selectedId}
            mapView={mapView}
            optimizing={optimizing}
            onAttractions={setAttractions}
            onSelectedId={setSelectedId}
            onMapView={setMapView}
            onOptimizing={setOptimizing}
          />
        )}
      </div>
    </div>
  );
}

async function enrichStay(stay: Stay): Promise<Stay> {
  if (stay.image || !stay.address) return stay;
  const hits = await searchPlaces(stay.address);
  if (!hits[0]) return stay;
  const details = await fetchPlaceDetails(hits[0].placeId);
  if (!details) return stay;
  return {
    ...stay,
    name: stayDisplayName(details.name || stay.name),
    image: details.image || stay.image,
    lat: details.lat || stay.lat,
    lng: details.lng || stay.lng,
  };
}

async function enrichFromPlaces(item: Attraction): Promise<Attraction> {
  if (item.placeId) return item;
  const hits = await searchPlaces(`${item.name} Tokyo`);
  if (!hits[0]) return item;
  const details = await fetchPlaceDetails(hits[0].placeId);
  if (!details) return item;
  return {
    ...item,
    placeId: details.placeId,
    name: details.name || item.name,
    address: details.address,
    station: details.station || item.station,
    rating: details.rating || item.rating,
    userRatingCount: details.userRatingCount,
    image: details.image || item.image,
    lat: details.lat,
    lng: details.lng,
    category: details.category,
    categoryEmoji: details.categoryEmoji,
  };
}
