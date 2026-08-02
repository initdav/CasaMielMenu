import { useEffect, useRef, useState } from "react";

import type { MenuCategory } from "../../data/menu";
import {
  getCategoryScrollAvailability,
  type CategoryScrollAvailability,
} from "../../lib/category-scroll";
import type { MenuFilterCategory } from "../../lib/menu-filter";

import "./menu-filters.css";

type MenuFiltersProps = {
  categories: readonly MenuCategory[];
  selectedCategoryId: MenuFilterCategory;
  onCategoryChange: (categoryId: MenuFilterCategory) => void;
};

export function MenuFilters({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: MenuFiltersProps) {
  const categoryRowRef = useRef<HTMLDivElement>(null);
  const [scrollAvailability, setScrollAvailability] =
    useState<CategoryScrollAvailability>({
      canScrollLeft: false,
      canScrollRight: false,
    });
  const { canScrollLeft, canScrollRight } = scrollAvailability;

  useEffect(() => {
    const categoryRow = categoryRowRef.current;
    if (!categoryRow) return;

    const updateScrollAvailability = () => {
      setScrollAvailability(getCategoryScrollAvailability(categoryRow));
    };

    updateScrollAvailability();
    categoryRow.addEventListener("scroll", updateScrollAvailability, {
      passive: true,
    });

    const resizeObserver = new ResizeObserver(updateScrollAvailability);
    resizeObserver.observe(categoryRow);

    return () => {
      categoryRow.removeEventListener("scroll", updateScrollAvailability);
      resizeObserver.disconnect();
    };
  }, [categories]);

  const scrollCategories = (direction: "left" | "right") => {
    const categoryRow = categoryRowRef.current;
    if (!categoryRow) return;

    const distance = Math.max(categoryRow.clientWidth * 0.75, 160);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    categoryRow.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <nav
        aria-label="Categorías del menú"
        className="flex min-w-0 items-stretch pb-2"
      >
        {canScrollLeft ? (
          <div className="menu-category-scroll-control menu-category-scroll-control--left">
            <button
              type="button"
              aria-label="Desplazar categorías a la izquierda"
              onClick={() => scrollCategories("left")}
              className="cursor-pointer rounded-full border border-casa-espresso/20 bg-casa-oat p-2 text-casa-espresso transition-colors hover:bg-casa-espresso/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none"
            >
              <span aria-hidden="true">‹</span>
            </button>
          </div>
        ) : null}
        <div
          ref={categoryRowRef}
          className="menu-category-scroll flex min-w-0 flex-1 gap-2 overflow-x-auto"
        >
          <button
            type="button"
            aria-pressed={selectedCategoryId === "all"}
            onClick={() => onCategoryChange("all")}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none ${selectedCategoryId === "all" ? "border-casa-espresso bg-casa-espresso text-casa-oat" : "border-casa-espresso/20 bg-transparent text-casa-espresso hover:bg-casa-espresso/20"}`}
          >
            Todo
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={selectedCategoryId === category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none ${selectedCategoryId === category.id ? "border-casa-espresso bg-casa-espresso text-casa-oat" : "border-casa-espresso/20 bg-transparent text-casa-espresso hover:bg-casa-espresso/20"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {canScrollRight ? (
          <div className="menu-category-scroll-control menu-category-scroll-control--right">
            <button
              type="button"
              aria-label="Desplazar categorías a la derecha"
              onClick={() => scrollCategories("right")}
              className="cursor-pointer rounded-full border border-casa-espresso/20 bg-casa-oat p-2 text-casa-espresso transition-colors hover:bg-casa-espresso/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none"
            >
              <span aria-hidden="true">›</span>
            </button>
          </div>
        ) : null}
      </nav>
    </div>
  );
}
