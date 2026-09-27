export type PlaceSuggestion = {
  placeId: string;
  name: string;
  subtitle: string;
};

export type PlaceDetails = {
  placeId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingCount: number;
  photoName: string;
  image: string;
  station: string;
  category: string;
  categoryEmoji: string;
  reviewSnippet: string;
};

const TYPE_MAP: { test: string[]; category: string; emoji: string }[] = [
  { test: ["restaurant", "food", "cafe", "bakery", "bar", "meal_takeaway"], category: "Gastronomia", emoji: "🍣" },
  { test: ["temple", "place_of_worship", "church", "shrine"], category: "Templo", emoji: "⛩️" },
  { test: ["park"], category: "Parque", emoji: "🌳" },
  { test: ["museum", "art_gallery"], category: "Museu", emoji: "🎨" },
  { test: ["shopping_mall", "store", "market"], category: "Compras", emoji: "🛍️" },
  { test: ["amusement_park", "night_club"], category: "Lazer", emoji: "🌃" },
  { test: ["lodging"], category: "Hospedagem", emoji: "🏨" },
];

export function categoryFromTypes(types: string[] = []): {
  category: string;
  categoryEmoji: string;
} {
  const set = new Set(types);
  for (const row of TYPE_MAP) {
    if (row.test.some((type) => set.has(type))) {
      return { category: row.category, categoryEmoji: row.emoji };
    }
  }
  return { category: "Passeio", categoryEmoji: "📍" };
}

export function photoUrl(photoName: string): string {
  if (!photoName) return "";
  return `/api/places/photo?name=${encodeURIComponent(photoName)}`;
}
