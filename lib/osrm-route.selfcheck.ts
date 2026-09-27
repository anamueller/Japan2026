import assert from "node:assert/strict";
import { osrmToLatLngs, straightRoute } from "./osrm-route";

assert.deepEqual(straightRoute([{ lat: 35.7, lng: 139.8 }]), [[35.7, 139.8]]);
assert.deepEqual(
  osrmToLatLngs({
    routes: [{ geometry: { coordinates: [[139.8, 35.7], [139.77, 35.71]] } }],
  }),
  [
    [35.7, 139.8],
    [35.71, 139.77],
  ],
);
assert.equal(osrmToLatLngs({ routes: [] }), null);
console.log("osrm-route self-check ok");
