import { parseTrip } from "@/lib/trip-store";
import { readSharedTrip, writeSharedTrip } from "@/lib/trip-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function accessToken(): string {
  return process.env.TRIP_GITHUB_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || "";
}

export async function GET() {
  const trip = await readSharedTrip(accessToken());
  if (!trip) return Response.json({ empty: true });
  return Response.json(trip);
}

export async function PUT(request: Request) {
  const trip = parseTrip(await request.json());
  if (!trip) return Response.json({ error: "invalid trip" }, { status: 400 });
  try {
    await writeSharedTrip(trip, accessToken());
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "write failed";
    return Response.json({ error: message }, { status: 502 });
  }
}
