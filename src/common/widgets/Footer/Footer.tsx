import Image from "next/image";
import Link from "next/link";
import logoLight from "@/images/brand/logo-light.png";
import { footerColumns } from "@/shared/config/footer";
import { company, site } from "@/shared/config/site";
import { CallButton } from "./components/CallButton";
import { FooterColumn } from "./components/FooterColumn";
import { Newsletter } from "./components/Newsletter";

export function Footer() {
  return (
    <footer className="bg-inverse-deep pt-10 pb-4 text-ink-inverse">
      <div className="container-page">
        <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:gap-4">
          <Newsletter />

          <div className="grid gap-4 md:grid-cols-3 lg:flex-1">
            {footerColumns.map((column, index) => (
              <FooterColumn
                key={column.title}
                {...column}
                lead={index === 0 ? <CallButton /> : null}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-line-inverse pt-6 md:flex-row md:justify-between">
          {/* The footer is dark, so it uses the logo with white lettering. */}
          <Link
            href="/"
            aria-label={`${site.name} — home`}
            className="shrink-0 focus-visible:outline-ink-inverse"
          >
            <Image src={logoLight} alt="" sizes="120px" className="h-10 w-auto lg:h-12" />
          </Link>

          <div className="text-center md:text-right">
            <p className="font-medium">
              Copyright @ {new Date().getFullYear()} {site.name}. All rights
              reserved.
            </p>
            {/* SSLCommerz requires the trade license number and registered address here. */}
            <p className="mt-1 text-sm text-ink-inverse-muted">
              Trade License No. {company.tradeLicense} · Registered address: {company.registeredAddress}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
