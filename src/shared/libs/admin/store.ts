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
