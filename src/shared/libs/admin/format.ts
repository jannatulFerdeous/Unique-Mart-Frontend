/* Display helpers shared by every admin screen.
 *
 * Kept out of `shared/utils/price`, which the storefront uses: these formats are
 * for dense tables read by one person all day, not for a product page. Compact
 * money ("Tk 1.2L") belongs on a stat tile and nowhere a customer can see it. */

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const DATE_TIME = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const DAY_SHORT = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

export const formatDate = (iso: string): string => DATE.format(new Date(iso));

export const formatDateTime = (iso: string): string => DATE_TIME.format(new Date(iso));

/** "12 Sep" — for axis ticks, where the year is the same on every one. */
export const formatDayShort = (iso: string): string => DAY_SHORT.format(new Date(iso));

/** "3 days ago". Rounded down and capped at the date, because past a few weeks
 *  "37 days ago" is harder to place than the date itself. */
export const formatAgo = (iso: string): string => {
  const then = new Date(iso).getTime();
  const seconds = Math.max(0, (Date.now() - then) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 21) return `${days} ${days === 1 ? "day" : "days"} ago`;
  return formatDate(iso);
};

/* Bangladesh groups by lakh and crore, and a shopkeeper reads "1.2 lakh"
   faster than "120,000" — but only on a stat tile, where the exact figure is a
   hover away in the chart or the table below it. Columns always get the full
   number, so they add up on screen. */
const compact = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** "Tk 2.05 Cr" / "Tk 1.2 L" / "Tk 8,400". Headline figures only. */
export const formatMoneyCompact = (amount: number): string => {
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount);

  if (value >= 10_000_000) return `${sign}Tk ${compact.format(value / 10_000_000)} Cr`;
  if (value >= 100_000) return `${sign}Tk ${compact.format(value / 100_000)} L`;
  return `${sign}Tk ${plain.format(value)}`;
};

/** "Tk 2,04,999". Every column of money, so the digits line up and total. */
export const formatMoney = (amount: number): string =>
  `${amount < 0 ? "-" : ""}Tk ${plain.format(Math.abs(amount))}`;

export const formatCount = (value: number): string => plain.format(value);

/** "+12.4%" / "−3.0%" / "—" when there is no baseline. A true minus sign, not
 *  a hyphen: at small sizes a hyphen reads as a dash in the label beside it. */
export const formatDelta = (percent: number | null): string => {
  if (percent === null) return "—";
  const rounded = Math.abs(percent) < 0.05 ? 0 : percent;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${compact.format(Math.abs(rounded))}%`;
};

/** An axis a reader can hold in their head: a round step, and a ceiling that is
 *  a whole number of them.
 *
 *  Rounding only the top of the axis is the common mistake and it does not work:
 *  a ceiling of 15 lakh over four bands gives gridlines at 3.75 and 11.25 lakh,
 *  which are round numbers of nothing. The step is chosen first, from the same
 *  ladder a person would use, and the ceiling falls out of it. */
export const niceScale = (value: number, bands: number): { max: number; step: number } => {
  if (!(value > 0) || bands < 1) return { max: 1, step: 1 / bands };

  const rough = value / bands;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const ladder = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 7.5, 8, 10];

  for (const rung of ladder) {
    const step = rung * magnitude;
    if (step * bands >= value) return { max: step * bands, step };
  }

  const step = 10 * magnitude;
  return { max: step * bands, step };
};
