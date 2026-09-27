export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get("name") ?? "";
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (!key || !name) {
    return new Response("missing photo", { status: 400 });
  }

  const media = new URL(`https://places.googleapis.com/v1/${name}/media`);
  media.searchParams.set("maxHeightPx", "400");
  media.searchParams.set("maxWidthPx", "400");
  media.searchParams.set("key", key);

  const response = await fetch(media);
  if (!response.ok) {
    return new Response("photo failed", { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
