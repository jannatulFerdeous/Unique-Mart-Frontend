import { site } from "@/shared/config/site";
import { FREE_SHIPPING_FROM, SHIPPING_FLAT } from "@/shared/config/shipping";
import { formatPrice } from "@/shared/utils/price";
import type { ProsePage } from "./types";

/* The policy pages, as data.
 *
 * WHY THIS IS WRITTEN AND NOT COPIED. The reference site has a privacy policy, a
 * cookie policy and a terms document, and it would have been quicker to lift
 * them. Two reasons not to. The first is that they are someone else's writing.
 * The second matters more: a privacy policy is a binding statement about how one
 * particular company handles data, and this site's answer is unusual — there is
 * no server, nothing is transmitted, and everything a visitor does is kept in
 * their own browser. Borrowed text would describe collection, transfer and
 * third-party processing that do not happen here, which is a false statement
 * about data handling dressed up as a legal document.
 *
 * So the shape follows the reference's — the same sections a shopper expects to
 * find, in roughly the same order — and every sentence describes what this
 * codebase actually does. The storage table in the cookie policy is checkable:
 * open dev tools and the keys are there.
 *
 * BEFORE LAUNCH. These are accurate, not lawyered. Once real orders, payments
 * and a customer database exist, every one of these pages describes a different
 * system and must be rewritten and reviewed by someone qualified. */

const UPDATED = "2026-09-20";

const CONTACT = `Questions about this page can go to ${site.email} or ${site.phone}.`;

export const privacyPage: ProsePage = {
  title: "Privacy Policy",
  intro: `How ${site.name} handles information about you.`,
  updated: UPDATED,
  sections: [
    {
      heading: "What this policy covers",
      blocks: [
        {
          kind: "text",
          text: `This policy covers ${site.url} and explains what happens to information about you when you browse the shop, sign in, save products, fill a basket or write a review.`,
        },
        {
          kind: "text",
          text: "It is written to describe what the site actually does today rather than what an online shop usually does. Where the answer is 'nothing', it says so.",
        },
      ],
    },
    {
      heading: "Information we collect",
      blocks: [
        {
          kind: "text",
          text: "Only what you type in, and only on the screens that ask for it:",
        },
        {
          kind: "list",
          items: [
            "A name, and optionally an email address or phone number, if you use the sign-in screen.",
            "A rating and a comment, if you write a product review.",
            "The products you put in your basket or save to your wishlist, and how many of each.",
            "An email address, if you enter one in the newsletter box.",
          ],
        },
        {
          kind: "text",
          text: "We do not ask for a date of birth, a national ID number or a payment card, and there is nowhere on the site to enter one.",
        },
      ],
    },
    {
      heading: "Where your information is kept",
      blocks: [
        {
          kind: "text",
          text: "In your own browser, and nowhere else. The site has no account database and no server that stores what you do. Everything listed above is written to your browser's local storage on the device you are using.",
        },
        {
          kind: "text",
          text: "Two consequences worth understanding. Nothing you enter reaches us, so we cannot read your basket, your wishlist or your reviews, and we cannot recover them for you. And nothing follows you to another device or another browser: sign in on a phone and the desktop knows nothing about it.",
        },
        {
          kind: "text",
          text: "Clearing your browser's site data for this site erases all of it permanently.",
        },
      ],
    },
    {
      heading: "Cookies and tracking",
      blocks: [
        {
          kind: "text",
          text: "This site sets no cookies. It runs no analytics, no advertising pixels and no third-party tracking scripts, so there is no profile of your browsing to build, share or sell.",
        },
        {
          kind: "text",
          text: "It does use your browser's local storage, which is a different mechanism with a similar effect on privacy, and the Cookie Policy lists exactly what is stored under which name.",
        },
      ],
    },
    {
      heading: "How we use information",
      blocks: [
        {
          kind: "text",
          text: "To show you the site: your basket on the basket page, your saved products on the wishlist, your name in the header, your review under the product you reviewed. That is the whole of it. Because the data never leaves your device, it cannot be used for marketing, scoring or anything else.",
        },
      ],
    },
    {
      heading: "Sharing your information",
      blocks: [
        {
          kind: "text",
          text: "We share nothing, because we hold nothing. There are no third-party processors, no advertising partners and no data transfers to other countries.",
        },
        {
          kind: "text",
          text: "The site loads fonts from Google Fonts, which means your browser makes a request to Google when a page loads. That request carries your IP address, as any request to any server does. No other third party is contacted.",
        },
      ],
    },
    {
      heading: "Security",
      blocks: [
        {
          kind: "text",
          text: "Data kept in a browser is protected by that browser and that device. Anyone who can unlock your device can read it. Local storage is readable by scripts running on this site, so treat a shared or public computer accordingly and sign out when you finish.",
        },
        {
          kind: "text",
          text: "There is no password on the sign-in screen and nothing is verified, which the screen says plainly. Do not treat it as a secure account.",
        },
      ],
    },
    {
      heading: "Your choices",
      blocks: [
        {
          kind: "text",
          text: "Everything is reversible from the site itself, without asking us:",
        },
        {
          kind: "list",
          items: [
            "Sign out to remove your name and contact details.",
            "Empty the basket or clear the wishlist to remove those.",
            "Delete a review from the product page it is on.",
            "Clear this site's data in your browser settings to remove all of it at once.",
          ],
        },
      ],
    },
    {
      heading: "Children",
      blocks: [
        {
          kind: "text",
          text: "The shop is intended for adults. We do not knowingly collect information from children, and in any case nothing entered on this site is transmitted to us.",
        },
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        {
          kind: "text",
          text: "When the shop gains real accounts, orders and payments, the answers above change substantially, and this page will be rewritten before that happens rather than after. The date at the top shows when it last changed.",
        },
      ],
    },
    {
      heading: "Contact us",
      blocks: [{ kind: "text", text: CONTACT }],
    },
  ],
};

