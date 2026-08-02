import assert from "node:assert/strict";
import test from "node:test";

import { getCategoryScrollAvailability } from "../app/lib/category-scroll.ts";

test("shows only the right control at the start of an overflowing row", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 0,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: false, canScrollRight: true },
  );
});

test("shows both controls away from either scroll edge", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 250,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: true, canScrollRight: true },
  );
});

test("shows only the left control at the end of an overflowing row", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 500,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: true, canScrollRight: false },
  );
});

test("hides both controls when the complete row fits", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 0,
      clientWidth: 300,
      scrollWidth: 300,
    }),
    { canScrollLeft: false, canScrollRight: false },
  );
});

test("treats fractional edge positions as the edge", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 0.5,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: false, canScrollRight: true },
  );
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 499.5,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: true, canScrollRight: false },
  );
});
