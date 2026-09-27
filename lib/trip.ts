import {
  calendarDaysBetween,
  formatClock,
  formatDateTime,
  hoursBetween,
  localToUtc,
  type TimeZoneId,
} from "@/lib/dates";

export type CityStay = {
  id: string;
  name: string;
  start: string;
  end: string;
  lat: number;
  lng: number;
};

export type Flight = {
  id: string;
  traveler: string;
  airline: string;
  number: string;
  pnr: string;
  from: string;
  to: string;
  departAt: string;
  departTz: TimeZoneId;
  arriveAt: string;
  arriveTz: TimeZoneId;
};

export type Stay = {
  id: string;
  cityId: string;
  name: string;
  link: string;
  address: string;
  checkIn: string;
  checkOut: string;
  timeZone: TimeZoneId;
  lat: number;
  lng: number;
  image: string;
};

export const defaultCities: CityStay[] = [
  {
    id: "tokyo",
    name: "Tóquio",
    start: "2026-11-10",
    end: "2026-11-14",
    lat: 35.7128,
    lng: 139.7037,
  },
  {
    id: "kyoto",
    name: "Kyoto",
    start: "2026-11-14",
    end: "2026-11-18",
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    id: "hiroshima",
    name: "Hiroshima",
    start: "2026-11-18",
    end: "2026-11-19",
    lat: 34.3963,
    lng: 132.4594,
  },
  {
    id: "gifu",
    name: "Gifu",
    start: "2026-11-19",
    end: "2026-11-21",
    lat: 36.146,
    lng: 137.2522,
  },
  {
    id: "hakone",
    name: "Hakone",
    start: "2026-11-21",
    end: "2026-11-22",
    lat: 35.2324,
    lng: 139.1069,
  },
];

export const defaultFlights: Flight[] = [
  {
    id: "ana-1",
    traveler: "Ana",
    airline: "Japan Airlines",
    number: "5561",
    pnr: "",
    from: "GRU",
    to: "BOS",
    departAt: "2026-11-08T22:40",
    departTz: "America/Sao_Paulo",
    arriveAt: "2026-11-09T06:35",
    arriveTz: "GMT-4",
  },
  {
    id: "ana-2",
    traveler: "Ana",
    airline: "Japan Airlines",
    number: "007",
    pnr: "",
    from: "BOS",
    to: "NRT",
    departAt: "2026-11-09T12:05",
    departTz: "GMT-4",
    arriveAt: "2026-11-10T16:15",
    arriveTz: "Asia/Tokyo",
  },
  {
    id: "marcelo-1",
    traveler: "Marcelo",
    airline: "Japan Airlines",
    number: "5561",
    pnr: "",
    from: "GRU",
    to: "BOS",
    departAt: "2026-11-08T22:40",
    departTz: "America/Sao_Paulo",
    arriveAt: "2026-11-09T06:35",
    arriveTz: "GMT-4",
  },
  {
    id: "marcelo-2",
    traveler: "Marcelo",
    airline: "Japan Airlines",
    number: "007",
    pnr: "",
    from: "BOS",
    to: "NRT",
    departAt: "2026-11-09T12:05",
    departTz: "GMT-4",
    arriveAt: "2026-11-10T16:15",
    arriveTz: "Asia/Tokyo",
  },
  {
    id: "lahana-1",
    traveler: "Lahana",
    airline: "American Airlines",
    number: "7209",
    pnr: "",
    from: "GIG",
    to: "JFK",
    departAt: "2026-11-08T23:00",
    departTz: "America/Sao_Paulo",
    arriveAt: "2026-11-09T07:10",
    arriveTz: "America/New_York",
  },
  {
    id: "lahana-2",
    traveler: "Lahana",
    airline: "Japan Airlines",
    number: "7009",
    pnr: "",
    from: "BOS",
    to: "HND",
    departAt: "2026-11-09T09:50",
    departTz: "GMT-4",
    arriveAt: "2026-11-10T14:35",
    arriveTz: "Asia/Tokyo",
  },
];

