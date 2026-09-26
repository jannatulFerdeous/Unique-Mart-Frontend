import Link from "next/link";
import Image from "next/image";
import { ProductRail } from "@/common/components/ProductRail";
import { SectionHeader } from "@/common/components/SectionHeader";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { newArrivalProducts } from "@/shared/config/products";
import { formatDate } from "@/shared/libs/admin/format";
import { blogs_data } from "./config/constants";

export function Blogs() {
  const data = blogs_data;
  const posts = data.posts;

  return (
    <>
      <ProductBreadcrumb trail={[{ label: "Home", href: "/" }, { label: data.title }]} />

      <div className="container-page py-8">
        <header>
          <h1 className="font-sans font-bold text-ink">{data.heading}</h1>
          <p className="mt-3 text-ink-muted">{data.intro}</p>
        </header>

        <section aria-labelledby="posts" className="mt-10">
          <h2 id="posts" className="sr-only">
            {data.recentTitle}
          </h2>

          {posts.length === 0 ? (
            <div className="rounded-card border border-line bg-surface px-6 py-16 text-center">
              <p className="font-sans font-bold text-ink">{data.emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-lg text-ink-muted">{data.emptyBody}</p>
              <Link
                href="/offers"
                className="mt-5 inline-block rounded-control bg-tertiary px-6 py-3 font-bold text-tertiary-contrast transition-colors hover:bg-tertiary-hover"
              >
                {data.emptyAction}
              </Link>
            </div>
          ) : (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li
                  key={post.slug}
                  className="overflow-hidden rounded-card border border-line bg-surface"
                >
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                  ) : null}
                  <div className="p-5">
                    <p className="text-xs text-ink-subtle">
                      {post.category} · {formatDate(post.published)}
                    </p>
                    <h3 className="mt-2 font-sans font-bold text-ink">{post.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm text-ink-muted">{post.excerpt}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section aria-labelledby="trending" className="pb-16">
        <div className="container-page">
          <SectionHeader
            id="trending"
            title={data.trendingTitle}
            href="/offers"
            align="left"
          />
          <div className="mt-6">
            <ProductRail products={newArrivalProducts} label={data.trendingTitle} />
          </div>
        </div>
      </section>
    </>
  );
}
