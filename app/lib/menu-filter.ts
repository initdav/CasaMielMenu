import type { MenuCategoryId, MenuItem } from "../data/menu";

export type MenuFilterCategory = MenuCategoryId | "all";

export type MenuFilterOptions = {
  items: readonly MenuItem[];
  categoryId: MenuFilterCategory;
};

export function filterMenuItems({
  items,
  categoryId,
}: MenuFilterOptions): MenuItem[] {
  return items.filter(
    (item) => categoryId === "all" || item.category === categoryId,
  );
}
