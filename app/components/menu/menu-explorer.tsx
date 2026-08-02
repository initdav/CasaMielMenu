import { useMemo, useState } from "react";

import { menuCategories, menuItems } from "../../data/menu";
import {
  filterMenuItems,
  type MenuFilterCategory,
} from "../../lib/menu-filter";
import { MenuFilters } from "./menu-filters";
import { MenuGrid } from "./menu-grid";

export function MenuExplorer() {
  const [categoryId, setCategoryId] = useState<MenuFilterCategory>("all");
  const filteredItems = useMemo(
    () =>
      filterMenuItems({
        items: menuItems,
        categoryId,
      }),
    [categoryId],
  );

  return (
    <div className="mt-10 space-y-8">
      <MenuFilters
        categories={menuCategories}
        selectedCategoryId={categoryId}
        onCategoryChange={setCategoryId}
      />
      <MenuGrid categories={menuCategories} items={filteredItems} />
    </div>
  );
}
