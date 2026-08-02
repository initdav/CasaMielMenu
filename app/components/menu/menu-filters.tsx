import type { MenuCategory } from "../../data/menu";
import type { MenuFilterCategory } from "../../lib/menu-filter";

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
  return (
    <div>
      <nav
        aria-label="Categorías del menú"
        className="flex gap-2 overflow-x-auto pb-2"
      >
        <button
          type="button"
          aria-pressed={selectedCategoryId === "all"}
          onClick={() => onCategoryChange("all")}
          className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none ${selectedCategoryId === "all" ? "border-casa-espresso bg-casa-espresso text-casa-oat" : "border-casa-espresso/20 bg-transparent text-casa-espresso hover:border-casa-espresso/40"}`}
        >
          Todo
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selectedCategoryId === category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-casa-honey motion-reduce:transition-none ${selectedCategoryId === category.id ? "border-casa-espresso bg-casa-espresso text-casa-oat" : "border-casa-espresso/20 bg-transparent text-casa-espresso hover:border-casa-espresso/40"}`}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
