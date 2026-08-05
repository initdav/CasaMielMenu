import { useEffect, useState } from "react";

const FILTERS_SELECTOR = "#menu-filters";
const MENU_SELECTOR = "#menu";
const events = ["scroll", "resize"] as const;

export function BackToTop() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const filters = document.querySelector<HTMLElement>(FILTERS_SELECTOR);
    if (!filters) return;

    const update = () => setStuck(filters.getBoundingClientRect().top <= 0);
    update();
    for (const event of events) window.addEventListener(event, update, {
      passive: true,
    });
    return () => {
      for (const event of events)
        window.removeEventListener(event, update);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        document.querySelector(MENU_SELECTOR)?.scrollIntoView({
          behavior: "smooth",
        })
      }
      aria-label="Volver arriba"
      aria-hidden={!stuck}
      tabIndex={stuck ? 0 : -1}
      className={`fixed right-4 bottom-4 z-50 grid size-12 place-items-center rounded-full bg-casa-espresso text-casa-oat shadow-lg transition-[opacity,translate] duration-300 ease-out hover:bg-casa-honey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-espresso motion-reduce:transition-none ${
        stuck
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg viewBox="0 0 16 16" className="size-5" fill="none" aria-hidden="true">
        <path
          d="m4 10 4-4 4 4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}