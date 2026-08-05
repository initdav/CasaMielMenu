export type SectionPosition = {
  id: string;
  top: number;
  bottom: number;
};

const LINE_EPSILON = 1;

export function getActiveCategory(
  sections: readonly SectionPosition[],
  line: number,
): string | null {
  if (sections.length === 0) return null;

  const detectionLine = line + LINE_EPSILON;
  const firstSection = sections[0];
  const lastSection = sections[sections.length - 1];

  if (
    detectionLine < firstSection.top ||
    detectionLine > lastSection.bottom
  ) {
    return null;
  }

  let activeId: string | null = null;
  for (const section of sections) {
    if (section.top <= detectionLine) {
      activeId = section.id;
    } else {
      break;
    }
  }

  return activeId;
}
