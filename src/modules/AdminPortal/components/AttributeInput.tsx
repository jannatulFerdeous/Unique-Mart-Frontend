import type { Attribute } from "@/redux/features/attribute/attribute.types";
import type { AttributeValue } from "@/redux/features/product/product.types";
import { cn } from "@/shared/utils/cn";
import { ChoiceChips } from "./ChoiceChips";
import { Field, Input, Select } from "./Field";

// What a form holds while someone types: text for everything except
// pick-many, which is a list. `toValue` turns it into what the API takes.
export type Draft = string | string[];

export const toDraft = (value: AttributeValue | undefined): Draft =>
  value === undefined ? "" : Array.isArray(value) ? value : String(value);

// `undefined` means "left empty"; `null` means "filled in, but not valid".
export const toValue = (attribute: Pick<Attribute, "type">, draft: Draft | undefined): AttributeValue | undefined | null => {
  if (draft === undefined) return undefined;
  if (Array.isArray(draft)) return draft.length ? draft : undefined;
  const text = draft.trim();
  if (text === "") return undefined;
  switch (attribute.type) {
    case "number": {
      const number = Number(text);
      return Number.isFinite(number) ? number : null;
    }
    case "boolean":
      return text === "true";
    case "multi_select":
      return [text];
    default:
      return text;
  }
};

// One control for one attribute. `compact` drops the label for table cells.
export function AttributeInput({
  attribute,
  value,
  onChange,
  error,
  compact,
}: {
  attribute: Attribute;
  value: Draft | undefined;
  onChange: (next: Draft) => void;
  error?: string;
  compact?: boolean;
}) {
  const label = attribute.isRequired && !compact ? `${attribute.name} (required)` : attribute.name;
  const text = typeof value === "string" ? value : "";
  const options = attribute.options ?? [];
  const cell = compact ? "px-2 py-1.5" : undefined;

  if (attribute.type === "multi_select") {
    return (
      <ChoiceChips
        legend={label}
        options={options}
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
        error={error}
        empty="This attribute has no choices yet."
      />
    );
  }

  const control =
    attribute.type === "select" ? (
      <Select value={text} onChange={(event) => onChange(event.target.value)} aria-label={compact ? label : undefined} aria-invalid={Boolean(error)} className={cell}>
        <option value="">{compact ? "—" : "Not set"}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    ) : attribute.type === "boolean" ? (
      <Select value={text} onChange={(event) => onChange(event.target.value)} aria-label={compact ? label : undefined} aria-invalid={Boolean(error)} className={cell}>
        <option value="">{compact ? "—" : "Not set"}</option>
        <option value="true">Yes</option>
        <option value="false">No</option>
      </Select>
    ) : (
      <Input
        type={attribute.type === "number" ? "number" : "text"}
        inputMode={attribute.type === "number" ? "decimal" : undefined}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        aria-label={compact ? label : undefined}
        aria-invalid={Boolean(error)}
        className={cn(cell, error && "border-danger")}
      />
    );

  return compact ? control : <Field label={label} error={error}>{control}</Field>;
}
