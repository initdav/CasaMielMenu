import { useEffect, useRef, useState } from "react";

import type { MenuCategory } from "../../data/menu";
import {
  getCategoryScrollAvailability,
  getCategoryScrollTarget,
  type CategoryScrollAvailability,
} from "../../lib/category-scroll";

import "./menu-filters.css";

type MenuFiltersProps = {
  categories: readonly MenuCategory[];
  activeCategoryId: string | null;
};

const scrollButtonClassName =
  "size-10 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-casa-espresso/20 bg-casa-oat text-casa-espresso transition-colors hover:bg-casa-espresso hover:text-casa-oat focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey disabled:cursor-default disabled:opacity-30 disabled:hover:bg-casa-oat disabled:hover:text-casa-espresso motion-reduce:transition-none";

const categoryClassName =
  "whitespace-nowrap rounded-full border border-casa-espresso/20 bg-transparent px-4 py-2 text-base text-casa-espresso transition-colors hover:bg-casa-espresso hover:text-casa-oat motion-reduce:transition-none";

const activeCategoryClassName =
  "whitespace-nowrap rounded-full border border-casa-espresso bg-casa-espresso px-4 py-2 text-base text-casa-oat transition-colors motion-reduce:transition-none";

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

function CategoryPill({
  category,
  isActive,
}: {
  category: MenuCategory;
  isActive: boolean;
}) {
  const pillRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    pillRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [isActive]);

  return (
    <button
      ref={pillRef}
      type="button"
      aria-current={isActive ? "true" : undefined}
      className={isActive ? activeCategoryClassName : categoryClassName}
    >
      {category.name}
    </button>
  );
}

export function MenuFilters({
  categories,
  activeCategoryId,
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
      {canScrollLeft ? (
        <div className="flex w-12 min-w-12 shrink-0 items-center justify-start">
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
      ) : null}
      <div
        ref={categoryRowRef}
        className="menu-category-scroll flex min-w-0 flex-1 gap-2 overflow-x-auto"
      >
        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            category={category}
            isActive={activeCategoryId === category.id}
          />
        ))}
      </div>
      {canScrollRight ? (
        <div className="flex w-12 min-w-12 shrink-0 items-center justify-end">
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
      ) : null}
    </nav>
  );
}
