export type CategoryScrollMetrics = {
  scrollLeft: number;
  clientWidth: number;
  scrollWidth: number;
};

export type CategoryScrollAvailability = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
};

const SCROLL_EDGE_TOLERANCE = 1;

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
