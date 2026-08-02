import assert from "node:assert/strict";
import test from "node:test";

import {
  getCategoryScrollAvailability,
  getCategoryScrollTarget,
} from "../app/lib/category-scroll.ts";

test("clamps a right scroll target to the end before smooth scrolling", () => {
  assert.equal(
    getCategoryScrollTarget({
      direction: "right",
      scrollLeft: 360,
      clientWidth: 300,
      scrollWidth: 800,
      distance: 240,
    }),
    500,
  );
});

test("clamps a left scroll target to the start before smooth scrolling", () => {
  assert.equal(
    getCategoryScrollTarget({
      direction: "left",
      scrollLeft: 140,
      clientWidth: 300,
      scrollWidth: 800,
      distance: 240,
    }),
    0,
  );
});

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

test("keeps the left control enabled beyond the start tolerance", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 2,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: true, canScrollRight: true },
  );
});

test("keeps the right control enabled until the final tolerance", () => {
  assert.deepEqual(
    getCategoryScrollAvailability({
      scrollLeft: 498,
      clientWidth: 300,
      scrollWidth: 800,
    }),
    { canScrollLeft: true, canScrollRight: true },
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
