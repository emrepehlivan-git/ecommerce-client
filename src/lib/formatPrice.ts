export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "TRY";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "TRY", notation = "standard" } = options;
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice);
}
