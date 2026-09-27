export type Attraction = {
  id: string;
  name: string;
  date: string | null;
  cityId: string | null;
  placeId: string;
  address: string;
  category: string;
  categoryEmoji: string;
  rating: number;
  userRatingCount: number;
  station: string;
  duration: string;
  price: string;
  image: string;
  imageLabel: string;
  lat: number;
  lng: number;
  pinColor: string;
  upvotes: number;
  downvotes: number;
};

export type AttractionDraft = {
  name: string;
  date: string | null;
  cityId: string | null;
  duration: string;
  price: string;
  placeId: string;
  address: string;
  station: string;
  rating: number;
  userRatingCount: number;
  image: string;
  lat: number;
  lng: number;
  category: string;
  categoryEmoji: string;
};

export const dayAttractions: Attraction[] = [
  {
    id: "senso-ji",
    name: "Templo Senso-ji",
    date: "2026-11-12",
    cityId: "tokyo",
    placeId: "",
    address: "Asakusa, Taito City, Tokyo",
    category: "Templo",
    categoryEmoji: "⛩️",
    rating: 4.7,
    userRatingCount: 0,
    station: "Asakusa",
    duration: "2 horas",
    price: "¥0",
    image:
      "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=400&q=80",
    imageLabel: "SJ",
    lat: 35.71477,
    lng: 139.79666,
    pinColor: "#f43f5e",
    upvotes: 8,
    downvotes: 1,
  },
  {
    id: "shibuya-sky",
    name: "Shibuya Sky",
    date: "2026-11-12",
    cityId: "tokyo",
    placeId: "",
    address: "Shibuya, Tokyo",
    category: "Mirante",
    categoryEmoji: "🌃",
    rating: 4.6,
    userRatingCount: 0,
    station: "Shibuya",
    duration: "1h 30min",
    price: "¥2200",
    image:
      "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=400&q=80",
    imageLabel: "SS",
    lat: 35.65851,
    lng: 139.70204,
    pinColor: "#f59e0b",
    upvotes: 6,
    downvotes: 0,
  },
  {
    id: "tsukiji",
    name: "Mercado Tsukiji",
    date: "2026-11-12",
    cityId: "tokyo",
    placeId: "",
    address: "Tsukiji, Chuo City, Tokyo",
    category: "Gastronomia",
    categoryEmoji: "🍣",
    rating: 4.5,
    userRatingCount: 0,
    station: "Tsukijishijo",
    duration: "2 horas",
    price: "¥1000",
    image:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
    imageLabel: "TS",
    lat: 35.6654,
    lng: 139.7707,
    pinColor: "#0ea5e9",
    upvotes: 5,
    downvotes: 2,
  },
  {
    id: "ueno",
    name: "Parque Ueno",
    date: "2026-11-12",
    cityId: "tokyo",
    placeId: "",
    address: "Ueno, Taito City, Tokyo",
    category: "Parque",
    categoryEmoji: "🌳",
    rating: 4.4,
    userRatingCount: 0,
    station: "Ueno",
    duration: "2 horas",
    price: "¥0",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=400&q=80",
    imageLabel: "UE",
    lat: 35.71417,
    lng: 139.77361,
    pinColor: "#8b5cf6",
    upvotes: 4,
    downvotes: 1,
  },
];

export const ideaCards: Attraction[] = [
  {
    id: "teamlab",
    name: "teamLab Planets",
    date: null,
    cityId: "tokyo",
    placeId: "",
    address: "Toyosu, Koto City, Tokyo",
    category: "Experiência",
    categoryEmoji: "🎨",
    rating: 4.8,
    userRatingCount: 0,
    station: "Shin-Toyosu",
    duration: "2 horas",
    price: "¥3800",
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=400&q=80",
    imageLabel: "TL",
    lat: 35.64905,
    lng: 139.78989,
    pinColor: "#94a3b8",
    upvotes: 3,
    downvotes: 0,
  },
];

export function emptyAttractionDraft(
  date: string | null,
  cityId: string | null,
): AttractionDraft {
  return {
    name: "",
    date,
    cityId,
    duration: "2 horas",
    price: "¥0",
    placeId: "",
    address: "",
    station: "",
    rating: 0,
    userRatingCount: 0,
    image: "",
    lat: 35.6812,
    lng: 139.7671,
    category: "Passeio",
    categoryEmoji: "📍",
  };
}

export function attractionToDraft(attraction: Attraction): AttractionDraft {
  return {
    name: attraction.name,
    date: attraction.date,
    cityId: attraction.cityId,
    duration: attraction.duration,
    price: attraction.price,
    placeId: attraction.placeId,
    address: attraction.address,
    station: attraction.station,
    rating: attraction.rating,
    userRatingCount: attraction.userRatingCount,
    image: attraction.image,
    lat: attraction.lat,
    lng: attraction.lng,
    category: attraction.category,
    categoryEmoji: attraction.categoryEmoji,
  };
}

export function applyDraft(
  draft: AttractionDraft,
  current?: Attraction,
): Attraction {
  return {
    id: current?.id ?? crypto.randomUUID(),
    name: draft.name,
    date: draft.date,
    cityId: draft.cityId,
    placeId: draft.placeId,
    address: draft.address,
    category: draft.category,
    categoryEmoji: draft.categoryEmoji,
    rating: draft.rating,
    userRatingCount: draft.userRatingCount,
    station: draft.station || "A definir",
    duration: draft.duration.trim() || "1 hora",
    price: draft.price.trim() || "¥0",
    image: draft.image,
    imageLabel: current?.imageLabel ?? draft.name.slice(0, 2).toUpperCase(),
    lat: draft.lat,
    lng: draft.lng,
    pinColor: current?.pinColor ?? "#64748b",
    upvotes: current?.upvotes ?? 0,
    downvotes: current?.downvotes ?? 0,
  };
}

export function replaceDateOrder(
  list: Attraction[],
  date: string,
  ordered: Attraction[],
): Attraction[] {
  const result: Attraction[] = [];
  let inserted = false;
  for (const item of list) {
    if (item.date === date) {
      if (!inserted) {
        result.push(...ordered);
        inserted = true;
      }
      continue;
    }
    result.push(item);
  }
  if (!inserted) result.push(...ordered);
  return result;
}
