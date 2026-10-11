"use client";

import { apiErrorMessage } from "@/redux/api/errors";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/redux/features/wishlist/wishlistApi";
import { toast } from "./toast";
import { useSignInFirst } from "./useSignInFirst";

// The signed-in shopper's wishlist on the backend. Guests have none.
export const useWishlist = () => {
  const { signedIn } = useSignInFirst();
  const query = useGetWishlistQuery(undefined, { skip: !signedIn });
  const entries = signedIn ? (query.data ?? []) : [];
  return { ...query, entries, count: entries.length };
};

export const useWishlistCount = (): number => useWishlist().count;

// Heart state and toggle for one product. `variantId` is the version the heart
// saves; products with variants need one. With `exact`, only that version
// counts as saved and removing takes only it off. Otherwise any saved version
// counts, and removing takes them all off.
export const useWishToggle = ({
  productId,
  variantId,
  name,
  exact = false,
}: {
  productId: string;
  variantId?: string;
  name: string;
  exact?: boolean;
}) => {
  const { signedIn, goSignIn } = useSignInFirst();
  const { entries } = useWishlist();
  const [add, adding] = useAddToWishlistMutation();
  const [remove, removing] = useRemoveFromWishlistMutation();
  const wished = entries.some(
    (entry) => entry.productId?._id === productId && (!exact || (entry.variantId ?? undefined) === variantId),
  );

  const toggle = async () => {
    if (!signedIn) return goSignIn();
    try {
      if (wished) {
        await remove({ productId, variantId: exact ? variantId : undefined }).unwrap();
        toast("good", `${name} removed from your wishlist.`);
      } else {
        await add({ productId, variantId }).unwrap();
        toast("good", `${name} saved to your wishlist.`);
      }
    } catch (problem) {
      toast("danger", apiErrorMessage(problem, "Couldn't update your wishlist. Please try again."));
    }
  };

  return { wished, toggle, busy: adding.isLoading || removing.isLoading };
};
