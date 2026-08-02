import type { MenuCategory, MenuCategoryId, MenuItem } from "../data/menu";

export type MenuFilterCategory = MenuCategoryId | "all";

export type MenuFilterOptions = {
  items: readonly MenuItem[];
  categories: readonly MenuCategory[];
  query: string;
  categoryId: MenuFilterCategory;
};

export function normalizeMenuText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function filterMenuItems({
  items,
  categories,
  query,
  categoryId,
}: MenuFilterOptions): MenuItem[] {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
  const normalizedQuery = normalizeMenuText(query);

  return items.filter((item) => {
    if (categoryId !== "all" && item.category !== categoryId) return false;

    const categoryName = categoryNames.get(item.category) ?? "";
    const searchableText = normalizeMenuText(
      [item.title, item.description ?? "", categoryName].join(" "),
    );

    return normalizedQuery === "" || searchableText.includes(normalizedQuery);
  });
}
