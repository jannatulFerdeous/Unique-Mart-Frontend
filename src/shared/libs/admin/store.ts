import { useSyncExternalStore } from "react";

export type AdminStore<T> = {
  read: () => T;
  write: (next: T) => T;
  update: (change: (current: T) => T) => T;
  use: () => T;
};

export function createStore<T>(seed: () => T): AdminStore<T> {
  let value: { current: T } | null = null;
  const listeners = new Set<() => void>();

  const read = (): T => (value ??= { current: seed() }).current;

  const write = (next: T): T => {
    value = { current: next };
    for (const listener of listeners) listener();
    return next;
  };

  const update = (change: (current: T) => T): T => write(change(read()));

  const subscribe = (onStoreChange: () => void) => {
    listeners.add(onStoreChange);
    return () => {
      listeners.delete(onStoreChange);
    };
  };

  const use = (): T => useSyncExternalStore(subscribe, read, read);

  return { read, write, update, use };
}

export const rng = (seed: number) => {
  let state = seed >>> 0;

  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export const today = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

export const daysAgo = (days: number): string =>
  new Date(today().getTime() - days * 86_400_000).toISOString();

export const localId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`;
