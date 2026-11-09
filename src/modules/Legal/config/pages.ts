import { deliveryChargeSummary } from "@/shared/config/shipping";
import { site } from "@/shared/config/site";
import type { ProsePage } from "./types";

const UPDATED = "2026-11-10";

const CONTACT = `Questions about this page can go to ${site.email} or ${site.phone}, or ask at our shop: ${site.address}.`;

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
          text: `This policy covers ${site.url} and explains what happens to information about you when you create an account, shop, place an order, write a review or sign up for the newsletter.`,
        },
        {
          kind: "text",
          text: `${site.name} is run from ${site.address}. That is who "we" means on this page.`,
        },
      ],
    },
    {
      heading: "Information we collect",
      blocks: [
        {
          kind: "text",
          text: "Only what you give us, on the screens that ask for it:",
        },
        {
          kind: "list",
          items: [
            "Your account: your name, email address, phone number and password, or your name and email from Google if you sign in with Google. A profile photo, if you add one.",
            "Your delivery addresses: the name, phone number and address you want orders sent to.",
            "Your orders: what you bought, the price, the delivery charge, any coupon you used and how each order is progressing.",
            "Your payments: the payment method, the amount and whether it was paid or refunded. For online payments this includes the transaction reference SSLCOMMERZ gives us.",
            "Your cart and wishlist, so they are still there when you come back or sign in on another device.",
            "Your reviews: the rating and comment you write on a product.",
            "Your email address, if you sign up for the newsletter.",
          ],
        },
        {
          kind: "text",
          text: "We never see or store your card number, PIN or mobile banking password. Those are entered on SSLCOMMERZ's payment page, not on this site.",
        },
      ],
    },
    {
      heading: "How we use information",
      blocks: [
        {
          kind: "list",
          items: [
            "To run your account and keep you signed in.",
            "To process, deliver and support your orders, including calling you about an order or a delivery.",
            "To take payments and issue refunds.",
            "To show your reviews on the products you reviewed.",
            "To send you the newsletter, only if you signed up for it.",
          ],
        },
        {
          kind: "text",
          text: "We do not sell your information, and we do not use it to build an advertising profile of you.",
        },
      ],
    },
    {
      heading: "Who we share it with",
      blocks: [
        {
          kind: "text",
          text: "Only with the services needed to complete your order:",
        },
        {
          kind: "list",
          items: [
            "SSLCOMMERZ, which processes online payments and refunds. It receives your name, contact details and the order amount.",
            "The courier delivering your order, who receives the delivery name, phone number and address.",
            "Google, only if you choose to sign in with Google.",
            "Cloudinary, which stores and serves the site's images, including a profile photo if you upload one.",
          ],
        },
        {
          kind: "text",
          text: "We may also disclose information where the law of Bangladesh requires it.",
        },
      ],
    },
    {
      heading: "Cookies and tracking",
      blocks: [
        {
          kind: "text",
          text: "The site sets one cookie, to keep you signed in. It runs no analytics, no advertising pixels and no third-party tracking scripts. The Cookie Policy lists exactly what is stored in your browser.",
        },
      ],
    },
    {
      heading: "Security",
      blocks: [
        {
          kind: "text",
          text: "Passwords are stored only in hashed form, so nobody at our end can read them. The sign-in cookie cannot be read by scripts on the page. Even so, no system is perfectly secure: use a password you don't use anywhere else, and log out when you finish on a shared or public computer.",
        },
      ],
    },
    {
      heading: "How long we keep it",
      blocks: [
        {
          kind: "text",
          text: "Account details are kept while your account exists. Order and payment records are kept after that, for as long as we need them for accounting, warranty and legal purposes.",
        },
      ],
    },
    {
      heading: "Your choices",
      blocks: [
        {
          kind: "list",
          items: [
            "Change your name, phone number, profile photo and password from your account.",
            "Add, edit or delete delivery addresses from your account.",
            "Remove items from your cart or wishlist at any time.",
            "Unsubscribe from the newsletter at any time on the newsletter page.",
            "Ask us to delete your account by contacting us. Order records we must keep by law are kept, but are no longer linked to an account you can sign in to.",
          ],
        },
      ],
    },
    {
      heading: "Children",
      blocks: [
        {
          kind: "text",
          text: "The shop is meant for adults. We do not knowingly collect information from children under 18. If you believe a child has given us their details, contact us and we will remove them.",
        },
      ],
    },
    {
      heading: "Changes to this policy",
      blocks: [
        {
          kind: "text",
          text: "If how we handle your information changes, we will update this page first. The date at the top shows when it last changed.",
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
  intro: `What ${site.name} stores in your browser, and how to clear it.`,
  updated: UPDATED,
  sections: [
    {
      heading: "What are cookies?",
      blocks: [
        {
          kind: "text",
          text: "A cookie is a small file a website asks your browser to keep and send back with later requests. Most sites use cookies to remember that you are signed in. Advertising networks also use them to recognise the same person across different sites.",
        },
      ],
    },
    {
      heading: "The cookie we use",
      blocks: [
        {
          kind: "text",
          text: "Just one, and it is needed for signing in. There is no cookie for analytics or advertising.",
        },
        {
          kind: "table",
          head: ["Name", "What it does", "How long it lasts"],
          rows: [
            [
              "refreshToken",
              "Keeps you signed in, so you don't have to log in again on every visit. Scripts on the page cannot read it.",
              "7 days, or until you log out.",
            ],
          ],
        },
        {
          kind: "text",
          text: "The cookie is set only when you log in. If you never log in, no cookie is set. Because it is needed for the site to work, there is no cookie banner asking for consent.",
        },
      ],
    },
    {
      heading: "What else we keep in your browser",
      blocks: [
        {
          kind: "text",
          text: "Your browser's local storage keeps a copy of your name, email and phone number, so the header can greet you without waiting for the server. Unlike a cookie, local storage is never sent with requests. It is removed when you log out.",
        },
        {
          kind: "table",
          head: ["Name", "What it holds", "When it is written"],
          rows: [["unique-mart.session.v1", "Your name, email and phone number.", "When you log in."]],
        },
        {
          kind: "text",
          text: "Your cart, wishlist, orders and reviews are kept with your account on our server, not in your browser.",
        },
      ],
    },
    {
      heading: "Other tracking technologies",
      blocks: [
        {
          kind: "text",
          text: "We use no web beacons, tracking pixels or fingerprinting. Product and brand images load from Cloudinary, which serves the site's images. When you pay online you are taken to SSLCOMMERZ, and its own cookie policy applies on its pages.",
        },
      ],
    },
    {
      heading: "How to clear what is stored",
      blocks: [
        {
          kind: "text",
          text: "Logging out removes both the cookie and the local storage entry.",
        },
        {
          kind: "text",
          text: "To remove everything at once, clear this site's data in your browser settings. In Chrome and Edge it is under Privacy and security, in Safari under Manage Website Data, and in Firefox under Cookies and Site Data. You will need to log in again afterwards.",
        },
      ],
    },
    {
      heading: "Updates to this policy",
      blocks: [
        {
          kind: "text",
          text: "If we ever add another cookie, this page will list it, with what it does and how long it lasts, before it is switched on.",
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
          text: `Using this site or buying from our shop means accepting these terms. If you do not accept them, please do not use the site. "We" and "us" mean ${site.name}, ${site.address}; "you" means anyone browsing or ordering.`,
        },
      ],
    },
    {
      heading: "Your account",
      blocks: [
        {
          kind: "text",
          text: "You need an account to place an order. Give us correct details, keep your password to yourself, and tell us straight away if you think someone else has used your account. You are responsible for orders placed from your account.",
        },
      ],
    },
    {
      heading: "Site content",
      blocks: [
        {
          kind: "text",
          text: "Descriptions, specifications, photographs and page copy are for information. We take care to keep them correct, but specifications can change without notice and we cannot promise every detail is free of error. If a specification matters to your purchase, confirm it with us before ordering.",
        },
      ],
    },
    {
      heading: "Trademarks",
      blocks: [
        {
          kind: "text",
          text: "Product names, brand names and logos belong to their owners. They appear here to identify the products we sell. Their appearance does not mean those owners endorse or partner with us, unless we say so explicitly.",
        },
      ],
    },
    {
      heading: "Prices and product information",
      blocks: [
        {
          kind: "text",
          text: "Prices are in Bangladeshi Taka and include applicable taxes unless a page says otherwise. A struck-through price is the product's usual listed price, and the saving shown is the difference.",
        },
        {
          kind: "text",
          text: "Prices and offers can change at any time. The price that applies is the one shown when you place your order. If a product is listed at an obviously wrong price, we may cancel the order and refund you in full rather than fulfil it.",
        },
      ],
    },
    {
      heading: "Orders",
      blocks: [
        {
          kind: "text",
          text: "An order is an offer to buy. It is accepted when we confirm it. We may decline an order, for example when stock has run out, the price was wrong, or we cannot verify the delivery details.",
        },
      ],
    },
    {
      heading: "Payment",
      blocks: [
        {
          kind: "text",
          text: "You can pay in either of two ways:",
        },
        {
          kind: "list",
          items: [
            "Full payment online through SSLCOMMERZ, by card, mobile banking or internet banking. We confirm the order once SSLCOMMERZ has verified the payment.",
            "Cash on delivery, paid in full to the courier when the order arrives.",
          ],
        },
        {
          kind: "text",
          text: "Coupons are applied at checkout, and the total you see before you confirm is the total you pay.",
        },
      ],
    },
    {
      heading: "Delivery",
      blocks: [
        {
          kind: "text",
          text: `We deliver anywhere in Bangladesh. The delivery charge is ${deliveryChargeSummary}, and checkout shows it before you place your order.`,
        },
        {
          kind: "text",
          text: "How long delivery takes depends on your address and the courier serving it. Delays caused by couriers, weather or other events outside our control are not a breach of these terms, and we will tell you as soon as we know about one.",
        },
      ],
    },
    {
      heading: "Buying at our shop",
      blocks: [
        {
          kind: "text",
          text: `You can also see products and buy in person at our shop: ${site.address}. It is open ${site.hours.toLowerCase()}. These terms apply to shop purchases too, apart from the sections on delivery and online payment.`,
        },
      ],
    },
    {
      heading: "Warranty",
      blocks: [
        {
          kind: "text",
          text: "Warranty is provided by the manufacturer or its authorised distributor, on that brand's terms and for that brand's stated period. Keep your invoice, because warranty claims need proof of purchase. Warranty does not cover physical damage, liquid damage, unauthorised repair or normal wear.",
        },
      ],
    },
    {
      heading: "Returns and replacement",
      blocks: [
        {
          kind: "text",
          text: "Tell us within 3 days of delivery if a product arrives damaged or faulty, or is not what you ordered. Return it unused, in its original packaging, with all accessories and the invoice.",
        },
        {
          kind: "text",
          text: "A return or replacement may not apply when:",
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
          text: "You can cancel an order yourself from your account until it is shipped, as long as it has not been paid online. Cash on delivery orders can be cancelled the same way.",
        },
        {
          kind: "text",
          text: "If you paid online, contact us before the order is shipped and we will cancel it and refund you through SSLCOMMERZ, to the method you paid with. If we cannot supply a product you have paid for, we will tell you and refund the full amount the same way.",
        },
      ],
    },
    {
      heading: "Reviews",
      blocks: [
        {
          kind: "text",
          text: "Reviews should describe your own honest experience of the product. We may remove a review that is abusive or unlawful, or that is written to promote something else.",
        },
      ],
    },
    {
      heading: "Limitation of liability",
      blocks: [
        {
          kind: "text",
          text: "As far as the law allows, our liability for any claim about a product or this site is limited to the amount you paid for that product. We are not liable for indirect losses such as lost profit, lost data or loss of use. Nothing here limits liability that cannot lawfully be limited.",
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
          text: "We may update these terms. The date at the top of the page shows when they last changed. Your order is covered by the terms in force when you placed it.",
        },
      ],
    },
    {
      heading: "Contact",
      blocks: [{ kind: "text", text: CONTACT }],
    },
  ],
};
