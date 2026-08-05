import type { MenuItem } from "../../data/menu";
import {
  copCurrencyStrategy,
  formatCurrency,
} from "../../lib/format-currency";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article
      data-menu-item-slug={item.slug}
      className="group border-b border-dashed border-casa-espresso/25 text-casa-espresso last:border-b-0"
    >
      <div className="flex items-start justify-between gap-4 py-6 first:pt-5 last:pb-5 sm:gap-8">
        <div className="transition-[translate,color] duration-100 group-hover:translate-x-2 group-hover:text-casa-olive motion-reduce:transition-none">
          <h4 className="font-sans text-xl font-semibold leading-tight">
            {item.title}
          </h4>
          {item.description ? (
            <p className="mt-1.5 font-medium text-casa-olive group-hover:text-casa-olive/80">
              {item.description}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 pt-1 text-base font-medium text-current group-hover:text-casa-olive">
          {formatCurrency(item.price, copCurrencyStrategy)}
        </p>
      </div>
    </article>
  );
}
