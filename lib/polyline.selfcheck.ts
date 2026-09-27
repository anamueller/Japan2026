import assert from "node:assert/strict";
import { decodePolyline, waypointOrder } from "./polyline";

assert.deepEqual(waypointOrder(4, [1, 0]), [0, 2, 1, 3]);
assert.deepEqual(waypointOrder(2), [0, 1]);
assert.deepEqual(waypointOrder(3, [-1]), [0, 1, 2]);

const decoded = decodePolyline("_p~iF~ps|U_ulLnnqC_mqNvxq`@");
assert.equal(decoded.length, 3);
assert.ok(Math.abs(decoded[0][0] - 38.5) < 0.01);
assert.ok(Math.abs(decoded[0][1] + 120.2) < 0.01);
console.log("polyline self-check ok");
