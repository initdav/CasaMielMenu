import type { MenuCategory, MenuItem } from "../../data/menu";
import { MenuItemCard } from "./menu-item-card";

type MenuGridProps = {
  categories: readonly MenuCategory[];
  items: readonly MenuItem[];
};

export function MenuGrid({ categories, items }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <p role="status" aria-live="polite">
        No hay productos disponibles en esta categoría.
      </p>
    );
  }

  const visibleCategories = categories
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category.id),
    }))
    .filter(({ items: categoryItems }) => categoryItems.length > 0);

  return (
    <div>
      {visibleCategories.map(({ category, items: categoryItems }) => (
        <section
          key={category.id}
          aria-labelledby={`menu-category-${category.id}`}
          className="grid grid-cols-1 gap-8 border-b border-casa-espresso/20 py-12 first:pt-0 last:border-b-0 lg:grid-cols-[minmax(15rem,0.7fr)_1.3fr] lg:gap-16 lg:py-16"
        >
          <div className="self-start">
            <h3
              id={`menu-category-${category.id}`}
              className="text-3xl leading-tight text-casa-espresso sm:text-4xl"
            >
              {category.name}
            </h3>
          </div>
          <div className="grid">
            {categoryItems.map((item) => (
              <MenuItemCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
