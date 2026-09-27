export type LocationKind = "neighborhood" | "place";

export type TripLocation = {
  id: string;
  name: string;
  kind: LocationKind;
  lat: number;
  lng: number;
  station: string;
};

export const TRIP_DAYS = [1, 2, 3, 4, 5, 6, 7] as const;

export const neighborhoods: TripLocation[] = [
  { id: "shibuya", name: "Shibuya", kind: "neighborhood", lat: 35.658, lng: 139.7016, station: "Shibuya" },
  { id: "asakusa", name: "Asakusa", kind: "neighborhood", lat: 35.7147, lng: 139.7967, station: "Asakusa" },
  { id: "shinjuku", name: "Shinjuku", kind: "neighborhood", lat: 35.6938, lng: 139.7034, station: "Shinjuku" },
  { id: "ginza", name: "Ginza", kind: "neighborhood", lat: 35.6712, lng: 139.7649, station: "Ginza" },
  { id: "ueno", name: "Ueno", kind: "neighborhood", lat: 35.7142, lng: 139.7774, station: "Ueno" },
  { id: "tsukiji", name: "Tsukiji", kind: "neighborhood", lat: 35.6654, lng: 139.7707, station: "Tsukijishijo" },
  { id: "harajuku", name: "Harajuku", kind: "neighborhood", lat: 35.6702, lng: 139.7027, station: "Harajuku" },
  { id: "akihabara", name: "Akihabara", kind: "neighborhood", lat: 35.6984, lng: 139.7731, station: "Akihabara" },
  { id: "roppongi", name: "Roppongi", kind: "neighborhood", lat: 35.6628, lng: 139.7314, station: "Roppongi" },
  { id: "odaiba", name: "Odaiba", kind: "neighborhood", lat: 35.6269, lng: 139.7743, station: "Daiba" },
  { id: "ikebukuro", name: "Ikebukuro", kind: "neighborhood", lat: 35.7295, lng: 139.7109, station: "Ikebukuro" },
  { id: "yanaka", name: "Yanaka", kind: "neighborhood", lat: 35.7261, lng: 139.769, station: "Nippori" },
  { id: "shimokitazawa", name: "Shimokitazawa", kind: "neighborhood", lat: 35.6616, lng: 139.6679, station: "Shimokitazawa" },
  { id: "nakameguro", name: "Nakameguro", kind: "neighborhood", lat: 35.644, lng: 139.6982, station: "Naka-Meguro" },
  { id: "ebisu", name: "Ebisu", kind: "neighborhood", lat: 35.6467, lng: 139.7101, station: "Ebisu" },
  { id: "toyosu", name: "Toyosu", kind: "neighborhood", lat: 35.655, lng: 139.792, station: "Toyosu" },
  { id: "marunouchi", name: "Marunouchi", kind: "neighborhood", lat: 35.6812, lng: 139.7671, station: "Tokyo" },
];

export const CUSTOM_LOCATION_ID = "custom";

export function resolveLocation(
  locationId: string,
  customName = "",
): TripLocation {
  if (locationId !== CUSTOM_LOCATION_ID) {
    const neighborhood = neighborhoods.find((item) => item.id === locationId);
    if (neighborhood) return neighborhood;
  }

  const typed = customName.trim();
  const match = neighborhoods.find(
    (item) => item.name.toLowerCase() === typed.toLowerCase(),
  );
  if (match) return match;

  return {
    id: CUSTOM_LOCATION_ID,
    name: typed || "Tokyo",
    kind: "place",
    lat: 35.6812,
    lng: 139.7671,
    station: typed || "Tokyo",
  };
}
