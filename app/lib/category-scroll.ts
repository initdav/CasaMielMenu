export type CategoryScrollMetrics = {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
};

export type CategoryScrollAvailability = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

export type CategoryScrollTargetMetrics = CategoryScrollMetrics & {
  direction: "left" | "right";
  distance: number;
};

const SCROLL_EDGE_TOLERANCE = 1;

export function getCategoryScrollTarget({
  direction,
  scrollLeft,
  clientWidth,
  scrollWidth,
  distance,
}: CategoryScrollTargetMetrics): number {
  const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);
  const nextScrollLeft =
    scrollLeft + (direction === "left" ? -distance : distance);

  return Math.min(Math.max(nextScrollLeft, 0), maxScrollLeft);
}

export function getCategoryScrollAvailability({
  scrollLeft,
  clientWidth,
  scrollWidth,
}: CategoryScrollMetrics): CategoryScrollAvailability {
  const maxScrollLeft = scrollWidth - clientWidth;

  return {
    canScrollLeft: scrollLeft > SCROLL_EDGE_TOLERANCE,
    canScrollRight: scrollLeft < maxScrollLeft - SCROLL_EDGE_TOLERANCE,
  };
}
