import assert from "node:assert/strict";
import test from "node:test";

import { menuCategories, menuItems } from "../app/data/menu.ts";
import { filterMenuItems } from "../app/lib/menu-filter.ts";
import {
  copCurrencyStrategy,
  createIntlCurrencyStrategy,
  formatCurrency,
} from "../app/lib/format-currency.ts";

test("contains all 42 items in 8 published categories", () => {
  assert.equal(menuCategories.length, 8);
  assert.equal(menuItems.length, 42);
  assert.deepEqual(
    menuCategories.map((category) => category.id),
    [
      "desayunos",
      "dulces",
      "calientes-cafe",
      "frias-cafe",
      "filtrados",
      "calientes-sin-cafe",
      "frias-sin-cafe",
      "sodas",
    ],
  );
});

test("keeps slugs unique and item categories consistent", () => {
  assert.equal(new Set(menuItems.map((item) => item.slug)).size, 42);

  for (const category of menuCategories) {
    for (const item of category.items) {
      assert.equal(item.category, category.id);
      assert.ok(Number.isInteger(item.price));
      assert.ok(item.price > 0);
    }
  }
});

test("keeps product variants as separate records", () => {
  assert.deepEqual(
    menuItems
      .filter((item) => item.title === "Cold brew")
      .map((item) => [item.description ?? null, item.price]),
    [[null, 12000], ["Frutos rojos", 13000], ["Naranja", 13000]],
  );
});

test("filters by title, description, category, and selected category", () => {
  assert.equal(
    filterMenuItems({
      items: menuItems,
      categories: menuCategories,
      query: "cold brew",
      categoryId: "all",
    }).length,
    3,
  );
  assert.equal(
    filterMenuItems({
      items: menuItems,
      categories: menuCategories,
      query: "FRÍAS",
      categoryId: "all",
    }).length,
    13,
  );
  assert.equal(
    filterMenuItems({
      items: menuItems,
      categories: menuCategories,
      query: "",
      categoryId: "frias-cafe",
    }).length,
    8,
  );
  assert.equal(
    filterMenuItems({
      items: menuItems,
      categories: menuCategories,
      query: "not-a-menu-item",
      categoryId: "all",
    }).length,
    0,
  );
});

test("formats amounts through the selected currency strategy", () => {
  assert.equal(formatCurrency(20000, copCurrencyStrategy), "$20.000");
  assert.equal(formatCurrency(6500, copCurrencyStrategy), "$6.500");

  const usdCurrencyStrategy = createIntlCurrencyStrategy({
    locale: "en-US",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  assert.equal(formatCurrency(20, usdCurrencyStrategy), "$20.00");
});
