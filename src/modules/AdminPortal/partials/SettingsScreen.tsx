"use client";

import type { ReactNode } from "react";
import { mailHref, site, telHref } from "@/shared/config/site";
import { formatMoney } from "@/shared/libs/admin/format";
import { ButtonLink } from "../components/Button";
import { Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { REFUNDS_HREF } from "../config/orders";
import { blurbFor, navFor } from "./AdminSidebar";

// The backend has nowhere to store settings, so this page shows how the store
// is actually set up, and where each part is changed.

// The backend's SSLCommerz limits per transaction (payment.service.ts).
const PAYMENT_MIN = 10;
const PAYMENT_MAX = 500_000;

// The store-management sections a role can open, by label.
const sectionsFor = (role: string) =>
  navFor(role)
    .flatMap((group) => group.items)
    .filter((item) => item.href.startsWith("/admin"))
    .map((item) => item.label);

export function SettingsScreen() {
  const moderatorSections = sectionsFor("moderator");

  return (
    <>
      <ScreenHeader title="Settings" blurb={blurbFor("/admin/settings")} />

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <Panel title="Store" description="What the website shows in the header, footer and About pages.">
          <Facts>
            <Fact label="Name">{site.name}</Fact>
            <Fact label="Phone">
              <a href={telHref} className="hover:text-tertiary hover:underline">
                {site.phone}
              </a>
            </Fact>
            <Fact label="Email">
              <a href={mailHref} className="break-all hover:text-tertiary hover:underline">
                {site.email}
              </a>
            </Fact>
            <Fact label="Website">{site.url.replace(/^https?:\/\//, "")}</Fact>
          </Facts>
          <WhereToChange>
            <code className="font-mono">src/shared/config/site.ts</code> in the website
          </WhereToChange>
        </Panel>

        <Panel title="Delivery" description="What customers pay to have an order delivered.">
          <Facts>
            <Fact label="Charge">
              <StatusPill label="Free" tone="good" />
            </Fact>
            <Fact label="Applies to">Every order, anywhere in the country</Fact>
          </Facts>
          <p className="mt-4 text-sm text-ink-muted">
            The backend sets delivery to Tk 0 on every order, and the cart and checkout show it as free.
          </p>
          <WhereToChange>
            the order service in the backend (<code className="font-mono">order.service.ts</code>)
          </WhereToChange>
        </Panel>
      </div>

      <Panel
        title="Payments"
        description="How customers pay for their orders."
        actions={
          <ButtonLink href={REFUNDS_HREF} size="sm">
            Refunds
          </ButtonLink>
        }
      >
        <Facts>
          <Fact label="Method">
            <span className="flex flex-wrap items-center gap-2">
              SSLCOMMERZ
              <StatusPill label="Only method" tone="good" />
            </span>
          </Fact>
          <Fact label="Customers can use">Card, mobile banking and internet banking, on SSLCOMMERZ&apos;s secure page</Fact>
          <Fact label="Currency">Taka (BDT)</Fact>
          <Fact label="Order amount">
            {formatMoney(PAYMENT_MIN)} to {formatMoney(PAYMENT_MAX)}
          </Fact>
          <Fact label="Cash on delivery">
            <StatusPill label="Not offered" tone="neutral" />
          </Fact>
        </Facts>
        <p className="mt-4 text-sm text-ink-muted">
          Customers pay straight after placing an order. An order stays pending until it&apos;s paid, and can only be
          confirmed once SSLCOMMERZ has verified the payment. A paid order can&apos;t be cancelled until it&apos;s refunded.
        </p>
        <WhereToChange>
          the backend&apos;s <code className="font-mono">.env</code>: the SSLCOMMERZ store ID, password, and sandbox or live
          mode
        </WhereToChange>
      </Panel>

      <Panel title="Access" description="Who can open what in the dashboard. Everyone who signs in gets their own account pages.">
        <Facts>
          <Fact label="Super admin, Admin">Every section</Fact>
          <Fact label="Moderator">{moderatorSections.join(", ") || "Their own account only"}</Fact>
          <Fact label="Customer">Their own account only</Fact>
        </Facts>
        <p className="mt-4 text-sm text-ink-muted">
          The backend checks the role for orders, payments, refunds, coupons, products, banners, reviews, the newsletter
          and support requests. It doesn&apos;t yet for users, brands, categories and attributes, so for those this list
          only decides what the dashboard shows.
        </p>
        <WhereToChange>
          <code className="font-mono">MODERATOR_SECTIONS</code> in{" "}
          <code className="font-mono">src/modules/AdminPortal/config/access.ts</code>; roles are given in Users
        </WhereToChange>
      </Panel>
    </>
  );
}

function Facts({ children }: { children: ReactNode }) {
  return <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">{children}</dl>;
}

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="text-ink-muted">{label}</dt>
      <dd className="-mt-2 text-ink sm:mt-0">{children}</dd>
    </>
  );
}

function WhereToChange({ children }: { children: ReactNode }) {
  return <p className="mt-4 border-t border-line pt-3 text-xs text-ink-subtle">To change this: {children}</p>;
}
