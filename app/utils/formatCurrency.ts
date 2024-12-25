export type Currency = "USD" | "EUR" | "SLSH";

interface FormatCurrency {
  amount: number;
  currency: Currency | string;
}

export function formatCurrency({ amount, currency }: FormatCurrency) {
  if (currency === "SLSH") {
    return `${amount.toFixed(2)} SLSH`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(date));
}
