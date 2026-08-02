export type CurrencyFormatStrategy = {
  format(amount: number): string;
};

export function formatCurrency(
  amount: number,
  strategy: CurrencyFormatStrategy,
): string {
  return strategy.format(amount);
}

export type IntlCurrencyStrategyOptions = {
  locale: string;
  currency: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
};

export function createIntlCurrencyStrategy({
  locale,
  currency,
  minimumFractionDigits = 0,
  maximumFractionDigits = minimumFractionDigits,
}: IntlCurrencyStrategyOptions): CurrencyFormatStrategy {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return { format: (amount) => formatter.format(amount) };
}

const copNumberFormatter = new Intl.NumberFormat("es-CO", {
  maximumFractionDigits: 0,
});

export const copCurrencyStrategy: CurrencyFormatStrategy = {
  format: (amount) => `$${copNumberFormatter.format(amount)}`,
};
