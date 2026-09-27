import assert from "node:assert/strict";
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
console.log("places self-check ok");