export const cookiePage: ProsePage = {
  title: "Cookie Policy",
  intro: `What ${site.name} stores in your browser, and how to get rid of it.`,
  updated: UPDATED,
  sections: [
    {
      heading: "What are cookies?",
      blocks: [
        {
          kind: "text",
          text: "A cookie is a small file a website asks your browser to keep and send back on every later request. Cookies are how most sites remember a signed-in session, and how advertising networks recognise the same person across different sites.",
        },
      ],
    },
    {
      heading: "Do we use cookies?",
      blocks: [
        {
          kind: "text",
          text: "No. This site sets no cookies at all — not for sessions, not for preferences, not for analytics or advertising. There is no cookie banner because there is nothing to consent to.",
        },
        {
          kind: "text",
          text: "It does use local storage, which is the browser's other storage mechanism. The difference that matters to you: local storage is never attached to network requests, so it is not sent to us or to anyone else. It simply sits on your device until something clears it.",
        },
      ],
    },
    {
      heading: "What we keep in your browser",
      blocks: [
        {
          kind: "text",
          text: "The full list. You can check it yourself under Local Storage in your browser's developer tools.",
        },
        {
          kind: "table",
          head: ["Name", "What it holds", "When it is written"],
          rows: [
            [
              "unique-mart.session.v1",
              "The name, and any email or phone, from the sign-in screen.",
              "When you sign in.",
            ],
            [
              "unique-mart.cart.v1",
              "The products in your basket, their chosen colour and options, and how many of each.",
              "When you add something to the basket.",
            ],
            [
              "unique-mart.wishlist.v1",
              "The products you have saved, and when you saved them.",
              "When you press a heart.",
            ],
            [
              "unique-mart.reviews.v1.*",
              "Reviews you have written, one entry per product.",
              "When you submit a review.",
            ],
          ],
        },
        {
          kind: "text",
          text: "Nothing in that list identifies your device, records where you came from or tracks where you go next.",
        },
      ],
    },
    {
      heading: "Other tracking technologies",
      blocks: [
        {
          kind: "text",
          text: "No web beacons, no tracking pixels, no fingerprinting and no Flash storage. The only request this site makes to a third party is to Google Fonts, for the typefaces the pages are set in.",
        },
      ],
    },
    {
      heading: "How to see or clear what is stored",
      blocks: [
        {
          kind: "text",
          text: "The site's own controls remove it piece by piece: sign out, empty the basket, clear the wishlist, delete a review.",
        },
        {
          kind: "text",
          text: "To remove everything at once, clear site data for this site in your browser settings. In Chrome and Edge this is under Privacy and security, in Safari under Manage Website Data, and in Firefox under Cookies and Site Data. Private or incognito windows discard it automatically when you close them.",
        },
      ],
    },
    {
      heading: "Updates to this policy",
      blocks: [
        {
          kind: "text",
          text: "If the shop ever sets a cookie — a real sign-in would need one — this page will list it, with its purpose and how long it lasts, before it is switched on.",
        },
      ],
    },
    {
      heading: "Further information",
      blocks: [{ kind: "text", text: CONTACT }],
    },
  ],
};

