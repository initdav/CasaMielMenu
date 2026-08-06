import { useEffect, useMemo, useRef } from "react";

import type { MenuCategory, MenuItem } from "../../data/menu";
import { getActiveCategory } from "../../lib/visible-category";
import { MenuItemCard } from "./menu-item-card";

type MenuGridProps = {
  categories: readonly MenuCategory[];
  items: readonly MenuItem[];
  onActiveCategoryChange: (categoryId: string) => void;
};

const SCROLL_SPY_REFERENCE_OFFSET = 68;
const SCROLL_SPY_BOTTOM_TOLERANCE = 2;

export function MenuGrid({
  categories,
  items,
  onActiveCategoryChange,
}: MenuGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const activeCategoryRef = useRef<string | null>(null);

  const visibleCategories = useMemo(
    () =>
      categories
        .map((category) => ({
          category,
          items: items.filter((item) => item.category === category.id),
        }))
        .filter(({ items: categoryItems }) => categoryItems.length > 0),
    [categories, items],
  );

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const sections = Array.from(
      grid.querySelectorAll<HTMLElement>("[data-category-id]"),
    );
    if (sections.length === 0) return;

    let animationFrame = 0;

    const updateActiveCategory = () => {
      animationFrame = 0;
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - SCROLL_SPY_BOTTOM_TOLERANCE;
      const activeCategory = getActiveCategory(
        sections.map((section) => ({
          id: section.getAttribute("data-category-id") as string,
          top: section.getBoundingClientRect().top,
        })),
        SCROLL_SPY_REFERENCE_OFFSET,
        atBottom,
      );
      if (
        activeCategory === null ||
        activeCategory === activeCategoryRef.current
      ) {
        return;
      }
      activeCategoryRef.current = activeCategory;
      onActiveCategoryChange(activeCategory);
    };

    const scheduleUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = requestAnimationFrame(updateActiveCategory);
      }
    };

    updateActiveCategory();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (animationFrame !== 0) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [visibleCategories, onActiveCategoryChange]);

  if (items.length === 0) {
    return (
      <p role="status" aria-live="polite">
        No hay productos disponibles en esta categoría.
      </p>
    );
  }

  return (
    <div ref={gridRef}>
      {visibleCategories.map(({ category, items: categoryItems }) => (
        <section
          key={category.id}
          data-category-id={category.id}
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
