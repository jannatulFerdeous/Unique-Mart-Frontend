import { footerColumns } from "@/shared/config/footer";
import { site } from "@/shared/config/site";
import { CallButton } from "./components/CallButton";
import { FooterColumn } from "./components/FooterColumn";
import { Newsletter } from "./components/Newsletter";

export function Footer() {
  return (
    <footer className="bg-inverse-deep pt-10 pb-4 text-ink-inverse">
      <div className="container-page">
        {/* Newsletter leads the DOM so it stacks first on mobile, and
            row-reverse floats it to the right edge from lg up. */}
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

        <div className="flex flex-col items-center gap-4 pt-6 md:flex-row md:justify-between">
          <p className="text-sm font-medium">
            Copyright @ {new Date().getFullYear()} {site.name}. All rights
            reserved.
          </p>

          {/* Payment-method strip. Slot held at the artwork's 640×56 ratio so
              the row keeps its height until the logos are added. */}
          <div className="aspect-[640/56] w-100 max-w-full" aria-hidden />
        </div>
      </div>
    </footer>
  );
}
