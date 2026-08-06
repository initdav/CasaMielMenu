export type SectionPosition = {
  id: string;
  top: number;
};

export function getActiveCategory(
  sections: readonly SectionPosition[],
  threshold: number,
  atBottom: boolean,
): string | null {
  if (sections.length === 0) return null;
  if (atBottom) return sections[sections.length - 1].id;

  for (let index = sections.length - 1; index >= 0; index--) {
    if (sections[index].top <= threshold) return sections[index].id;
  }

  return null;
}
