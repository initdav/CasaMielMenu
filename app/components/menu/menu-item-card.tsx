import type { MenuItem } from "../../data/menu";
import {
  copCurrencyStrategy,
  formatCurrency,
} from "../../lib/format-currency";

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <article
      data-menu-item-slug={item.slug}
      className="flex min-h-40 flex-col justify-between rounded-3xl bg-casa-cream p-5 text-casa-espresso"
    >
      <div>
        <h3 className="text-3xl leading-none">{item.title}</h3>
        {item.description ? (
          <p className="mt-3 text-casa-espresso/70">{item.description}</p>
        ) : null}
      </div>
      <p className="mt-6 font-medium text-casa-honey">
        {formatCurrency(item.price, copCurrencyStrategy)}
      </p>
    </article>
  );
}
