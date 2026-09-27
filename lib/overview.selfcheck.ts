import { formatDurationSeconds, fallbackHop } from "@/lib/transit";
import { climateLabel, weatherEmoji, shiftYear, mapDaily } from "@/lib/weather";
import { cacheGet, cacheKey, cacheSet } from "@/lib/google-cache";
import { airportFlag, buildFlightDays, defaultFlights, nextConnection, stayDisplayName, travelerHeader } from "@/lib/trip";
import { formatClock, formatDayMonth, formatNumericDate, formatStayRange } from "@/lib/dates";

if (weatherEmoji(0) !== "☀️") throw new Error("clear sky emoji");
if (shiftYear("2026-11-10", 2025) !== "2025-11-10") throw new Error("shiftYear");
if (formatClock("2026-11-08T22:40") !== "22:40") throw new Error("clock");
if (formatClock("2026-11-09T06:35") !== "6:35") throw new Error("clock pad");
if (formatDayMonth("2026-11-08") !== "8/11") throw new Error("day month");

const days = buildFlightDays(defaultFlights);
if (days[0]?.cards.length !== 2) throw new Error(`first day cards ${days[0]?.cards.length}`);
if (days[0]?.cards[0]?.traveler !== "Ana & Marcelo") {
  throw new Error(days[0]?.cards[0]?.traveler);
}
const connection = nextConnection(defaultFlights[0], defaultFlights);
if (connection !== "5h 30min") throw new Error(`connection ${connection}`);
if (days.some((day) => !day.ellipsis && day.cards.length === 0)) {
  throw new Error("empty flight day");
}
if (days.filter((day) => !day.ellipsis).length !== 2) {
  throw new Error(`flight days ${days.filter((day) => !day.ellipsis).length}`);
}
const withGap = buildFlightDays([
  ...defaultFlights,
  { ...defaultFlights[0], id: "gap", departAt: "2026-11-20T10:00", arriveAt: "2026-11-20T12:00" },
]);
if (!withGap.some((day) => day.ellipsis)) throw new Error("missing ellipsis");

const hop = fallbackHop("tokyo", "kyoto");
if (formatDurationSeconds(hop.seconds) !== "2h 12min") {
  throw new Error(formatDurationSeconds(hop.seconds));
}

const mapped = mapDaily({
  daily: {
    time: ["2025-11-10"],
    weather_code: [0],
    temperature_2m_max: [16.4],
    temperature_2m_min: [8.2],
    precipitation_sum: [0],
  },
  displayYear: 2026,
});
if (mapped[0]?.date !== "2026-11-10" || mapped[0]?.max !== 16) {
  throw new Error("mapDaily");
}
if (climateLabel(mapped) !== "Clima ameno e seco") throw new Error(climateLabel(mapped));
if (formatNumericDate("2026-11-11") !== "11/11/2026") throw new Error("numeric date");
if (formatStayRange("2026-11-10", "2026-11-14") !== "10-14/11") {
  throw new Error(formatStayRange("2026-11-10", "2026-11-14"));
}
if (airportFlag("GRU") !== "🇧🇷") throw new Error("flag");
if (stayDisplayName("Airbnb Takadanobaba") !== "Takadanobaba") throw new Error("stay name");
if (travelerHeader("Ana").background !== "#fecdd3") throw new Error("ana color");
if (travelerHeader("Marcelo").background !== "#7dd3fc") throw new Error("marcelo color");
if (travelerHeader("Lahana").background !== "#d8b4fe") throw new Error("lahana color");
if (travelerHeader("Manu").background !== "#92400e") throw new Error("manu color");
const key = cacheKey({ a: 1 });
cacheSet(key, { ok: true });
if (!cacheGet<{ ok: boolean }>(key)?.ok) throw new Error("cache");

console.log("overview.selfcheck ok");
