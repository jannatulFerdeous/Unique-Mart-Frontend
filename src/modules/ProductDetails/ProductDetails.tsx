import type { Product, ProductDetail } from "@/shared/config/catalog";
import { ProductAside } from "./partials/ProductAside";
import { ProductBreadcrumb, type Crumb } from "./partials/ProductBreadcrumb";
import { ProductTabs } from "./partials/ProductTabs";
import { ProductTop } from "./partials/ProductTop";

type Props = {
  product: Product;
  detail?: ProductDetail;
  similar: Product[];
  trail: Crumb[];
};

export function ProductDetails({ product, detail, similar, trail }: Props) {
  return (
    <>
      <ProductBreadcrumb trail={trail} />

      <section className="pt-6 pb-16">
        <div className="container-page lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-10">
          <div className="min-w-0">
            <ProductTop product={product} detail={detail} />
            <ProductTabs slug={product.slug} detail={detail} />
          </div>

          <ProductAside similar={similar} />
        </div>
      </section>
    </>
  );
}
