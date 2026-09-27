import { mapDaily, shiftYear, type WeatherDay, type WeatherSource } from "@/lib/weather";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = url.searchParams.get("lat");
  const lng = url.searchParams.get("lng");
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  if (!lat || !lng || !start || !end) {
    return Response.json({ error: "Missing params" }, { status: 400 });
  }

  const forecast = await fetchWeather(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&start_date=${start}&end_date=${end}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia/Tokyo`,
  );
  if (forecast) {
    return Response.json({
      source: "forecast" satisfies WeatherSource,
      days: mapDaily(forecast),
    });
  }

  const analogStart = shiftYear(start, Number(start.slice(0, 4)) - 1);
  const analogEnd = shiftYear(end, Number(end.slice(0, 4)) - 1);
  const typical = await fetchWeather(
    `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${analogStart}&end_date=${analogEnd}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Tokyo`,
  );

  return Response.json({
    source: "typical" satisfies WeatherSource,
    days: mapDaily({
      ...typical,
      displayYear: Number(start.slice(0, 4)),
    }) satisfies WeatherDay[],
  });
}

async function fetchWeather(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return (await response.json()) as Parameters<typeof mapDaily>[0];
  } catch {
    return null;
  }
}
