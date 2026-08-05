import assert from "node:assert/strict";
import test from "node:test";

import {
  getActiveCategory,
  type SectionPosition,
} from "../app/lib/active-category.ts";

const LINE = 144;

const position = (id: string, top: number, bottom: number): SectionPosition => ({
  id,
  top,
  bottom,
});

test("returns null without any sections", () => {
  assert.equal(getActiveCategory([], LINE), null);
});

test("returns null while the line sits above the first section", () => {
  const sections = [
    position("desayunos", 900, 1500),
    position("dulces", 1500, 2100),
  ];
  assert.equal(getActiveCategory(sections, LINE), null);
});

test("returns null once the last section has scrolled past the line", () => {
  const sections = [
    position("desayunos", -1200, -600),
    position("dulces", -600, -20),
  ];
  assert.equal(getActiveCategory(sections, LINE), null);
});

test("activates the first section when its heading reaches the line", () => {
  const sections = [
    position("desayunos", 144, 744),
    position("dulces", 744, 1344),
  ];
  assert.equal(getActiveCategory(sections, LINE), "desayunos");
});

test("treats a heading resting exactly on the line as active", () => {
  const sections = [
    position("desayunos", -500, 144),
    position("dulces", 144, 744),
  ];
  assert.equal(getActiveCategory(sections, LINE), "dulces");
});

test("follows the heading that last passed the line while scrolling down", () => {
  const sections = [
    position("desayunos", -400, 144),
    position("dulces", 144, 744),
    position("calientes-cafe", 744, 1344),
  ];
  assert.equal(getActiveCategory(sections, LINE), "dulces");
});

test("keeps the last section active while it still crosses the line", () => {
  const sections = [
    position("desayunos", -800, -200),
    position("sodas", -200, 600),
  ];
  assert.equal(getActiveCategory(sections, LINE), "sodas");
});
