import type { MenuCategory } from "../../data/menu";
import type { MenuFilterCategory } from "../../lib/menu-filter";

type MenuFiltersProps = {
  categories: readonly MenuCategory[];
  query: string;
  selectedCategoryId: MenuFilterCategory;
  onQueryChange: (query: string) => void;
  onCategoryChange: (categoryId: MenuFilterCategory) => void;
};

export function MenuFilters({
  categories,
  query,
  selectedCategoryId,
  onQueryChange,
  onCategoryChange,
}: MenuFiltersProps) {
  return (
    <div className="space-y-5">
      <label htmlFor="menu-search" className="sr-only">
        Buscar en el menú
      </label>
      <input
        id="menu-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Buscar por nombre o antojo"
        className="w-full rounded-full border border-casa-espresso/25 bg-casa-cream px-5 py-3 text-casa-espresso outline-none focus-visible:border-casa-honey focus-visible:ring-2 focus-visible:ring-casa-honey"
      />
      <nav
        aria-label="Categorías del menú"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        <button
          type="button"
          aria-pressed={selectedCategoryId === "all"}
          onClick={() => onCategoryChange("all")}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none ${selectedCategoryId === "all" ? "bg-casa-espresso text-casa-oat" : "bg-casa-cream text-casa-espresso hover:bg-casa-cream/75"}`}
        >
          Todo
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selectedCategoryId === category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none ${selectedCategoryId === category.id ? "bg-casa-espresso text-casa-oat" : "bg-casa-cream text-casa-espresso hover:bg-casa-cream/75"}`}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
