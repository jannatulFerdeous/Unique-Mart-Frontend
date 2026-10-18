"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Lock, LogOut, Menu, Store, X } from "lucide-react";
// White lettering for the dark sidebar; dark lettering for the light top bar.
import logoDark from "@/images/brand/logo.png";
import logoLight from "@/images/brand/logo-light.png";
import { useAccount } from "@/modules/Auth/hooks/useAccount";
import { encodeBack, useSession, type SessionUser } from "@/shared/libs/session";
import { cn } from "@/shared/utils/cn";
import { initials } from "@/shared/utils/initials";
import { ROLE_LABEL, canOpen, homeFor } from "../config/access";
import { admin_data } from "../config/constants";
import { Button, ButtonLink } from "../components/Button";
import { AdminSidebar } from "./AdminSidebar";

const noop = () => () => {};

// The session lives in this browser, so the server can't know it. Until the
// page has loaded in the browser, show a neutral placeholder instead of
// flashing the sign-in screen at someone who is signed in.
const useInBrowser = () => useSyncExternalStore(noop, () => true, () => false);

export function AdminShell({ children }: { children: ReactNode }) {
  const inBrowser = useInBrowser();
  const { user } = useSession();
  const pathname = usePathname();

  if (!inBrowser) return <Notice title={admin_data.gate.loading} />;
  if (!user) return <SignInNotice pathname={pathname} />;
  if (!canOpen(user.role, pathname)) return <NoAccessNotice role={user.role} />;
  return <Shell user={user}>{children}</Shell>;
}

function Shell({ user, children }: { user: SessionUser; children: ReactNode }) {
  const { shell } = admin_data;
  const router = useRouter();
  const { signOut } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const role = user.role as keyof typeof ROLE_LABEL | undefined;

  const leave = async () => {
    await signOut();
    router.push("/");
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div className="flex flex-1 bg-canvas">
      <div className="hidden w-60 shrink-0 bg-inverse px-3 lg:block">
        <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto">
          <Brand role={user.role} />
          <AdminSidebar onSignOut={leave} />
        </div>
      </div>

      {/* Phones: the menu slides in from the left over a fading backdrop. */}
      <div
        inert={!menuOpen}
        className={cn("fixed inset-0 z-50 lg:hidden", menuOpen ? "visible" : "invisible delay-300")}
      >
        <button
          type="button"
          aria-label={shell.closeMenu}
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 size-full bg-inverse-deep/60 backdrop-blur-[2px] transition-opacity duration-300 ease-out motion-reduce:transition-none",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto bg-inverse px-3 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-inverse px-3 pt-4 pb-2">
            <p className="text-xs font-bold tracking-widest text-ink-inverse-muted uppercase">{shell.menuTitle}</p>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label={shell.closeMenu}
              className="grid size-9 place-items-center rounded-full bg-inverse-raised text-ink-inverse-muted transition-colors hover:bg-inverse-hover hover:text-ink-inverse"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <AdminSidebar onNavigate={() => setMenuOpen(false)} onSignOut={leave} />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-line bg-surface/95 px-4 py-2.5 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={shell.menu}
            className="rounded-control p-2 text-ink-muted hover:bg-surface-muted hover:text-ink lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>

          <div className="min-w-0 flex-1">
            <Link
              href={homeFor(user.role)}
              aria-label={`${shell.brand} ${shell.subtitle}`}
              className="inline-flex lg:hidden"
            >
              <Image src={logoDark} alt="" priority sizes="80px" className="h-8 w-auto" />
            </Link>
            <p className="hidden truncate text-sm font-semibold text-ink lg:block">{shell.subtitle}</p>
          </div>

          {/* Phones: the icon alone, like Sign out. */}
          <Link
            href="/"
            aria-label={shell.viewSite}
            className="inline-flex items-center gap-1.5 rounded-control p-2 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink sm:px-2.5 sm:py-1.5"
          >
            <Store className="size-5 sm:size-4" aria-hidden />
            <span className="hidden sm:inline">{shell.viewSite}</span>
          </Link>

          <Link href="/account/profile" className="flex items-center gap-2 border-l border-line pl-3">
            <span
              aria-hidden
              className="inline-flex size-8 items-center justify-center rounded-full bg-tertiary-soft text-xs font-bold text-tertiary"
            >
              {initials(user.name) || "U"}
            </span>
            <span className="hidden min-w-0 flex-col leading-tight md:flex">
              <span className="truncate text-sm font-medium text-ink">{user.name}</span>
              <span className="text-xs text-ink-subtle">{role ? ROLE_LABEL[role] : ""}</span>
            </span>
          </Link>

          <Button size="sm" variant="ghost" onClick={leave} aria-label={shell.signOut}>
            <LogOut className="size-4" aria-hidden />
            <span className="hidden sm:inline">{shell.signOut}</span>
          </Button>
        </header>

        <div className="flex-1 px-4 py-5 md:px-6 md:py-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Brand({ role }: { role?: string }) {
  const { shell } = admin_data;

  return (
    <Link href={homeFor(role)} aria-label={`${shell.brand} ${shell.subtitle}`} className="block px-3 py-4">
      <Image src={logoLight} alt="" sizes="100px" className="h-10 w-auto" />
    </Link>
  );
}

function Notice({ title, body, children }: { title: string; body?: string; children?: ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center bg-canvas px-4 py-16">
      <div className="w-full max-w-md rounded-card border border-line bg-surface p-6 text-center shadow-card md:p-7">
        {children ? <Lock className="mx-auto size-6 text-ink-subtle" aria-hidden /> : null}
        <h1 className="mt-3 font-sans text-h4 font-bold text-ink">{title}</h1>
        {body ? <p className="mt-2 text-sm text-ink-muted">{body}</p> : null}
        {children ? <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div> : null}
      </div>
    </div>
  );
}

function SignInNotice({ pathname }: { pathname: string }) {
  const { gate } = admin_data;
  return (
    <Notice title={gate.signInTitle} body={gate.signInBody}>
      <ButtonLink href="/">{gate.back}</ButtonLink>
      <ButtonLink href={`/auth/login?back=${encodeURIComponent(encodeBack(pathname))}`} variant="primary">
        {gate.signIn}
      </ButtonLink>
    </Notice>
  );
}

function NoAccessNotice({ role }: { role?: string }) {
  const { gate } = admin_data;
  return (
    <Notice title={gate.noAccessTitle} body={gate.noAccessBody}>
      <ButtonLink href="/">{gate.back}</ButtonLink>
      <ButtonLink href={homeFor(role)} variant="primary">
        {gate.goHome}
      </ButtonLink>
    </Notice>
  );
}
