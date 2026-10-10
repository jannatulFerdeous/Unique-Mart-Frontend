import { useSyncExternalStore } from "react";

// One short message at a time along the bottom of the shop, for actions that
// happen away from a form: the heart on a card, "Add to basket" on a row.
export type Toast = { id: number; tone: "good" | "danger"; text: string };

const SHOW_FOR = 5000;

let current: Toast | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

const announce = () => {
  for (const listener of listeners) listener();
};

export const dismissToast = () => {
  if (timer) clearTimeout(timer);
  current = null;
  announce();
};

export const toast = (tone: Toast["tone"], text: string) => {
  if (timer) clearTimeout(timer);
  current = { id: Date.now(), tone, text };
  timer = setTimeout(dismissToast, SHOW_FOR);
  announce();
};

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
  };
};

export const useToast = () => useSyncExternalStore(subscribe, () => current, () => null);