export const termsPage: ProsePage = {
  title: "Terms & Conditions",
  intro: `The terms you agree to by using ${site.name}.`,
  updated: UPDATED,
  numbered: true,
  sections: [
    {
      heading: "Accepting these terms",
      blocks: [
        {
          kind: "text",
          text: `Using this site means accepting these terms. If you do not accept them, please do not use the site. "We" and "us" mean ${site.name}; "you" means anyone browsing or ordering.`,
        },
        {
          kind: "text",
          text: "Online ordering and payment are not live on this site yet. Sections about payment, delivery and returns describe the terms that will apply when they are, and no order placed through the site is binding until that point.",
        },
      ],
    },
    {
      heading: "Your account",
      blocks: [
        {
          kind: "text",
          text: "The sign-in screen currently keeps a name in your own browser and verifies nothing. It is not a secure account and should not be treated as one. When real accounts exist, you will be responsible for keeping your password to yourself and for activity carried out under your sign-in.",
        },
      ],
    },
    {
      heading: "Site content",
      blocks: [
        {
          kind: "text",
          text: "Descriptions, specifications, photographs and page copy are provided for information. We take care to keep them correct, but specifications can change without notice and we do not warrant that every detail is free of error. Where a product's specification matters to your purchase, please confirm it with us before ordering.",
        },
      ],
    },
    {
      heading: "Trademarks",
      blocks: [
        {
          kind: "text",
          text: "Product names, brand names and logos belong to their respective owners. They appear here to identify the products we sell and do not imply endorsement by, or partnership with, those owners beyond any authorisation we state explicitly.",
        },
      ],
    },
    {
      heading: "Prices and product information",
      blocks: [
        {
          kind: "text",
          text: "Prices are in Bangladeshi Taka and include applicable taxes unless a page says otherwise. Where a product shows a struck-through price, that is the price the product is normally listed at, and the saving shown is the difference.",
        },
        {
          kind: "text",
          text: "Prices and offers can change at any time. If a product is listed at an obviously incorrect price, we may cancel the order and refund you in full rather than fulfil it.",
        },
      ],
    },
    {
      heading: "Orders",
      blocks: [
        {
          kind: "text",
          text: "An order is an offer to buy. It is accepted when we confirm it, and we may decline an order — for example where stock has run out, where the price was wrong, or where we cannot verify the delivery details.",
        },
      ],
    },
    {
      heading: "Payment and billing",
      blocks: [
        {
          kind: "text",
          text: "When payment goes live, the methods offered at checkout will be the ones listed there. Any advance or pre-booking amount, and whether it is refundable, will be stated clearly before you pay it rather than in this document.",
        },
      ],
    },
    {
      heading: "Delivery",
      blocks: [
        {
          kind: "text",
          text: `Delivery is charged at ${formatPrice(SHIPPING_FLAT)} per order, and is free on orders of ${formatPrice(FREE_SHIPPING_FROM)} or more. The basket shows the charge before you check out.`,
        },
        {
          kind: "text",
          text: "Delivery times quoted anywhere on the site are estimates. Delays caused by couriers, weather or circumstances outside our control are not a breach of these terms, and we will tell you as soon as we know about one.",
        },
      ],
    },
    {
      heading: "Warranty",
      blocks: [
        {
          kind: "text",
          text: "Warranty is provided by the manufacturer or its authorised distributor, on that brand's terms and for that brand's stated period. Keep your invoice: warranty claims need proof of purchase. Warranty does not cover physical damage, liquid damage, unauthorised repair or normal wear.",
        },
      ],
    },
    {
      heading: "Returns and replacement",
      blocks: [
        {
          kind: "text",
          text: "Tell us within 3 days of delivery if a product arrives damaged, faulty or is not what you ordered, and return it unused in its original packaging with all accessories and the invoice.",
        },
        {
          kind: "text",
          text: "A return or replacement may not apply where:",
        },
        {
          kind: "list",
          items: [
            "the product has been used, installed or activated beyond checking that it works;",
            "the packaging, seals, labels or accessories are missing or damaged;",
            "the damage is physical or liquid damage that happened after delivery;",
            "the product was sold as a display unit, clearance or final sale item and the listing said so.",
          ],
        },
      ],
    },
    {
      heading: "Cancellation and refunds",
      blocks: [
        {
          kind: "text",
          text: "You may cancel an order before it is dispatched. If we cannot supply a product you have paid for, we will tell you and refund the amount in full to the method you paid with.",
        },
      ],
    },
    {
      heading: "Reviews and submissions",
      blocks: [
        {
          kind: "text",
          text: "Reviews should be your own honest experience of the product. We may remove a review that is abusive, unlawful, or written to promote something else. Reviews written on this site are currently kept in your own browser rather than published, which the review form states.",
        },
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        {
          kind: "text",
          text: "To the extent the law allows, our liability for any claim relating to a product or to this site is limited to the amount you paid for the product concerned. We are not liable for indirect losses such as lost profit, lost data or loss of use. Nothing here limits liability that cannot lawfully be limited.",
        },
      ],
    },
    {
      heading: "Governing law",
      blocks: [
        {
          kind: "text",
          text: "These terms are governed by the laws of Bangladesh, and the courts of Bangladesh have jurisdiction over any dispute arising from them.",
        },
      ],
    },
    {
      heading: "Changes to these terms",
      blocks: [
        {
          kind: "text",
          text: "We may update these terms. The date at the top of the page shows when they last changed, and the terms in force when you place an order are the ones that apply to it.",
        },
      ],
    },
    {
      heading: "Contact",
      blocks: [{ kind: "text", text: CONTACT }],
    },
  ],
};
