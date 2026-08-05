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
      <div
        id="menu-filters"
        className="sticky top-0 z-20 -mx-4 border-b border-casa-espresso/10 bg-casa-oat/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        <MenuFilters
          categories={menuCategories}
          selectedCategoryId={categoryId}
          onCategoryChange={setCategoryId}
        />
      </div>
      <MenuGrid categories={menuCategories} items={filteredItems} />
    </div>
  );
}
