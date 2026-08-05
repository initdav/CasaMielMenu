import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";

import { getActiveCategory } from "./active-category";

const FALLBACK_LINE_OFFSET = 144;

export function useActiveCategory(categoryIds: readonly string[]) {
  const location = useLocation();
  const categoryIdSet = useMemo(() => new Set(categoryIds), [categoryIds]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(() =>
    categoryIdSet.has(location.hash.slice(1)) ? location.hash.slice(1) : null,
  );
  const activeCategoryIdRef = useRef(activeCategoryId);

  useEffect(() => {
    const hashId = location.hash.slice(1);
    if (categoryIdSet.has(hashId)) {
      activeCategoryIdRef.current = hashId;
      setActiveCategoryId(hashId);
    }
  }, [location.hash, categoryIdSet]);

  useEffect(() => {
    const sections = categoryIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const lineOffset =
      parseFloat(getComputedStyle(sections[0]).scrollMarginTop) ||
      FALLBACK_LINE_OFFSET;

    let scheduled = false;
    let frame = 0;

    const applyActive = (id: string | null) => {
      if (id === activeCategoryIdRef.current) return;
      activeCategoryIdRef.current = id;
      setActiveCategoryId(id);

      const currentHash = window.location.hash.slice(1);
      if (id === null) {
        if (categoryIdSet.has(currentHash)) {
          window.history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search,
          );
        }
        return;
      }
      if (currentHash !== id) {
        window.history.replaceState(null, "", `#${id}`);
      }
    };

    const recompute = () => {
      scheduled = false;
      const positions = sections.map((section) => {
        const rect = section.getBoundingClientRect();
        return { id: section.id, top: rect.top, bottom: rect.bottom };
      });
      applyActive(getActiveCategory(positions, lineOffset));
    };

    const scheduleRecompute = () => {
      if (scheduled) return;
      scheduled = true;
      frame = requestAnimationFrame(recompute);
    };

    window.addEventListener("scroll", scheduleRecompute, { passive: true });
    window.addEventListener("resize", scheduleRecompute);

    const resizeObserver = new ResizeObserver(scheduleRecompute);
    resizeObserver.observe(document.body);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleRecompute);
      window.removeEventListener("resize", scheduleRecompute);
      resizeObserver.disconnect();
    };
  }, [categoryIds, categoryIdSet]);

  return activeCategoryId;
}
