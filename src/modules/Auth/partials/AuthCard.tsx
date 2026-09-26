import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { auth_data } from "../config/constants";

type Props = {
  active: "login" | "register";
  back?: string;
  children: React.ReactNode;
};

const withBack = (path: string, back?: string) =>
  back ? `${path}?back=${encodeURIComponent(back)}` : path;

export function AuthCard({ active, back, children }: Props) {
  const tabs = [
    { id: "login" as const, label: auth_data.loginTab, href: withBack("/auth/login", back) },
    {
      id: "register" as const,
      label: auth_data.registerTab,
      href: withBack("/auth/register", back),
    },
  ];

  return (
    <section className="flex justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-125 rounded-banner bg-surface p-6 shadow-card md:p-10">
        <nav aria-label="Account" className="flex justify-center">
          <ul className="flex rounded-full bg-surface-muted p-1">
            {tabs.map((tab) => {
              const current = tab.id === active;

              return (
                <li key={tab.id}>
                  <Link
                    href={tab.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "block rounded-full px-8 py-2.5 font-medium transition-colors md:px-12",
                      current
                        ? "bg-surface text-tertiary shadow-card"
                        : "text-ink hover:text-tertiary",
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {children}
      </div>
    </section>
  );
}

export { withBack };
