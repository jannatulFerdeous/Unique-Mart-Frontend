"use client";

import { useState, type FormEvent } from "react";
import { apiErrorMessage } from "@/redux/api/errors";
import { useSaveAddressMutation } from "@/redux/features/address/addressApi";
import {
  ADDRESS_LABELS,
  ADDRESS_LIMITS,
  type Address,
  type AddressFields,
  type AddressLabel,
} from "@/redux/features/address/address.types";
import { BANGLADESH, BD_DISTRICTS, BD_DIVISIONS, COUNTRIES } from "@/shared/config/locations";
import { useSession } from "@/shared/libs/session";
import { Button } from "./Button";
import { Field, Input, Select, Textarea } from "./Field";
import { SearchSelect } from "./SearchSelect";

export const ADDRESS_LABEL_NAME: Record<AddressLabel, string> = { home: "Home", office: "Office", other: "Other" };

const DEFAULT_COUNTRY = BANGLADESH;

type TextField = keyof typeof ADDRESS_LIMITS;

const NAMES: Record<TextField, string> = {
  fullName: "Full name",
  phone: "Phone",
  address: "Address",
  city: "City",
  country: "Country",
  postalCode: "Postal code",
};

// Mirrors the backend's length checks so mistakes show beside the field.
const check = (fields: AddressFields) => {
  const errors: Partial<Record<TextField, string>> = {};
  for (const key of Object.keys(ADDRESS_LIMITS) as TextField[]) {
    const { min, max } = ADDRESS_LIMITS[key];
    const length = fields[key].trim().length;
    if (length < min || length > max) errors[key] = `${NAMES[key]} needs ${min} to ${max} characters.`;
  }
  return errors;
};

// Adds a delivery address, or edits one when `address` is given.
export function AddressForm({
  address,
  makeDefault = false,
  onSaved,
  onCancel,
}: {
  address?: Address;
  makeDefault?: boolean;
  onSaved: (saved: Address) => void;
  onCancel?: () => void;
}) {
  const { user } = useSession();
  const [save, { isLoading: saving }] = useSaveAddressMutation();
  const [fields, setFields] = useState<AddressFields>(() => ({
    label: address?.label ?? "home",
    fullName: address?.fullName ?? user?.name ?? "",
    phone: address?.phone ?? user?.phone ?? "",
    address: address?.address ?? "",
    city: address?.city ?? "",
    country: address?.country ?? DEFAULT_COUNTRY,
    postalCode: address?.postalCode ?? "",
    isDefault: address?.isDefault ?? makeDefault,
  }));
  const [errors, setErrors] = useState<Partial<Record<TextField, string>>>({});
  const [failure, setFailure] = useState<string | null>(null);

  const set = <K extends keyof AddressFields>(key: K, value: AddressFields[K]) =>
    setFields((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const found = check(fields);
    setErrors(found);
    setFailure(null);
    if (Object.keys(found).length) return;

    const trimmed: AddressFields = {
      ...fields,
      fullName: fields.fullName.trim(),
      phone: fields.phone.trim(),
      address: fields.address.trim(),
      city: fields.city.trim(),
      country: fields.country.trim(),
      postalCode: fields.postalCode.trim(),
    };

    try {
      onSaved(await save({ id: address?._id, fields: trimmed }).unwrap());
    } catch (problem) {
      setFailure(apiErrorMessage(problem));
    }
  };

  const inBangladesh = fields.country === BANGLADESH;
  // An older address may hold a city or country that isn't in the lists; keep
  // it on offer so editing doesn't lose it.
  const oddDistrict = inBangladesh && fields.city && !BD_DISTRICTS.includes(fields.city) ? fields.city : null;
  const oddCountry = fields.country && !COUNTRIES.includes(fields.country) ? fields.country : null;

  const chooseCountry = (country: string) =>
    setFields((current) => ({
      ...current,
      country,
      // Into Bangladesh: keep the city only if it's a district. Out of it:
      // start the city afresh.
      city:
        country === BANGLADESH
          ? BD_DISTRICTS.includes(current.city)
            ? current.city
            : ""
          : current.country === BANGLADESH
            ? ""
            : current.city,
    }));

  const text = (key: TextField, props: { type?: string; autoComplete?: string } = {}) => (
    <Field label={NAMES[key]} error={errors[key]}>
      <Input
        value={fields[key]}
        onChange={(event) => set(key, event.target.value)}
        maxLength={ADDRESS_LIMITS[key].max}
        {...props}
      />
    </Field>
  );

  return (
    <form onSubmit={submit} noValidate>
      <fieldset disabled={saving} className="grid min-w-0 gap-4 sm:grid-cols-2">
        <legend className="sr-only">{address ? "Edit address" : "New address"}</legend>
        {text("fullName", { autoComplete: "name" })}
        {text("phone", { type: "tel", autoComplete: "tel" })}

        <Field label={NAMES.address} error={errors.address} className="sm:col-span-2">
          <Textarea
            value={fields.address}
            onChange={(event) => set("address", event.target.value)}
            maxLength={ADDRESS_LIMITS.address.max}
            autoComplete="street-address"
            placeholder="House, road, area"
            className="min-h-20"
          />
        </Field>

        <SearchSelect
          label={NAMES.country}
          value={fields.country}
          onChange={chooseCountry}
          groups={[{ options: oddCountry ? [oddCountry, ...COUNTRIES] : COUNTRIES }]}
          placeholder="Choose a country"
          searchPlaceholder="Search countries"
          error={errors.country}
        />

        {inBangladesh ? (
          <SearchSelect
            label="District"
            value={fields.city}
            onChange={(district) => set("city", district)}
            groups={[
              ...(oddDistrict ? [{ options: [oddDistrict] }] : []),
              ...BD_DIVISIONS.map(({ division, districts }) => ({ label: `${division} division`, options: districts })),
            ]}
            placeholder="Choose a district"
            searchPlaceholder="Search districts"
            error={errors.city && "Choose a district."}
          />
        ) : (
          text("city", { autoComplete: "address-level2" })
        )}

        {text("postalCode", { autoComplete: "postal-code" })}

        <Field label="Label">
          <Select value={fields.label} onChange={(event) => set("label", event.target.value as AddressLabel)}>
            {ADDRESS_LABELS.map((label) => (
              <option key={label} value={label}>
                {ADDRESS_LABEL_NAME[label]}
              </option>
            ))}
          </Select>
        </Field>

        <label className="flex items-center gap-2.5 text-sm text-ink sm:col-span-2">
          <input
            type="checkbox"
            checked={fields.isDefault}
            onChange={(event) => set("isDefault", event.target.checked)}
            className="size-4 accent-tertiary"
          />
          Use as my default delivery address
        </label>
      </fieldset>

      {failure && (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {failure}
        </p>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {onCancel && (
          <Button onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : address ? "Save address" : "Add address"}
        </Button>
      </div>
    </form>
  );
}
