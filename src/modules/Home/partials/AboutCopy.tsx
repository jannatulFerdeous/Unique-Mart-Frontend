import Link from "next/link";
import { mailHref, site, telHref } from "@/shared/config/site";

/* The SEO copy block that closes the reference's home page. Unlike every other
   partial the prose lives here rather than in `constants.ts`: it carries inline
   links, and threading anchors through a data structure costs more than it saves.

   Claims are deliberately limited to the six the trust strip already makes —
   authentic, official, 0% EMI, exchange, delivery, secure payment. The
   reference's "Apple Authorized Reseller" framing is Gadget & Gear's
   certification, not ours; see memory.md. */

/** Underlined in the reference too, just in orange rather than the monochrome. */
const LINK =
  "font-medium text-tertiary underline decoration-tertiary/40 underline-offset-4 transition-colors hover:decoration-tertiary";

export function AboutCopy() {
  return (
    <section aria-labelledby="about-copy-heading" className="pt-16 pb-14">
      <div className="container-page">
        {/* font-sans because the base layer paints every h1–h6 in --font-display;
            only the logo uses Montserrat. Same override SectionHeader needs. */}
        <h2
          id="about-copy-heading"
          className="font-sans font-bold text-ink"
        >
          {site.name} — Your Online Gadget Store in Bangladesh
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-[1.85] text-ink-muted md:text-base">
          <p>
            Technology has folded itself into every part of daily life — the
            phone that wakes you up, the laptop you work on, the earbuds on the
            commute and the watch that counts your evening walk. {site.name}{" "}
            started in {site.since} to make that technology straightforward to
            buy in Bangladesh: one catalogue covering{" "}
            <Link href="/category/phone" className={LINK}>
              phones
            </Link>
            ,{" "}
            <Link href="/category/apple-store" className={LINK}>
              computers
            </Link>
            ,{" "}
            <Link href="/category/watch" className={LINK}>
              wearables
            </Link>
            ,{" "}
            <Link href="/category/headphone-speaker" className={LINK}>
              audio
            </Link>{" "}
            and the accessories that keep all of it running. Every product we
            list is 100% authentic and an official product, with secure payment,
            0% EMI on eligible purchases, exchange options and fast delivery
            nationwide.
          </p>

          <h3 className="pt-4 font-sans font-bold text-ink">
            Smartphones — iPhone and Android
          </h3>
          <p>
            A phone is the device you touch most, so it is worth buying from
            somewhere that stands behind it.{" "}
            <Link href="/category/iphone" className={LINK}>
              iPhone
            </Link>{" "}
            buyers will find the current generations alongside the previous
            ones, and our{" "}
            <Link href="/category/phone" className={LINK}>
              Android
            </Link>{" "}
            range runs from flagships to dependable everyday handsets. Whichever
            side you land on, the unit you receive is an official device meant
            for this market — not grey-market stock — and you can spread the
            cost with 0% EMI or trade in what you are already carrying.
          </p>

          <h3 className="pt-4 font-sans font-bold text-ink">
            Mac, Laptops and Tablets
          </h3>
          <p>
            Whether you are editing video, writing code or just want something
            light for the sofa, the right machine matters.{" "}
            <Link href="/category/apple-store" className={LINK}>
              Mac
            </Link>{" "}
            covers the latest MacBook Air and MacBook Pro configurations, while{" "}
            <Link href="/category/tablets" className={LINK}>
              tablets
            </Link>{" "}
            span everything from full-size iPad Pro models to compact Android
            slates for reading and study. Pair either with a keyboard, a stand
            or a drive from{" "}
            <Link href="/category/computer-accessories" className={LINK}>
              PC accessories
            </Link>{" "}
            and you have a desk that actually works.
          </p>

          <h3 className="pt-4 font-sans font-bold text-ink">
            Smartwatches and Wearables
          </h3>
          <p>
            A{" "}
            <Link href="/category/watch" className={LINK}>
              smartwatch
            </Link>{" "}
            has become less a gadget than a habit — steps, sleep, heart rate and
            the notification you would otherwise dig your phone out for. We
            stock full smartwatches and lighter fitness bands, so you can choose
            between a screen that does everything and a band that quietly counts
            in the background, then swap the strap whenever the mood changes.
          </p>

          <h3 className="pt-4 font-sans font-bold text-ink">
            Headphones and Speakers
          </h3>
          <p>
            Good sound is the cheapest upgrade to a daily commute.{" "}
            <Link href="/category/headphone-speaker" className={LINK}>
              Headphones and speakers
            </Link>{" "}
            runs from true-wireless earbuds and noise-cancelling over-ears to
            portable Bluetooth speakers built to survive a beach trip and party
            speakers that fill a room. Every unit is sealed, official stock, so
            what arrives is what the manufacturer intended.
          </p>

          <h3 className="pt-4 font-sans font-bold text-ink">
            Cases, Chargers and Everyday Accessories
          </h3>
          <p>
            The small things decide how long the expensive things last. Our{" "}
            <Link href="/category/cases-screen-protectors" className={LINK}>
              cases and screen protectors
            </Link>{" "}
            cover the current iPhone and Galaxy line-ups with slim, rugged and
            MagSafe-compatible options, and{" "}
            <Link href="/category/mobile-phone-accessories" className={LINK}>
              phone accessories
            </Link>{" "}
            adds the chargers, cables and power banks worth trusting your device
            to. For the rest of the house there is{" "}
            <Link href="/category/networking" className={LINK}>
              networking
            </Link>{" "}
            for faster, more reliable Wi-Fi.
          </p>

          <p className="pt-4">
            Ordering is online and delivery reaches the whole country, so
            wherever you are in Bangladesh the same catalogue and the same
            prices apply. If you are unsure which model suits you, reach us on{" "}
            <Link href={telHref} className={LINK}>
              {site.phone}
            </Link>{" "}
            or at{" "}
            <Link href={mailHref} className={LINK}>
              {site.email}
            </Link>{" "}
            — a short conversation beats a returned parcel.
          </p>
        </div>
      </div>
    </section>
  );
}
