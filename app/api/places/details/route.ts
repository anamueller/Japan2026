import { categoryFromTypes, photoUrl, type PlaceDetails } from "@/lib/places";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId")?.replace(/^places\//, "") ?? "";
  const sessionToken = searchParams.get("sessionToken") ?? undefined;
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();

  if (!key || !placeId) {
    return Response.json({ error: "missing place" }, { status: 400 });
  }

  const detailsUrl = new URL(`https://places.googleapis.com/v1/places/${placeId}`);
  detailsUrl.searchParams.set("languageCode", "pt-BR");
  if (sessionToken) detailsUrl.searchParams.set("sessionToken", sessionToken);

  const response = await fetch(detailsUrl, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,location,rating,userRatingCount,photos,types,reviews",
    },
  });

  if (!response.ok) {
    return Response.json({ error: "place details failed" }, { status: 502 });
  }

  const place = (await response.json()) as {
    id?: string;
    displayName?: { text?: string };
    formattedAddress?: string;
    location?: { latitude?: number; longitude?: number };
    rating?: number;
    userRatingCount?: number;
    photos?: { name?: string }[];
    types?: string[];
    reviews?: { text?: { text?: string } }[];
  };

  const lat = place.location?.latitude ?? 35.6812;
  const lng = place.location?.longitude ?? 139.7671;
  const photoName = place.photos?.[0]?.name ?? "";
  const { category, categoryEmoji } = categoryFromTypes(place.types);
  const reviewSnippet = place.reviews?.[0]?.text?.text?.slice(0, 140) ?? "";

  const details: PlaceDetails = {
    placeId: place.id ?? placeId,
    name: place.displayName?.text ?? "",
    address: place.formattedAddress ?? "",
    lat,
    lng,
    rating: place.rating ?? 0,
    userRatingCount: place.userRatingCount ?? 0,
    photoName,
    image: photoUrl(photoName),
    station: await nearestStation(key, lat, lng),
    category,
    categoryEmoji,
    reviewSnippet,
  };

  return Response.json(details);
}

async function nearestStation(
  key: string,
  lat: number,
  lng: number,
): Promise<string> {
  const response = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.displayName",
      },
      body: JSON.stringify({
        includedTypes: ["subway_station", "train_station", "light_rail_station"],
        maxResultCount: 1,
        rankPreference: "DISTANCE",
        languageCode: "pt-BR",
        locationRestriction: {
          circle: {
            center: { latitude: lat, longitude: lng },
            radius: 1500,
          },
        },
      }),
    },
  );
  if (!response.ok) return "A definir";
  const data = (await response.json()) as {
    places?: { displayName?: { text?: string } }[];
  };
  return data.places?.[0]?.displayName?.text ?? "A definir";
}
