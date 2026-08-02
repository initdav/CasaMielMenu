import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const cardSource = await readFile(
  new URL("../app/components/menu/menu-item-card.tsx", import.meta.url),
  "utf8",
);
const gridSource = await readFile(
  new URL("../app/components/menu/menu-grid.tsx", import.meta.url),
  "utf8",
);
const homeSource = await readFile(
  new URL("../app/routes/home.tsx", import.meta.url),
  "utf8",
);
const filterSource = await readFile(
  new URL("../app/components/menu/menu-filters.tsx", import.meta.url),
  "utf8",
);
const appCssSource = await readFile(
  new URL("../app/app.css", import.meta.url),
  "utf8",
);

test("renders editorial category sections in canonical order", () => {
  assert.match(gridSource, /categories: readonly MenuCategory\[\]/);
  assert.match(gridSource, /categories\s*\.map/);
  assert.match(gridSource, /items\.filter/);
  assert.match(gridSource, /aria-labelledby/);
  assert.match(gridSource, /lg:grid-cols/);
  assert.match(gridSource, /grid-cols-1/);
});

test("renders unframed menu rows with the approved hover treatment", () => {
  assert.match(cardSource, /border-b/);
  assert.match(cardSource, /border-dashed/);
  assert.match(cardSource, /transition/);
  assert.match(cardSource, /group-hover:translate-x-2/);
  assert.match(cardSource, /group-hover:text-casa-olive/);
  assert.match(cardSource, /text-xl/);
  assert.doesNotMatch(cardSource, /rounded-3xl/);
  assert.doesNotMatch(cardSource, /min-h-40/);
  assert.doesNotMatch(cardSource, /bg-casa-cream/);
});

test("keeps the menu intro heading at a modest scale", () => {
  assert.match(homeSource, /text-4xl/);
  assert.match(homeSource, /sm:text-5xl/);
  assert.doesNotMatch(homeSource, /sm:text-6xl/);
});

test("moves only menu text with a 100ms translate transition", () => {
  assert.match(cardSource, /className="group border-b/);
  assert.match(
    cardSource,
    /<div className="transition-\[translate,color\] duration-100[^\"]*group-hover:translate-x-2/,
  );
  assert.match(cardSource, /duration-100/);
  assert.doesNotMatch(
    cardSource,
    /<div className="flex[^\"]*group-hover:translate-x-2/,
  );
  assert.doesNotMatch(cardSource, /<p className="[^\"]*group-hover:translate-x-2/);
  assert.doesNotMatch(cardSource, /transition-\[transform,color\]/);
});

test("uses pointer cursors for category buttons and 16px body text", () => {
  assert.match(filterSource, /cursor-pointer/);
  assert.match(appCssSource, /font-size: 16px/);
  assert.doesNotMatch(appCssSource, /font-size: 20px/);
});
