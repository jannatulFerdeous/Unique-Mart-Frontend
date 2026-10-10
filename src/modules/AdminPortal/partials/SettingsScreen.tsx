"use client";

import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { METHOD_LABELS, saveSettings, toggleMethod, useSettings } from "@/shared/libs/admin/settings";
import { formatMoney } from "@/shared/libs/admin/format";
import { MODERATOR_SECTIONS } from "../config/access";
import { admin_data } from "../config/constants";
import { Button } from "../components/Button";
import { Field, Input } from "../components/Field";
import { Panel, ScreenHeader } from "../components/Panel";

export function SettingsScreen() {
  const { common } = admin_data;
  const settings = useSettings();

  const [form, setForm] = useState(() => ({
    storeName: settings.storeName,
    supportPhone: settings.supportPhone,
    supportEmail: settings.supportEmail,
    freeShippingFrom: String(settings.freeShippingFrom),
    shippingFlat: String(settings.shippingFlat),
    defaultReorderAt: String(settings.defaultReorderAt),
  }));
  const [saved, setSaved] = useState(false);

  const set = <K extends keyof typeof form>(key: K, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const number = (value: string, fallback: number) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed) : fallback;
  };

  return (
    <>
      <ScreenHeader
        title="Settings"
        blurb="Delivery charges, payment methods and contact details."
      />

      <p className="flex gap-2.5 rounded-card border border-line bg-surface px-4 py-3 text-sm text-ink-muted">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
        <span>
          These are the settings a real checkout would read. Nothing on the shop reads them today —
          the delivery charge and the contact details there come from the shipped config. The
          reorder point below does take effect, on every product added from now on.
        </span>
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Store">
          <div className="flex flex-col gap-4">
            <Field label="Store name">
              <Input
                value={form.storeName}
                onChange={(event) => set("storeName", event.target.value)}
                maxLength={60}
              />
            </Field>
            <Field label="Support phone">
              <Input
                value={form.supportPhone}
                onChange={(event) => set("supportPhone", event.target.value)}
                maxLength={30}
              />
            </Field>
            <Field label="Support email">
              <Input
                type="email"
                value={form.supportEmail}
                onChange={(event) => set("supportEmail", event.target.value)}
                maxLength={254}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Delivery and stock">
          <div className="flex flex-col gap-4">
            <Field
              label="Delivery charge (Tk)"
              hint="Charged on every order below the free-delivery threshold."
            >
              <Input
                value={form.shippingFlat}
                onChange={(event) => set("shippingFlat", event.target.value)}
                inputMode="numeric"
              />
            </Field>

            <Field
              label="Free delivery from (Tk)"
              hint={`At or above ${formatMoney(number(form.freeShippingFrom, settings.freeShippingFrom))}, delivery is free.`}
            >
              <Input
                value={form.freeShippingFrom}
                onChange={(event) => set("freeShippingFrom", event.target.value)}
                inputMode="numeric"
              />
            </Field>

            <Field
              label="Default reorder point"
              hint="What a newly added product starts with. Existing products keep their own."
            >
              <Input
                value={form.defaultReorderAt}
                onChange={(event) => set("defaultReorderAt", event.target.value)}
                inputMode="numeric"
              />
            </Field>
          </div>
        </Panel>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          onClick={() => {
            saveSettings({
              storeName: form.storeName.trim() || settings.storeName,
              supportPhone: form.supportPhone.trim(),
              supportEmail: form.supportEmail.trim(),
              freeShippingFrom: number(form.freeShippingFrom, settings.freeShippingFrom),
              shippingFlat: number(form.shippingFlat, settings.shippingFlat),
              defaultReorderAt: number(form.defaultReorderAt, settings.defaultReorderAt),
            });
            setSaved(true);
          }}
        >
          {common.save}
        </Button>
        {saved && (
          <span role="status" className="text-sm font-medium text-good">
            {common.saved}
          </span>
        )}
      </div>

      <Panel
        title="Payment methods"
        description="Which methods checkout offers, in the order it offers them."
      >
        <ul className="flex flex-col divide-y divide-line">
          {settings.methods.map((method) => (
            <li key={method.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-ink">{METHOD_LABELS[method.id]}</p>
                <p className="text-xs text-ink-subtle">
                  {method.enabled ? "Offered at checkout" : "Hidden from checkout"}
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <span className="sr-only">Offer {METHOD_LABELS[method.id]} at checkout</span>
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={(event) => toggleMethod(method.id, event.target.checked)}
                  className="size-4 accent-tertiary"
                />
              </label>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel
        title="Access"
        description="Who sees what in the dashboard. Everyone who signs in gets their own account pages."
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">
          <dt className="font-medium text-ink">Super admin, Admin</dt>
          <dd className="text-ink-muted">Every section.</dd>
          <dt className="font-medium text-ink">Moderator</dt>
          <dd className="text-ink-muted">
            {admin_data.nav
              .flatMap((group) => group.items)
              .filter((item) => MODERATOR_SECTIONS.includes(item.href))
              .map((item) => item.label)
              .join(", ") || "Their own account only."}
          </dd>
          <dt className="font-medium text-ink">Customer</dt>
          <dd className="text-ink-muted">Their own account only.</dd>
        </dl>
        <p className="mt-4 text-xs text-ink-subtle">
          Moderator sections are set in <code className="font-mono">modules/AdminPortal/config/access.ts</code> until the
          backend can store permissions. The backend doesn&apos;t check who is calling yet, so this decides what the
          dashboard shows, not what the API allows.
        </p>
      </Panel>
    </>
  );
}
