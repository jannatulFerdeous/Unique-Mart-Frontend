"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { initials } from "@/shared/utils/initials";
import { admin_data } from "../config/constants";
import { Button } from "../components/Button";
import { AdminGate, type AdminIdentity } from "./AdminGate";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  const { shell } = admin_data;
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  if (!admin) return <AdminGate onSignIn={setAdmin} />;

  return (
    <div className="flex flex-1 bg-canvas">
      <div className="hidden w-60 shrink-0 bg-inverse px-3 lg:block">
        <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto">
          <Brand />
          <AdminSidebar />
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-64 max-w-[80%] overflow-y-auto bg-inverse px-3">
            <div className="flex items-center justify-between gap-2 pt-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={shell.closeMenu}
                className="rounded-control p-2 text-ink-inverse-muted hover:bg-inverse-raised hover:text-ink-inverse"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <AdminSidebar onNavigate={() => setMenuOpen(false)} />
          </div>
          <button
            type="button"
            aria-label={shell.closeMenu}
            onClick={() => setMenuOpen(false)}
            className="flex-1 bg-inverse-deep/50"
          />
        </div>
      )}

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
            <p className="truncate text-sm font-semibold text-ink">{shell.subtitle}</p>
          </div>

          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-control px-2.5 py-1.5 text-sm text-ink-muted hover:bg-surface-muted hover:text-ink sm:inline-flex"
          >
            <ExternalLink className="size-4" aria-hidden />
            {shell.viewSite}
          </Link>

          <span className="flex items-center gap-2 border-l border-line pl-3">
            <span
              aria-hidden
              className="inline-flex size-8 items-center justify-center rounded-full bg-tertiary-soft text-xs font-bold text-tertiary"
            >
              {initials(admin.name) || "A"}
            </span>
            <span className="hidden min-w-0 flex-col leading-tight md:flex">
              <span className="truncate text-sm font-medium text-ink">{admin.name}</span>
              <span className="text-xs text-ink-subtle capitalize">{admin.role}</span>
            </span>
          </span>

          <Button size="sm" variant="ghost" onClick={() => setAdmin(null)} aria-label={shell.signOut}>
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

function Brand() {
  const { shell } = admin_data;

  return (
    <Link href="/admin" className="block px-3 py-4">
      <span className="block font-display text-base font-bold text-ink-inverse">
        {shell.brand}
      </span>
      <span className="block text-xs text-ink-inverse-muted">{shell.subtitle}</span>
    </Link>
  );
}
