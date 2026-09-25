import type { Metadata } from "next";
import { Auth } from "@/modules/Auth";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Unique Mart account.",
};

export default async function RegisterPage({
  searchParams,
}: PageProps<"/auth/register">) {
  const { back } = await searchParams;
  return <Auth view="register" back={typeof back === "string" ? back : undefined} />;
}
