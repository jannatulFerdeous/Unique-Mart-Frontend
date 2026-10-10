const taka = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number) {
  return `Tk. ${taka.format(amount)}`;
}
