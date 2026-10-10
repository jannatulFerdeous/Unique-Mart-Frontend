import type { Metadata } from "next";
import { ForgotPassword } from "@/modules/Auth";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset the password on your Unique Mart account.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: PageProps<"/auth/forgot-password">) {
  const { back } = await searchParams;
  return <ForgotPassword back={typeof back === "string" ? back : undefined} />;
}
