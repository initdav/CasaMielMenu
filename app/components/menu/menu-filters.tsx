import { useEffect, useRef, useState } from "react";

import type { MenuCategory } from "../../data/menu";
import {
  getCategoryScrollAvailability,
  getCategoryScrollTarget,
  type CategoryScrollAvailability,
} from "../../lib/category-scroll";
import type { MenuFilterCategory } from "../../lib/menu-filter";

import "./menu-filters.css";

type MenuFiltersProps = {
  categories: readonly MenuCategory[];
  selectedCategoryId: MenuFilterCategory;
  onCategoryChange: (categoryId: MenuFilterCategory) => void;
};

const scrollButtonClassName =
  "size-10 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-casa-espresso/20 bg-casa-oat text-casa-espresso transition-colors hover:bg-casa-espresso/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey disabled:cursor-default disabled:opacity-30 disabled:hover:bg-casa-oat motion-reduce:transition-none";

function CategoryScrollChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={direction === "left" ? "m10 3-5 5 5 5" : "m6 3 5 5-5 5"} />
    </svg>
  );
}

export function MenuFilters({
  categories,
  selectedCategoryId,
  onCategoryChange,
}: MenuFiltersProps) {
  const categoryRowRef = useRef<HTMLDivElement>(null);
  const pendingScrollTargetRef = useRef<number | null>(null);
  const [scrollAvailability, setScrollAvailability] =
    useState<CategoryScrollAvailability>({
      canScrollLeft: false,
      canScrollRight: false,
    });
  const { canScrollLeft, canScrollRight } = scrollAvailability;

  useEffect(() => {
    const categoryRow = categoryRowRef.current;
    if (!categoryRow) return;
    pendingScrollTargetRef.current = null;

    const updateScrollAvailability = () => {
      const pendingScrollTarget = pendingScrollTargetRef.current;
      if (
        pendingScrollTarget !== null &&
        Math.abs(categoryRow.scrollLeft - pendingScrollTarget) > 1
      ) {
        setScrollAvailability(
          getCategoryScrollAvailability({
            scrollLeft: pendingScrollTarget,
            clientWidth: categoryRow.clientWidth,
            scrollWidth: categoryRow.scrollWidth,
          }),
        );
        return;
      }

      pendingScrollTargetRef.current = null;
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
    const targetScrollLeft = getCategoryScrollTarget({
      direction,
      scrollLeft: categoryRow.scrollLeft,
      clientWidth: categoryRow.clientWidth,
      scrollWidth: categoryRow.scrollWidth,
      distance,
    });

    pendingScrollTargetRef.current = targetScrollLeft;
    setScrollAvailability(
      getCategoryScrollAvailability({
        scrollLeft: targetScrollLeft,
        clientWidth: categoryRow.clientWidth,
        scrollWidth: categoryRow.scrollWidth,
      }),
    );

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    categoryRow.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <nav
      aria-label="Categorías del menú"
      className="flex min-w-0 items-center"
    >
      <div className="menu-category-scroll-control menu-category-scroll-control--left">
        <button
          type="button"
          aria-label="Desplazar categorías a la izquierda"
          disabled={!canScrollLeft}
          onClick={() => scrollCategories("left")}
          className={scrollButtonClassName}
        >
          <CategoryScrollChevron direction="left" />
        </button>
      </div>
      <div className="menu-category-scroll-viewport">
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
        <span
          aria-hidden="true"
          className={`menu-category-scroll-fade menu-category-scroll-fade--left ${canScrollLeft ? "opacity-100" : "opacity-0"}`}
        />
        <span
          aria-hidden="true"
          className={`menu-category-scroll-fade menu-category-scroll-fade--right ${canScrollRight ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div className="menu-category-scroll-control menu-category-scroll-control--right">
        <button
          type="button"
          aria-label="Desplazar categorías a la derecha"
          disabled={!canScrollRight}
          onClick={() => scrollCategories("right")}
          className={scrollButtonClassName}
        >
          <CategoryScrollChevron direction="right" />
        </button>
      </div>
    </nav>
  );
}
