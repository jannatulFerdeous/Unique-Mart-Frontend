"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useGetCategoriesQuery, useGetMainCategoriesQuery } from "@/redux/features/catalog/catalogApi";
import { useGetCouponQuery, useSaveCouponMutation } from "@/redux/features/coupon/couponApi";
import {
  COUPON_LIMITS,
  idsOf,
  type Coupon,
  type CouponFields,
  type CouponStatus,
  type DiscountType,
} from "@/redux/features/coupon/coupon.types";
import { clearNotice, showNotice } from "@/redux/features/notice/noticeSlice";
import { useGetProductsQuery } from "@/redux/features/product/productApi";
import { useAppDispatch } from "@/redux/hooks";
import { Button, ButtonLink } from "../components/Button";
import { ChoiceChips } from "../components/ChoiceChips";
import { Field, Input, Select, Textarea } from "../components/Field";
import { SearchBox } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { COUPONS_BLURB, COUPONS_HREF, endOfDay, startOfDay, toDayInput } from "../config/coupons";

// Enough to list every product in one go for a store this size.
const PRODUCT_LIMIT = 500;
// Chips shown for a product search before asking for a narrower one.
const PRODUCT_MATCHES = 40;

// `id` given → edit that coupon; no `id` → add a new one.
export function CouponFormScreen({ id }: { id?: string }) {
  const dispatch = useAppDispatch();
  const editing = id !== undefined;
  const { data: coupon, isLoading, isError, error, refetch } = useGetCouponQuery(id ?? "", { skip: !editing });

  // Opening a form starts a fresh visit; drop any old list message.
  useEffect(() => {
    dispatch(clearNotice());
  }, [dispatch]);

  return (
    <>
      <ScreenHeader
        title={editing ? "Edit coupon" : "Add coupon"}
        blurb={COUPONS_BLURB}
        actions={
          <ButtonLink href={COUPONS_HREF}>
            <ArrowLeft className="size-4" aria-hidden />
            All coupons
          </ButtonLink>
        }
      />

      {editing && isLoading ? (
        <Panel>
          <EmptyState title="Loading…" />
        </Panel>
      ) : editing && (isError || !coupon) ? (
        <Panel>
          <EmptyState
            title="Couldn't load this coupon"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : (
        <CouponForm key={coupon?._id ?? "new"} coupon={editing ? coupon : undefined} />
      )}
    </>
  );
}

type Draft = {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  minimumOrderAmount: string;
  maximumDiscountAmount: string;
  usageLimit: string;
  perUserLimit: string;
  startDate: string;
  endDate: string;
  status: CouponStatus;
  applicableMainCategories: string[];
  applicableCategories: string[];
  applicableProducts: string[];
};

type Errors = Partial<Record<keyof Draft | "submit", string>>;

const blankable = (value: number | null | undefined) => (value === null || value === undefined ? "" : String(value));

const toDraft = (coupon?: Coupon): Draft => {
  const today = toDayInput(new Date().toISOString());
  return {
    code: coupon?.code ?? "",
    description: coupon?.description ?? "",
    discountType: coupon?.discountType ?? "percentage",
    discountValue: blankable(coupon?.discountValue),
    minimumOrderAmount: blankable(coupon?.minimumOrderAmount ?? 0),
    maximumDiscountAmount: blankable(coupon?.maximumDiscountAmount),
    usageLimit: blankable(coupon?.usageLimit),
    perUserLimit: blankable(coupon?.perUserLimit),
    startDate: coupon ? toDayInput(coupon.startDate) : today,
    endDate: coupon ? toDayInput(coupon.endDate) : "",
    status: coupon?.status ?? "active",
    applicableMainCategories: idsOf(coupon?.applicableMainCategories ?? []),
    applicableCategories: idsOf(coupon?.applicableCategories ?? []),
    applicableProducts: idsOf(coupon?.applicableProducts ?? []),
  };
};

// Mirrors `createCouponValidationSchema` and the service's extra checks.
const check = (draft: Draft, usedCount: number): { errors: Errors; fields?: CouponFields } => {
  const errors: Errors = {};
  const number = (raw: string) => (raw.trim() === "" ? null : Number(raw));
  const code = draft.code.trim();
  const discountValue = number(draft.discountValue);
  const minimumOrderAmount = number(draft.minimumOrderAmount) ?? 0;
  const maximumDiscountAmount = draft.discountType === "percentage" ? number(draft.maximumDiscountAmount) : null;
  const usageLimit = number(draft.usageLimit);
  const perUserLimit = number(draft.perUserLimit);

  if (code.length < COUPON_LIMITS.code.min || code.length > COUPON_LIMITS.code.max)
    errors.code = `Use ${COUPON_LIMITS.code.min} to ${COUPON_LIMITS.code.max} characters.`;
  if (draft.description.trim().length > COUPON_LIMITS.description)
    errors.description = `Keep it under ${COUPON_LIMITS.description} characters.`;

  if (discountValue === null || !(discountValue > 0)) errors.discountValue = "Enter an amount above 0.";
  else if (draft.discountType === "percentage" && discountValue > 100) errors.discountValue = "A percentage can't be over 100.";
  else if (draft.discountType === "fixed" && discountValue > minimumOrderAmount)
    errors.discountValue = "A fixed discount can't be more than the minimum order amount.";

  if (!(minimumOrderAmount >= 0)) errors.minimumOrderAmount = "Enter 0 or more.";
  if (maximumDiscountAmount !== null && !(maximumDiscountAmount > 0)) errors.maximumDiscountAmount = "Enter an amount above 0, or leave it empty.";

  const whole = (value: number | null) => value === null || (Number.isInteger(value) && value > 0);
  if (!whole(usageLimit)) errors.usageLimit = "Enter a whole number above 0, or leave it empty.";
  else if (usageLimit !== null && usageLimit < usedCount) errors.usageLimit = `It's been used ${usedCount} times already.`;
  if (!whole(perUserLimit)) errors.perUserLimit = "Enter a whole number above 0, or leave it empty.";

  if (!draft.startDate) errors.startDate = "Pick a start date.";
  if (!draft.endDate) errors.endDate = "Pick an end date.";
  else if (draft.startDate && endOfDay(draft.endDate) <= startOfDay(draft.startDate)) errors.endDate = "End after the start date.";

  if (Object.keys(errors).length) return { errors };
  return {
    errors,
    fields: {
      code,
      description: draft.description.trim() || null,
      discountType: draft.discountType,
      discountValue: discountValue!,
      minimumOrderAmount,
      maximumDiscountAmount,
      usageLimit,
      perUserLimit,
      startDate: startOfDay(draft.startDate),
      endDate: endOfDay(draft.endDate),
      status: draft.status,
      applicableMainCategories: draft.applicableMainCategories,
      applicableCategories: draft.applicableCategories,
      applicableProducts: draft.applicableProducts,
    },
  };
};

function CouponForm({ coupon }: { coupon?: Coupon }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [save, { isLoading: saving }] = useSaveCouponMutation();
  const mainCategories = useGetMainCategoriesQuery({ status: "active" });
  const categories = useGetCategoriesQuery({ status: "active" });
  const products = useGetProductsQuery({ page: 1, limit: PRODUCT_LIMIT });
  const [draft, setDraft] = useState<Draft>(() => toDraft(coupon));
  const [errors, setErrors] = useState<Errors>({});
  const [productSearch, setProductSearch] = useState("");

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const { errors: found, fields } = check(draft, coupon?.usedCount ?? 0);
    setErrors(found);
    if (!fields) return;

    try {
      await save({ id: coupon?._id, fields }).unwrap();
      dispatch(
        showNotice({ scope: "coupons", tone: "good", text: `${fields.code.toUpperCase()} ${coupon ? "saved" : "added"}.` }),
      );
      router.push(COUPONS_HREF);
    } catch (problem) {
      setErrors({ submit: apiErrorMessage(problem) });
    }
  };

  // Matching products, with the ticked ones always in view.
  const term = productSearch.trim().toLowerCase();
  const allProducts = products.data?.items ?? [];
  const productOptions = allProducts
    .filter((product) => draft.applicableProducts.includes(product._id) || (term && product.name.toLowerCase().includes(term)))
    .slice(0, PRODUCT_MATCHES + draft.applicableProducts.length)
    .map((product) => ({ value: product._id, label: product.name }));

  const text = (key: "discountValue" | "minimumOrderAmount" | "maximumDiscountAmount" | "usageLimit" | "perUserLimit") => ({
    type: "number",
    inputMode: "decimal" as const,
    min: 0,
    value: draft[key],
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => set(key, event.target.value),
  });

  return (
    <form onSubmit={submit} noValidate className="flex max-w-4xl flex-col gap-5">
      <fieldset disabled={saving} className="flex min-w-0 flex-col gap-5">
        <Panel title="Code">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Code" hint="Shoppers type this. Saved in capitals." error={errors.code}>
              <Input
                value={draft.code}
                onChange={(event) => set("code", event.target.value.toUpperCase())}
                maxLength={COUPON_LIMITS.code.max}
                className="font-mono uppercase"
              />
            </Field>
            <Field label="Status">
              <Select value={draft.status} onChange={(event) => set("status", event.target.value as CouponStatus)}>
                <option value="active">On</option>
                <option value="inactive">Off</option>
              </Select>
            </Field>
            <Field label="Description (optional)" error={errors.description} className="sm:col-span-2">
              <Textarea
                value={draft.description}
                onChange={(event) => set("description", event.target.value)}
                maxLength={COUPON_LIMITS.description}
                className="min-h-20"
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Discount">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type">
              <Select value={draft.discountType} onChange={(event) => set("discountType", event.target.value as DiscountType)}>
                <option value="percentage">Percentage off</option>
                <option value="fixed">Fixed amount off</option>
              </Select>
            </Field>
            <Field label={draft.discountType === "percentage" ? "Percent off" : "Amount off (Tk)"} error={errors.discountValue}>
              <Input {...text("discountValue")} max={draft.discountType === "percentage" ? 100 : undefined} />
            </Field>
            <Field
              label="Minimum order (Tk)"
              hint={draft.discountType === "fixed" ? "Must be at least the amount off." : "0 for any order."}
              error={errors.minimumOrderAmount}
            >
              <Input {...text("minimumOrderAmount")} />
            </Field>
            {draft.discountType === "percentage" && (
              <Field label="Most it can take off (Tk, optional)" error={errors.maximumDiscountAmount}>
                <Input {...text("maximumDiscountAmount")} />
              </Field>
            )}
          </div>
        </Panel>

        <Panel title="When and how often">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Starts" error={errors.startDate}>
              <Input type="date" value={draft.startDate} onChange={(event) => set("startDate", event.target.value)} />
            </Field>
            <Field label="Ends" hint="Runs to the end of this day." error={errors.endDate}>
              <Input type="date" value={draft.endDate} onChange={(event) => set("endDate", event.target.value)} />
            </Field>
            <Field label="Total uses (optional)" hint={coupon ? `Used ${coupon.usedCount} times so far.` : "Empty for no limit."} error={errors.usageLimit}>
              <Input {...text("usageLimit")} min={1} step={1} inputMode="numeric" />
            </Field>
            <Field label="Uses per customer (optional)" hint="Empty for no limit." error={errors.perUserLimit}>
              <Input {...text("perUserLimit")} min={1} step={1} inputMode="numeric" />
            </Field>
          </div>
        </Panel>

        <Panel title="Applies to" description="Leave all three empty for the whole shop.">
          <div className="flex flex-col gap-5">
            <ChoiceChips
              legend="Main categories"
              options={(mainCategories.data?.items ?? []).map((each) => ({ value: each._id, label: each.name }))}
              value={draft.applicableMainCategories}
              onChange={(next) => set("applicableMainCategories", next)}
              empty={mainCategories.isLoading ? "Loading…" : "No main categories yet."}
            />
            <ChoiceChips
              legend="Categories"
              options={(categories.data?.items ?? []).map((each) => ({ value: each._id, label: each.name }))}
              value={draft.applicableCategories}
              onChange={(next) => set("applicableCategories", next)}
              empty={categories.isLoading ? "Loading…" : "No categories yet."}
            />
            <div className="flex flex-col gap-2">
              <SearchBox value={productSearch} onChange={setProductSearch} label="Find products to add" className="sm:w-96" />
              <ChoiceChips
                legend={`Products (${draft.applicableProducts.length} picked)`}
                options={productOptions}
                value={draft.applicableProducts}
                onChange={(next) => set("applicableProducts", next)}
                empty={products.isLoading ? "Loading…" : term ? "No products match." : "Search above to pick products."}
              />
            </div>
          </div>
        </Panel>
      </fieldset>

      {errors.submit && (
        <p role="alert" className="text-sm font-medium text-danger">
          {errors.submit}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <ButtonLink href={COUPONS_HREF}>Cancel</ButtonLink>
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : coupon ? "Save coupon" : "Add coupon"}
        </Button>
      </div>
    </form>
  );
}
