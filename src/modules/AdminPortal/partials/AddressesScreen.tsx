"use client";

import { useState } from "react";
import { MapPin, Pencil, Plus } from "lucide-react";
import { apiErrorMessage } from "@/redux/api/errors";
import {
  useDeleteAddressMutation,
  useGetAddressesQuery,
  useSaveAddressMutation,
} from "@/redux/features/address/addressApi";
import type { Address } from "@/redux/features/address/address.types";
import { ADDRESS_LABEL_NAME, AddressForm } from "../components/AddressForm";
import { Button } from "../components/Button";
import { ConfirmAction } from "../components/ConfirmAction";
import { NoticeLine } from "../components/ListControls";
import { EmptyState, Panel, ScreenHeader } from "../components/Panel";
import { StatusPill } from "../components/StatusPill";
import { blurbFor } from "./AdminSidebar";

type Feedback = { tone: "good" | "danger"; text: string } | null;

export function AddressesScreen() {
  const { data: addresses = [], isLoading, isError, error, refetch } = useGetAddressesQuery();
  // "new", an address id being edited, or nothing.
  const [editing, setEditing] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const done = (text: string) => {
    setEditing(null);
    setFeedback({ tone: "good", text });
  };

  return (
    <>
      <ScreenHeader
        title="Manage Address"
        blurb={blurbFor("/account/addresses")}
        actions={
          editing !== "new" && (
            <Button variant="primary" onClick={() => setEditing("new")}>
              <Plus className="size-4" aria-hidden />
              Add address
            </Button>
          )
        }
      />

      <NoticeLine notice={feedback && { scope: "account", ...feedback }} />

      {editing === "new" && (
        <Panel title="New address">
          <AddressForm
            makeDefault={addresses.length === 0}
            onSaved={() => done("Address added.")}
            onCancel={() => setEditing(null)}
          />
        </Panel>
      )}

      {isLoading ? (
        <Panel>
          <EmptyState title="Loading your addresses…" />
        </Panel>
      ) : isError ? (
        <Panel>
          <EmptyState
            title="Couldn't load your addresses"
            body={apiErrorMessage(error)}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        </Panel>
      ) : addresses.length === 0 ? (
        editing !== "new" && (
          <Panel>
            <EmptyState
              title="No saved addresses yet"
              body="Add one now, or at checkout. Your default address is picked for you when you order."
              action={
                <Button variant="primary" onClick={() => setEditing("new")}>
                  Add address
                </Button>
              }
            />
          </Panel>
        )
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li key={address._id}>
              {editing === address._id ? (
                <Panel title="Edit address">
                  <AddressForm
                    address={address}
                    onSaved={() => done("Address saved.")}
                    onCancel={() => setEditing(null)}
                  />
                </Panel>
              ) : (
                <AddressCard
                  address={address}
                  onEdit={() => setEditing(address._id)}
                  report={setFeedback}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function AddressCard({
  address,
  onEdit,
  report,
}: {
  address: Address;
  onEdit: () => void;
  report: (feedback: Feedback) => void;
}) {
  const [save, saving] = useSaveAddressMutation();
  const [remove, removing] = useDeleteAddressMutation();
  const busy = saving.isLoading || removing.isLoading;

  const act = async (action: () => Promise<unknown>, text: string) => {
    try {
      await action();
      report({ tone: "good", text });
    } catch (problem) {
      report({ tone: "danger", text: apiErrorMessage(problem) });
    }
  };

  return (
    <Panel className="h-full" bodyClassName="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <MapPin className="size-4 text-ink-subtle" aria-hidden />
        <p className="font-medium text-ink">{ADDRESS_LABEL_NAME[address.label]}</p>
        {address.isDefault && <StatusPill label="Default" tone="good" />}
      </div>

      <address className="text-sm text-ink-muted not-italic">
        <span className="block font-medium text-ink">{address.fullName}</span>
        {address.address}
        <br />
        {address.city} {address.postalCode}, {address.country}
        <br />
        {address.phone}
      </address>

      <div aria-busy={busy} className="mt-auto flex flex-wrap gap-1.5 pt-2">
        <Button size="sm" onClick={onEdit} disabled={busy}>
          <Pencil className="size-3.5" aria-hidden />
          Edit
        </Button>
        {!address.isDefault && (
          <Button
            size="sm"
            disabled={busy}
            onClick={() =>
              act(() => save({ id: address._id, fields: { isDefault: true } }).unwrap(), "Default address changed.")
            }
          >
            Make default
          </Button>
        )}
        <ConfirmAction
          label="Delete"
          describe={`${ADDRESS_LABEL_NAME[address.label]} address`}
          onConfirm={() => act(() => remove(address._id).unwrap(), "Address deleted.")}
        />
      </div>
    </Panel>
  );
}
