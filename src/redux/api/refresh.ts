import { refreshStorefront } from "@/shared/api/storefront.actions";

// After a successful write, clear the shop's cached catalogue so the change
// shows on the next visit. Used as `onQueryStarted` on catalogue mutations.
export const refreshShop = async (_args: unknown, { queryFulfilled }: { queryFulfilled: Promise<unknown> }) => {
  try {
    await queryFulfilled;
    await refreshStorefront();
  } catch {
    // Failed writes change nothing; the caller shows the error.
  }
};
