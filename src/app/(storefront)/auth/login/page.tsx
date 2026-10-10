import type { Metadata } from "next";
import { Auth } from "@/modules/Auth";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Unique Mart account.",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/auth/login">) {
  const { back } = await searchParams;
  return <Auth view="login" back={typeof back === "string" ? back : undefined} />;
}
