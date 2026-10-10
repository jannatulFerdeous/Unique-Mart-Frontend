"use client";

import { useGoogleLoginMutation, useLoginMutation, useLogoutMutation } from "@/redux/features/auth/authApi";
import { userApi, useCreateUserMutation } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hooks";
import { signIn, signOut } from "@/shared/libs/session";
import { readJwtPayload } from "@/shared/utils/jwt";

// What the backend signs into its tokens (auth.service.ts → createTokens).
type TokenPayload = { userId: string; email: string; role: string };

export type RegisterFields = { name: string; email: string; phone: string; password: string };

// The backend stores emails lowercased but matches login emails as typed.
const normalizeEmail = (email: string) => email.trim().toLowerCase();

export function useAccount() {
  const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const [googleLogin] = useGoogleLoginMutation();
  const [createUser] = useCreateUserMutation();
  const [logout] = useLogoutMutation();

  // Load the profile behind a fresh token so the header can greet the user by name.
  const remember = async (token: string) => {
    const payload = readJwtPayload<TokenPayload>(token);
    if (!payload?.userId) throw new Error("Signed in, but the server's reply was unexpected.");

    const user = await dispatch(userApi.endpoints.getUser.initiate(payload.userId)).unwrap();
    signIn({
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
    });
  };

  const signInWithPassword = async (email: string, password: string) =>
    remember(await login({ email: normalizeEmail(email), password }).unwrap());

  // New Google users get a customer account on the backend's side.
  const signInWithGoogle = async (idToken: string) => remember(await googleLogin({ idToken }).unwrap());

  // New shoppers are always customers; the role is never taken from the form.
  const register = async ({ name, email, phone, password }: RegisterFields) => {
    const address = normalizeEmail(email);
    await createUser({
      name: name.trim(),
      email: address,
      phone: phone.trim(),
      password,
      role: "customer",
      status: "active",
    }).unwrap();
    await signInWithPassword(address, password);
  };

  const signOutEverywhere = async () => {
    signOut();
    try {
      await logout().unwrap();
    } catch {
      // Already signed out locally; the cookie expires on its own.
    }
  };

  return {
    signInWithPassword,
    signInWithGoogle,
    register,
    signOut: signOutEverywhere,
  };
}