export const defaultStays: Stay[] = [
  {
    id: "tokyo-stay",
    cityId: "tokyo",
    name: "Takadanobaba",
    link: "https://www.airbnb.com.br/trips/v1/1751078488172837922/ro/RESERVATION2_CHECKIN/HMR5AYCY2P",
    address: "Takadanobaba 3-24-11, Shinjuku, Tokyo 169-0075",
    checkIn: "2026-11-10T15:00",
    checkOut: "2026-11-14T11:00",
    timeZone: "Asia/Tokyo",
    lat: 35.7128,
    lng: 139.7037,
    image: "",
  },
  {
    id: "kyoto-stay",
    cityId: "kyoto",
    name: "Naniwa",
    link: "https://www.airbnb.com.br/trips/v1/1774194790537470628/ro/RESERVATION2_CHECKIN/HM9EBXY5JT",
    address: "3-chōme-17-5 Nanbanaka, Naniwa Ward, Osaka 556-0011",
    checkIn: "2026-11-14T16:00",
    checkOut: "2026-11-18T10:00",
    timeZone: "Asia/Tokyo",
    lat: 34.6628,
    lng: 135.5028,
    image: "",
  },
  {
    id: "hiroshima-stay",
    cityId: "hiroshima",
    name: "Sakaimachi",
    link: "https://www.airbnb.com.br/trips/v1/1774194790537470628/ro/RESERVATION2_CHECKIN/HM9EBXY5JT/directions-modal",
    address: "1-chōme-3-27 Sakaimachi, Naka Ward, Hiroshima 730-0853",
    checkIn: "2026-11-18T15:00",
    checkOut: "2026-11-19T10:00",
    timeZone: "Asia/Tokyo",
    lat: 34.3963,
    lng: 132.4594,
    image: "",
  },
  {
    id: "gifu-stay",
    cityId: "gifu",
    name: "Takayama",
    link: "https://www.airbnb.com.br/trips/v1/1774193312901648242/ro/RESERVATION2_CHECKIN/HMNZCETCHT",
    address: "5-chōme-13-13 Hanasatomachi, Takayama, Gifu 506-0026",
    checkIn: "2026-11-19T16:00",
    checkOut: "2026-11-21T11:00",
    timeZone: "Asia/Tokyo",
    lat: 36.146,
    lng: 137.2522,
    image: "",
  },
  {
    id: "hakone-stay",
    cityId: "hakone",
    name: "Hakone",
    link: "https://www.airbnb.com.br/trips/v1/1774194145940396339/ro/RESERVATION2_CHECKIN/HMQ9P5KFCQ",
    address: "98 Hakone, Ashigarashimo District, Kanagawa 250-0521",
    checkIn: "2026-11-21T15:00",
    checkOut: "2026-11-22T10:00",
    timeZone: "Asia/Tokyo",
    lat: 35.2324,
    lng: 139.1069,
    image: "",
  },
];

export function cityForDate(cities: CityStay[], iso: string): CityStay | undefined {
  return cities.find((city) => iso >= city.start && iso <= city.end);
}

export function emptyFlight(): Flight {
  return {
    id: crypto.randomUUID(),
    traveler: "",
    airline: "",
    number: "",
    pnr: "",
    from: "",
    to: "",
    departAt: "2026-11-08T22:40",
    departTz: "America/Sao_Paulo",
    arriveAt: "2026-11-09T06:35",
    arriveTz: "GMT-4",
  };
}

export function emptyStay(): Stay {
  return {
    id: crypto.randomUUID(),
    cityId: "",
    name: "",
    link: "",
    address: "",
    checkIn: "2026-11-10T15:00",
    checkOut: "2026-11-14T11:00",
    timeZone: "Asia/Tokyo",
    lat: 35.68,
    lng: 139.76,
    image: "",
  };
}

const AIRPORT_FLAG: Record<string, string> = {
  GRU: "🇧🇷",
  GIG: "🇧🇷",
  CGH: "🇧🇷",
  BOS: "🇺🇸",
  JFK: "🇺🇸",
  EWR: "🇺🇸",
  NRT: "🇯🇵",
  HND: "🇯🇵",
  KIX: "🇯🇵",
  ITM: "🇯🇵",
};

export function airportFlag(code: string): string {
  return AIRPORT_FLAG[code.toUpperCase()] || "🛫";
}

export function stayDisplayName(name: string): string {
  const cleaned = name.replace(/airbnb\s*/gi, "").trim();
  return cleaned || "Acomodação";
}

const TRAVELER_TONE: Record<string, { bg: string; text: string }> = {
  ana: { bg: "#fecdd3", text: "#831843" },
  marcelo: { bg: "#7dd3fc", text: "#0c4a6e" },
  lahana: { bg: "#d8b4fe", text: "#581c87" },
  manu: { bg: "#92400e", text: "#fff7ed" },
};

export function travelerHeader(label: string): { background: string; color: string } {
  const tones = label
    .split(" & ")
    .map((name) => TRAVELER_TONE[name.trim().toLowerCase()] ?? { bg: "#1c1917", text: "#fff" });
  if (tones.length === 1) {
    return { background: tones[0].bg, color: tones[0].text };
  }
  return {
    background: `linear-gradient(90deg, ${tones.map((tone) => tone.bg).join(", ")})`,
    color: "#1c1917",
  };
}

export type TimelineEvent = {
  id: string;
  at: Date;
  when: string;
  traveler: string;
  title: string;
  detail: string;
};

