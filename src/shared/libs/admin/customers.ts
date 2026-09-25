/* Customer accounts.
 *
 * Two sources, and the portal keeps them apart on screen rather than pretending
 * they are the same thing:
 *
 *  - Demo accounts, seeded deterministically below, so orders have someone to
 *    belong to and the screens have something to show before launch.
 *  - Whoever is signed in on this browser, read live out of `shared/libs/session`
 *    and merged in as `fromSession`. That row is the only real one, and it is
 *    the seam that proves the portal and the shop are looking at one visitor:
 *    sign in on the storefront, and the account appears here.
 *
 * `session` keeps no user directory — it holds one signed-in visitor in this
 * browser — so there is nothing else real to list yet. */

import { useMemo } from "react";
import { useSession } from "@/shared/libs/session";
import { createStore, daysAgo, rng } from "./store";
import type { Customer } from "./types";

const KEY = "unique-mart.admin.customers.v1";

/* Names and cities are ordinary Bangladeshi ones, to match a storefront that
   prices in taka and groups digits by lakh. Emails are on `example.com`, which
   is reserved by RFC 2606 precisely so sample data cannot reach a real inbox. */
const FIRST = [
  "Rafiq", "Nusrat", "Tanvir", "Sumaiya", "Imran", "Farzana", "Sabbir", "Mehjabin",
  "Arif", "Tasnim", "Rasel", "Jannatul", "Shakib", "Maliha", "Hasib", "Nabila",
  "Omar", "Sadia", "Rakib", "Ishrat", "Fahim", "Lamia", "Zahid", "Rumana",
];

const LAST = [
  "Hossain", "Akter", "Rahman", "Islam", "Chowdhury", "Karim", "Siddique",
  "Bhuiyan", "Mahmud", "Sultana", "Alam", "Haque",
];

const CITIES = [
  "Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Narayanganj",
  "Cumilla", "Gazipur", "Bogura", "Mymensingh",
];

/** How many demo accounts to seed. Enough that the table paginates. */
const COUNT = 46;

const seed = (): Customer[] => {
  const random = rng(731_004);

  return Array.from({ length: COUNT }, (_, index) => {
    const first = FIRST[Math.floor(random() * FIRST.length)];
    const last = LAST[Math.floor(random() * LAST.length)];
    const city = CITIES[Math.floor(random() * CITIES.length)];

    return {
      id: `CU-${2000 + index}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${index}`.toLowerCase() + "@example.com",
      /* Bangladeshi mobile numbers are 01[3-9] plus eight digits. Kept in the
         real shape so the column is the right width and copy-paste testing of a
         phone field behaves like production. */
      phone: `01${3 + Math.floor(random() * 7)}${String(Math.floor(random() * 1e8)).padStart(8, "0")}`,
      city,
      joinedAt: daysAgo(Math.round(random() * 400) + 1),
      blocked: random() < 0.04,
    };
  });
};

const isCustomer = (value: unknown): value is Customer => {
  if (typeof value !== "object" || value === null) return false;
  const each = value as Record<string, unknown>;
  return (
    typeof each.id === "string" &&
    each.id.length > 0 &&
    typeof each.name === "string" &&
    typeof each.email === "string"
  );
};

const revive = (value: unknown): Customer[] | null => {
  if (!Array.isArray(value)) return null;
  const rows = value.filter(isCustomer);
  return rows.length ? rows : null;
};

export const customers = createStore(KEY, seed, revive);

/** The id the signed-in visitor is filed under. Fixed, so their orders and
 *  basket keep pointing at them across reloads and sign-outs. */
export const SESSION_CUSTOMER_ID = "CU-session";

/** Demo accounts plus whoever is signed in on this browser, that one first.
 *
 *  A hook rather than a plain read because the session can change under it —
 *  sign out in another tab and this list has to lose the row. */
export const useCustomers = (): Customer[] => {
  const rows = customers.use();
  const { user } = useSession();

  return useMemo(() => {
    if (!user) return rows;

    /* An earlier sign-in may already be stored — blocked state and any edits
       made here belong to the row, not to the session, so they are kept. */
    const held = rows.find((customer) => customer.id === SESSION_CUSTOMER_ID);

    const live: Customer = {
      id: SESSION_CUSTOMER_ID,
      name: user.name,
      email: user.email ?? held?.email ?? "",
      phone: user.phone ?? held?.phone ?? "",
      city: held?.city ?? "",
      joinedAt: held?.joinedAt ?? new Date().toISOString(),
      blocked: held?.blocked ?? false,
      fromSession: true,
    };

    return [live, ...rows.filter((customer) => customer.id !== SESSION_CUSTOMER_ID)];
  }, [rows, user]);
};

/** Looks an account up without the session merged in. Used by tables that
 *  already have the merged list and only need a name for an order row. */
export const nameOf = (rows: Customer[], id: string | null): string =>
  (id && rows.find((customer) => customer.id === id)?.name) || "Guest";

export const setBlocked = (id: string, blocked: boolean) => {
  customers.update((current) => {
    const held = current.some((customer) => customer.id === id);

    /* The signed-in visitor has no stored row until something is changed about
       them, so blocking them has to create one. */
    if (!held && id === SESSION_CUSTOMER_ID) {
      return [
        ...current,
        {
          id,
          name: "Signed-in visitor",
          email: "",
          phone: "",
          city: "",
          joinedAt: new Date().toISOString(),
          blocked,
          fromSession: true,
        },
      ];
    }

    return current.map((customer) =>
      customer.id === id ? { ...customer, blocked } : customer,
    );
  });
};

export const deleteCustomer = (id: string) => {
  customers.update((current) => current.filter((customer) => customer.id !== id));
};

export const resetCustomers = () => customers.reset();
