import { parseTrip } from "@/lib/trip-store";
import { readSharedTrip, writeSharedTrip } from "@/lib/trip-server";

export async function GET() {
  const trip = await readSharedTrip();
  if (!trip) return Response.json({ error: "empty" }, { status: 404 });
  return Response.json(trip);
}

export async function PUT(request: Request) {
  const trip = parseTrip(await request.json());
  if (!trip) return Response.json({ error: "invalid trip" }, { status: 400 });
  try {
    await writeSharedTrip(trip);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "write failed" }, { status: 502 });
  }
}
