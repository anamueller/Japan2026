import type { LatLng } from "@/lib/osrm-route";

export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    lat += nextValue();
    lng += nextValue();
    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;

  function nextValue() {
    let result = 0;
    let shift = 0;
    let byte = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    return result & 1 ? ~(result >> 1) : result >> 1;
  }
}

export function waypointOrder(
  count: number,
  intermediateOrder?: number[],
): number[] {
  const identity = Array.from({ length: count }, (_, index) => index);
  const middleCount = count - 2;
  if (
    count < 3 ||
    !intermediateOrder?.length ||
    intermediateOrder.length !== middleCount ||
    intermediateOrder.some((index) => index < 0 || index >= middleCount)
  ) {
    return identity;
  }
  return [0, ...intermediateOrder.map((index) => index + 1), count - 1];
}
