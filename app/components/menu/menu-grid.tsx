import type { MenuItem } from "../../data/menu";
import { MenuItemCard } from "./menu-item-card";

export function MenuGrid({ items }: { items: readonly MenuItem[] }) {
  if (items.length === 0) {
    return (
      <p role="status" aria-live="polite">
        No encontramos nada con esa búsqueda. Prueba con otra palabra.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <MenuItemCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