export function buildTimeline(flights: Flight[], stays: Stay[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  for (const flight of flights) {
    const depart = localToUtc(flight.departAt, flight.departTz);
    const arrive = localToUtc(flight.arriveAt, flight.arriveTz);
    events.push({
      id: `${flight.id}-dep`,
      at: depart,
      when: formatDateTime(flight.departAt, flight.departTz),
      traveler: flight.traveler || "Viajante",
      title: `Parte ${flight.from || "origem"}`,
      detail: `${flight.airline} ${flight.number} · ${hoursBetween(depart, arrive)} de voo`,
    });
    events.push({
      id: `${flight.id}-arr`,
      at: arrive,
      when: formatDateTime(flight.arriveAt, flight.arriveTz),
      traveler: flight.traveler || "Viajante",
      title: `Chega ${flight.to || "destino"}`,
      detail: `PNR ${flight.pnr || "—"}`,
    });
  }

  for (const stay of stays) {
    events.push({
      id: `${stay.id}-in`,
      at: localToUtc(stay.checkIn, stay.timeZone),
      when: formatDateTime(stay.checkIn, stay.timeZone),
      traveler: "Grupo",
      title: `Check-in · ${stay.name || "Acomodação"}`,
      detail: stay.address,
    });
    events.push({
      id: `${stay.id}-out`,
      at: localToUtc(stay.checkOut, stay.timeZone),
      when: formatDateTime(stay.checkOut, stay.timeZone),
      traveler: "Grupo",
      title: `Check-out · ${stay.name || "Acomodação"}`,
      detail: stay.address,
    });
  }

  return events.sort((left, right) => left.at.getTime() - right.at.getTime());
}

export type TimelineFlightCard = {
  id: string;
  traveler: string;
  airline: string;
  number: string;
  from: string;
  to: string;
  departTime: string;
  arriveTime: string;
  duration: string;
  connection: string | null;
  departDate: string;
};

export type TimelineDay = {
  date: string;
  cards: TimelineFlightCard[];
  ellipsis?: boolean;
};

export function flightSignature(flight: Flight): string {
  return [flight.airline, flight.number, flight.from, flight.to, flight.departAt, flight.arriveAt].join("|");
}

export function groupFlights(flights: Flight[]): {
  key: string;
  flights: Flight[];
  traveler: string;
}[] {
  const groups = new Map<string, Flight[]>();
  for (const flight of flights) {
    const key = flightSignature(flight);
    const list = groups.get(key) ?? [];
    list.push(flight);
    groups.set(key, list);
  }
  return [...groups.values()].map((group) => ({
    key: flightSignature(group[0]),
    flights: group,
    traveler: [...new Set(group.map((item) => item.traveler || "Viajante"))]
      .sort((left, right) => left.localeCompare(right, "pt-BR"))
      .join(" & "),
  }));
}

export function nextConnection(flight: Flight, all: Flight[]): string | null {
  const arrive = localToUtc(flight.arriveAt, flight.arriveTz);
  const next = all
    .filter((item) => item.traveler === flight.traveler && item.id !== flight.id)
    .map((item) => ({ item, at: localToUtc(item.departAt, item.departTz) }))
    .filter((row) => row.at.getTime() >= arrive.getTime())
    .sort((left, right) => left.at.getTime() - right.at.getTime())[0];
  if (!next) return null;
  return hoursBetween(arrive, next.at);
}

export function buildFlightDays(flights: Flight[]): TimelineDay[] {
  if (flights.length === 0) return [];

  const cards: TimelineFlightCard[] = groupFlights(flights).map((group) => {
    const flight = group.flights[0];
    const depart = localToUtc(flight.departAt, flight.departTz);
    const arrive = localToUtc(flight.arriveAt, flight.arriveTz);
    return {
      id: group.key,
      traveler: group.traveler,
      airline: flight.airline,
      number: flight.number,
      from: flight.from || "—",
      to: flight.to || "—",
      departTime: formatClock(flight.departAt),
      arriveTime: formatClock(flight.arriveAt),
      duration: hoursBetween(depart, arrive),
      connection: nextConnection(flight, flights),
      departDate: flight.departAt.slice(0, 10),
    };
  });

  const dates = [...new Set(cards.map((card) => card.departDate))].sort();
  const days: TimelineDay[] = [];
  for (const [index, date] of dates.entries()) {
    if (index > 0 && calendarDaysBetween(dates[index - 1], date) > 1) {
      days.push({ date: `${dates[index - 1]}…${date}`, cards: [], ellipsis: true });
    }
    days.push({
      date,
      cards: cards.filter((card) => card.departDate === date),
    });
  }
  return days;
}

export function cityHops(cities: CityStay[]): {
  from: CityStay;
  to: CityStay;
  date: string;
}[] {
  const ordered = [...cities].sort((left, right) => left.start.localeCompare(right.start));
  const hops: { from: CityStay; to: CityStay; date: string }[] = [];
  for (let index = 0; index < ordered.length - 1; index += 1) {
    hops.push({
      from: ordered[index],
      to: ordered[index + 1],
      date: ordered[index].end,
    });
  }
  return hops;
}
