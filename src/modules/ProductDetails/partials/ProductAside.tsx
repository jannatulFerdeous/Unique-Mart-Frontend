import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/shared/config/catalog";
import { productHref } from "@/shared/config/products";
import { trustClaims } from "@/shared/config/trust";
import { formatPrice } from "@/shared/utils/price";
import { product_details_data } from "../config/constants";

type Props = { similar: Product[] };

export function ProductAside({ similar }: Props) {
  const { labels } = product_details_data;

  return (
    <aside className="mt-12 lg:mt-0">
      <section aria-labelledby="product-trust" className="bg-surface p-5">
        <h2 id="product-trust" className="font-sans font-bold text-ink">
          {labels.trust}
        </h2>

        <ul className="mt-4 space-y-3">
          {trustClaims.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <Icon
                strokeWidth={1.5}
                aria-hidden
                className="size-5 shrink-0 text-tertiary"
              />
              <span className="text-sm font-medium text-ink">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {similar.length > 0 && (
        <section aria-labelledby="product-similar" className="mt-10">
          <h2 id="product-similar" className="font-sans font-bold text-ink">
            {labels.similar}
          </h2>

          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {similar.map((product) => (
              <li key={product.slug}>
                <Link
                  href={productHref(product.slug)}
                  className="flex items-center gap-3 bg-surface p-3 transition-shadow hover:shadow-card"
                >
                  <Image
                    src={product.image}
                    alt=""
                    sizes="80px"
                    className="size-20 shrink-0 object-contain"
                  />

                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold text-ink">
                      {product.name}
                    </p>

                    <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
                      <span className="text-sm font-bold text-tertiary">
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAt ? (
                        <s className="text-xs text-ink-subtle">
                          {formatPrice(product.compareAt)}
                        </s>
                      ) : null}
                    </p>

                    {product.rating ? (
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                        <span className="flex" aria-hidden>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className="size-3 fill-ink stroke-none data-dim:fill-line-strong"
                              data-dim={
                                i < Math.round(product.rating!) ? undefined : ""
                              }
                            />
                          ))}
                        </span>
                        ({product.rating.toFixed(1)})
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
