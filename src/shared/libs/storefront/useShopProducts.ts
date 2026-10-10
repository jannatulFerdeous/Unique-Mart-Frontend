"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/shared/config/catalog";

// A card plus whether buying it needs options picked on the product page.
export type ShopProduct = Product & { hasOptions: boolean };

// Live product cards for slugs kept in the browser. `null` while loading;
// slugs missing from the result are no longer sold.
export function useShopProducts(slugs: string[]): Map<string, ShopProduct> | null {
  const key = [...slugs].sort().join(",");
  const [result, setResult] = useState<{ key: string; items: Map<string, ShopProduct> } | null>(null);

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetch(`/api/storefront/products?slugs=${encodeURIComponent(key)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : { items: [] }))
      .then(({ items }: { items: ShopProduct[] }) =>
        setResult({ key, items: new Map(items.map((item) => [item.slug, item])) }),
      )
      .catch(() => {
        if (!controller.signal.aborted) setResult({ key, items: new Map() });
      });
    return () => controller.abort();
  }, [key]);

  if (!key) return new Map();
  return result?.key === key ? result.items : null;
}
