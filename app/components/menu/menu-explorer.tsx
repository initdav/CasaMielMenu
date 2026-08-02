import { useMemo, useState } from "react";

import { menuCategories, menuItems } from "../../data/menu";
import {
  filterMenuItems,
  type MenuFilterCategory,
} from "../../lib/menu-filter";
import { MenuFilters } from "./menu-filters";
import { MenuGrid } from "./menu-grid";

export function MenuExplorer() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<MenuFilterCategory>("all");
  const filteredItems = useMemo(
    () =>
      filterMenuItems({
        items: menuItems,
        categories: menuCategories,
        query,
        categoryId,
      }),
    [categoryId, query],
  );

  return (
    <div className="mt-10 space-y-8">
      <MenuFilters
        categories={menuCategories}
        query={query}
        selectedCategoryId={categoryId}
        onQueryChange={setQuery}
        onCategoryChange={setCategoryId}
      />
      <MenuGrid categories={menuCategories} items={filteredItems} />
    </div>
  );
}
