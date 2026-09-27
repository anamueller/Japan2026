import type { PlaceSuggestion } from "@/lib/places";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    input?: string;
    sessionToken?: string;
    includedPrimaryTypes?: string[];
  };
  const input = body.input?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key || input.length < 2) {
    return Response.json({ suggestions: [] });
  }

  const response = await fetch(
    "https://places.googleapis.com/v1/places:autocomplete",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
      },
      body: JSON.stringify({
        input,
        languageCode: "pt-BR",
        regionCode: "JP",
        includedRegionCodes: ["jp"],
        includedPrimaryTypes: body.includedPrimaryTypes?.length
          ? body.includedPrimaryTypes
          : undefined,
        sessionToken: body.sessionToken,
      }),
    },
  );

  if (!response.ok) {
    return Response.json({ suggestions: [] }, { status: 502 });
  }

  const data = (await response.json()) as {
    suggestions?: {
      placePrediction?: {
        placeId?: string;
        structuredFormat?: {
          mainText?: { text?: string };
          secondaryText?: { text?: string };
        };
        text?: { text?: string };
      };
    }[];
  };

  const suggestions: PlaceSuggestion[] = (data.suggestions ?? [])
    .map((item) => item.placePrediction)
    .filter((item): item is NonNullable<typeof item> => Boolean(item?.placeId))
    .map((item) => ({
      placeId: item.placeId!,
      name: item.structuredFormat?.mainText?.text ?? item.text?.text ?? "",
      subtitle: item.structuredFormat?.secondaryText?.text ?? "",
    }));

  return Response.json({ suggestions });
}
