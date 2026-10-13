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

export const formatDate = (iso: string): string => DATE.format(new Date(iso));

export const formatDateTime = (iso: string): string => DATE_TIME.format(new Date(iso));

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

export const formatMoney = (amount: number): string =>
  `${amount < 0 ? "-" : ""}Tk ${plain.format(Math.abs(amount))}`;

const exact = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// To the paisa, for refunds and payments where partial amounts matter.
export const formatMoneyExact = (amount: number): string =>
  `${amount < 0 ? "-" : ""}Tk ${exact.format(Math.abs(amount))}`;

export const formatCount =(value: number): string => plain.format(value);

export const formatDelta = (percent: number | null): string => {
  if (percent === null) return "—";
  const rounded = Math.abs(percent) < 0.05 ? 0 : percent;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  return `${sign}${compact.format(Math.abs(rounded))}%`;
};
