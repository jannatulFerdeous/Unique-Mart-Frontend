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

// Heart state and toggle for one product.
export const useWishToggle = (productId: string, name: string) => {
  const { signedIn, goSignIn } = useSignInFirst();
  const { entries } = useWishlist();
  const [add, adding] = useAddToWishlistMutation();
  const [remove, removing] = useRemoveFromWishlistMutation();
  const wished = entries.some((entry) => entry.productId?._id === productId);

  const toggle = async () => {
    if (!signedIn) return goSignIn();
    try {
      if (wished) {
        await remove(productId).unwrap();
        toast("good", `${name} removed from your wishlist.`);
      } else {
        await add(productId).unwrap();
        toast("good", `${name} saved to your wishlist.`);
      }
    } catch (problem) {
      toast("danger", apiErrorMessage(problem, "Couldn't update your wishlist. Please try again."));
    }
  };

  return { wished, toggle, busy: adding.isLoading || removing.isLoading };
};
