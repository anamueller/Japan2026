import { eachDate, hoursBetween, localToUtc } from "@/lib/dates";
import { buildTimeline, defaultFlights, defaultStays } from "@/lib/trip";

const dates = eachDate("2026-11-10", "2026-11-12");
if (dates.join(",") !== "2026-11-10,2026-11-11,2026-11-12") throw new Error(dates.join(","));

const depart = localToUtc("2026-11-08T22:40", "America/Sao_Paulo");
const arrive = localToUtc("2026-11-09T06:35", "GMT-4");
const duration = hoursBetween(depart, arrive);
if (duration !== "8h 55min") throw new Error(`duration ${duration}`);

const events = buildTimeline(defaultFlights, defaultStays);
if (events.length !== 22) throw new Error(`events ${events.length}`);
if (!events[0].title.includes("Parte")) throw new Error(events[0].title);
if (!events.every((event, index) => index === 0 || event.at >= events[index - 1].at)) {
  throw new Error("timeline order");
}

console.log("trip.selfcheck ok");
