import Link from "next/link";
import type { Product } from "@/shared/config/catalog";
import { productHref } from "@/shared/config/products";
import { formatPrice } from "@/shared/utils/price";
import { category_data } from "../config/constants";

export function CategoryPriceTable({
  name,
  products,
}: {
  name: string;
  products: Product[];
}) {
  if (products.length < 2) return null;
  const { priceTable } = category_data;

  return (
    <section aria-labelledby="price-list" className="pb-16">
      <div className="container-page">
        <h2 id="price-list" className="font-sans font-bold text-ink">
          {priceTable.headingTemplate.replace("{name}", name)}
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line-strong">
                <th scope="col" className="py-3 pr-4 font-bold text-ink">
                  {priceTable.product}
                </th>
                <th scope="col" className="py-3 pl-4 text-right font-bold text-ink">
                  {priceTable.price}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.slug} className="border-b border-line">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    <Link
                      href={productHref(product.slug)}
                      className="text-ink-muted transition-colors hover:text-tertiary"
                    >
                      {product.name}
                    </Link>
                  </th>
                  <td className="py-3 pl-4 text-right text-ink tabular-nums">
                    {formatPrice(product.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-sm text-ink-subtle">{priceTable.note}</p>
      </div>
    </section>
  );
}
