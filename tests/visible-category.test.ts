import assert from "node:assert/strict";
import test from "node:test";

import { getActiveCategory } from "../app/lib/visible-category.ts";

const sections = [
  { id: "desayunos", top: 157 },
  { id: "dulces", top: 662 },
  { id: "calientes-cafe", top: 928 },
];

test("returns the bottommost section whose top passed the reference line", () => {
  assert.equal(
    getActiveCategory(
      [
        { id: "desayunos", top: 68 },
        { id: "dulces", top: 573 },
        { id: "calientes-cafe", top: 839 },
      ],
      68,
      false,
    ),
    "desayunos",
  );
  assert.equal(
    getActiveCategory(
      [
        { id: "desayunos", top: -2000 },
        { id: "dulces", top: -1200 },
        { id: "calientes-cafe", top: -500 },
        { id: "sodas", top: 20 },
      ],
      68,
      false,
    ),
    "sodas",
  );
});

test("returns the last section when scrolled to the bottom", () => {
  assert.equal(getActiveCategory(sections, 68, true), "calientes-cafe");
});

test("returns null when no section has crossed the reference line", () => {
  assert.equal(
    getActiveCategory([{ id: "desayunos", top: 918 }], 68, false),
    null,
  );
});

test("returns null for an empty list", () => {
  assert.equal(getActiveCategory([], 68, false), null);
  assert.equal(getActiveCategory([], 68, true), null);
});
