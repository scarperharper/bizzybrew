export const currency = (amount: number): string => {
  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount / 100);

  return formatted;
};
