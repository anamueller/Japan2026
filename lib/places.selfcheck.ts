import assert from "node:assert/strict";
import { reorderById } from "./mock-data";
import { categoryFromTypes } from "./places";

assert.deepEqual(categoryFromTypes(["restaurant", "food"]), {
  category: "Gastronomia",
  categoryEmoji: "🍣",
});
assert.deepEqual(categoryFromTypes(["park", "point_of_interest"]), {
  category: "Parque",
  categoryEmoji: "🌳",
});
assert.deepEqual(categoryFromTypes(["tourist_attraction"]), {
  category: "Passeio",
  categoryEmoji: "📍",
});
assert.deepEqual(
  reorderById([{ id: "a" }, { id: "b" }, { id: "c" }], "c", "a").map((item) => item.id),
  ["c", "a", "b"],
);

console.log("places self-check ok");
