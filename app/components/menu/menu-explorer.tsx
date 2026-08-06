import { useState } from "react";

import { menuCategories, menuItems } from "../../data/menu";
import { MenuFilters } from "./menu-filters";
import { MenuGrid } from "./menu-grid";

export function MenuExplorer() {
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    menuCategories[0]?.id ?? null,
  );

  return (
    <div className="mt-10 space-y-8">
      <div
        id="menu-filters"
        className="sticky top-0 z-20 -mx-4 border-b border-casa-espresso/10 bg-casa-oat/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
      >
        <MenuFilters
          categories={menuCategories}
          activeCategoryId={activeCategoryId}
        />
      </div>
      <MenuGrid
        categories={menuCategories}
        items={menuItems}
        onActiveCategoryChange={setActiveCategoryId}
      />
    </div>
  );
}
