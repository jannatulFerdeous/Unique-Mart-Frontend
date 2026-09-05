// Bangladesh groups by lakh — 204999 reads "2,04,999", not "204,999".
const taka = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatPrice(amount: number) {
  return `Tk. ${taka.format(amount)}`;
}
