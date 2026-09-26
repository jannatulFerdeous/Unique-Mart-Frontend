export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .replace(/[^\p{L}\p{N}]/gu, "")
    .toUpperCase();
