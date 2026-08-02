import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cardSource = await readFile(
  new URL("../app/components/menu/menu-item-card.tsx", import.meta.url),
  "utf8",
);

test("uses the transparent low-contrast menu card treatment", () => {
  assert.match(cardSource, /border-casa-espresso\/20/);
  assert.match(cardSource, /bg-transparent/);
  assert.match(cardSource, /text-casa-espresso/);
  assert.doesNotMatch(cardSource, /bg-casa-cream/);
  assert.doesNotMatch(cardSource, /text-casa-honey/);
});
