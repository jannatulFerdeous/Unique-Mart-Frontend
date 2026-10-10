import { Clock, Mail, MapPin, Phone, Truck } from "lucide-react";
import { ProductBreadcrumb } from "@/modules/ProductDetails";
import { site, mailHref, telHref } from "@/shared/config/site";
import { stores_data } from "./config/constants";

export function Stores() {
  const data = stores_data;
  const branches = data.stores;

  return (
    <>
      <ProductBreadcrumb trail={[{ label: "Home", href: "/" }, { label: data.title }]} />

      <div className="container-page py-8">
        <header>
          <h1 className="font-sans font-bold text-ink">{data.heading}</h1>
          <p className="mt-3 text-ink-muted">{data.intro}</p>
        </header>

        {branches.length === 0 ? (
          <section
            aria-labelledby="online"
            className="mt-8 rounded-card border border-line bg-surface p-6 md:p-8"
          >
            <span className="grid size-11 place-items-center rounded-control bg-tertiary-soft text-tertiary">
              <Truck className="size-5" aria-hidden />
            </span>
            <h2 id="online" className="mt-4 font-sans font-bold text-ink">
              {data.onlineTitle}
            </h2>
            <p className="mt-2 text-ink-muted">{data.onlineBody}</p>

            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {data.delivery.map((item) => (
                <li key={item.title} className="rounded-control border border-line p-4">
                  <h3 className="font-sans text-sm font-bold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((store) => (
              <li key={store.name} className="rounded-card border border-line bg-surface p-5">
                <h2 className="font-sans font-bold text-ink">{store.name}</h2>
                <address className="mt-2 flex gap-2 text-sm text-ink-muted not-italic">
                  <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {store.address}
                </address>
                <p className="mt-2 flex items-center gap-2 text-sm text-ink-muted">
                  <Clock className="size-4 shrink-0" aria-hidden />
                  {store.hours}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm">
                  <Phone className="size-4 shrink-0 text-ink-muted" aria-hidden />
                  <a href={`tel:${store.phone}`} className="text-tertiary hover:underline">
                    {store.phone}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        )}

        <section aria-labelledby="reach" className="mt-12">
          <h2 id="reach" className="font-sans font-bold text-ink">
            {data.reachTitle}
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <a
              href={telHref}
              className="flex items-center gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-control bg-tertiary-soft text-tertiary">
                <Phone className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block font-sans font-bold text-ink">{site.phone}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{data.phoneHours}</span>
              </span>
            </a>

            <a
              href={mailHref}
              className="flex items-center gap-4 rounded-card border border-line bg-surface p-5 transition-colors hover:border-line-strong"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-control bg-tertiary-soft text-tertiary">
                <Mail className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-sans font-bold text-ink">{site.email}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{data.emailNote}</span>
              </span>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
