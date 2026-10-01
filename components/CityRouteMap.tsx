"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Attraction } from "@/lib/mock-data";
import { fetchGoogleRoute } from "@/lib/google-route";
import { straightRoute, type LatLng } from "@/lib/osrm-route";
import type { CityStay } from "@/lib/trip";

const mapLoading = () => <div className="h-full w-full bg-rose-50" />;

const DayMap = dynamic(() => import("@/components/DayMap"), {
  ssr: false,
  loading: mapLoading,
});

const GoogleDayMap = dynamic(() => import("@/components/GoogleDayMap"), {
  ssr: false,
  loading: mapLoading,
});

const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

export function CityRouteMap({ cities }: { cities: CityStay[] }) {
  const attractions = cities.map(cityPin);
  const [route, setRoute] = useState<LatLng[]>(() => straightRoute(cities));
  const pointsKey = cities.map((city) => `${city.id}:${city.lat},${city.lng}`).join("|");

  useEffect(() => {
    let live = true;
    setRoute(straightRoute(cities));
    if (cities.length < 2) return;
    fetchGoogleRoute(cities, false, "DRIVE").then((result) => {
      if (live) setRoute(result.path);
    });
    return () => {
      live = false;
    };
  }, [pointsKey]);

  if (cities.length === 0) return null;

  return (
    <div className="mt-4 h-56 overflow-hidden rounded-2xl border border-rose-100 md:h-72">
      {googleMapsKey ? (
        <GoogleDayMap
          apiKey={googleMapsKey}
          attractions={attractions}
          selectedId=""
          showRoute
          showPins
          route={route}
          fitKey={`cities-${pointsKey}`}
          onSelect={() => undefined}
        />
      ) : (
        <DayMap
          attractions={attractions}
          selectedId=""
          showRoute
          showPins
          route={route}
          fitKey={`cities-${pointsKey}`}
          onSelect={() => undefined}
        />
      )}
    </div>
  );
}

function cityPin(city: CityStay): Attraction {
  return {
    id: city.id,
    name: city.name,
    date: city.start,
    cityId: city.id,
    placeId: "",
    address: "",
    category: "Cidade",
    categoryEmoji: "📍",
    rating: 0,
    userRatingCount: 0,
    station: "",
    duration: "",
    price: "",
    image: "",
    imageLabel: city.name.slice(0, 2),
    lat: city.lat,
    lng: city.lng,
    pinColor: "#bc002d",
    upvotes: 0,
    downvotes: 0,
    description: "",
  };
}
