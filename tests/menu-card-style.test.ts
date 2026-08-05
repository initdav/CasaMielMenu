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
const filterStylesSource = await readFile(
  new URL("../app/components/menu/menu-filters.css", import.meta.url),
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

test("renders category controls without menu search", () => {
  assert.doesNotMatch(filterSource, /menu-search/);
  assert.doesNotMatch(filterSource, /onQueryChange/);
  assert.doesNotMatch(filterSource, /query:/);
  assert.doesNotMatch(homeSource, /busca/i);
  assert.doesNotMatch(gridSource, /búsqueda|palabra/i);
});

test("renders fixed disabled-aware scroll controls with a scroll-driven edge fade", () => {
  assert.match(filterSource, /getCategoryScrollAvailability/);
  assert.match(filterSource, /useRef/);
  assert.match(filterSource, /ResizeObserver/);
  assert.match(filterSource, /aria-label="Desplazar categorías a la izquierda"/);
  assert.match(filterSource, /aria-label="Desplazar categorías a la derecha"/);
  assert.match(filterSource, /disabled=\{!canScrollLeft\}/);
  assert.match(filterSource, /disabled=\{!canScrollRight\}/);
  assert.match(filterSource, /getCategoryScrollTarget/);
  assert.match(filterSource, /pendingScrollTargetRef/);
  assert.match(filterSource, /setScrollAvailability\(/);
  assert.match(filterSource, /menu-category-scroll/);
  assert.doesNotMatch(filterSource, /menu-category-scroll-viewport/);
  assert.doesNotMatch(filterSource, /menu-category-scroll-fade/);
  assert.doesNotMatch(filterSource, /menu-category-scroll-control/);
  assert.match(filterSource, /className="flex min-w-0 items-center"/);
  assert.match(
    filterSource,
    /menu-category-scroll flex min-w-0 flex-1 gap-2 overflow-x-auto/,
  );
  assert.match(filterSource, /flex w-12 min-w-12 shrink-0 items-center justify-start/);
  assert.match(filterSource, /flex w-12 min-w-12 shrink-0 items-center justify-end/);
  assert.match(filterStylesSource, /scrollbar-width:\s*none/);
  assert.match(filterStylesSource, /::-webkit-scrollbar/);
  assert.doesNotMatch(filterStylesSource, /menu-category-scroll-control/);
  assert.match(filterStylesSource, /@property/);
  assert.match(filterStylesSource, /@keyframes menu-category-scroll-fade-start/);
  assert.match(filterStylesSource, /@keyframes menu-category-scroll-fade-end/);
  assert.match(filterStylesSource, /mask-image:/);
  assert.match(filterStylesSource, /linear-gradient\(\s*to right/);
  assert.match(filterStylesSource, /animation-timeline:\s*scroll\(self x\)/);
  assert.match(filterStylesSource, /animation-fill-mode:\s*both/);
  assert.match(filterStylesSource, /@supports \(animation-timeline: scroll\(self x\)\)/);
  assert.match(filterStylesSource, /@supports not \(animation-timeline: scroll\(self x\)\)/);
  assert.match(filterSource, /<svg[^>]*viewBox="0 0 16 16"/s);
});
