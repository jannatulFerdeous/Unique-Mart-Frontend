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

export const formatDayShort = (iso: string): string => DAY_SHORT.format(new Date(iso));

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

const compact = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const formatMoneyCompact = (amount: number): string => {
  const sign = amount < 0 ? "-" : "";
  const value = Math.abs(amount);

  if (value >= 10_000_000) return `${sign}Tk ${compact.format(value / 10_000_000)} Cr`;
  if (value >= 100_000) return `${sign}Tk ${compact.format(value / 100_000)} L`;
  return `${sign}Tk ${plain.format(value)}`;
};

export const formatMoney = (amount: number): string =>
  `${amount < 0 ? "-" : ""}Tk ${plain.format(Math.abs(amount))}`;

export const formatCount = (value: number): string => plain.format(value);

export const formatDelta = (percent: number | null): string => {
  if (percent === null) return "—";
  const rounded = Math.abs(percent) < 0.05 ? 0 : percent;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${compact.format(Math.abs(rounded))}%`;
};

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
