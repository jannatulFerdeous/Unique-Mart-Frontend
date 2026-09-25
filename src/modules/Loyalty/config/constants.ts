import { site } from "@/shared/config/site";

/* The programme's terms as the shop intends to run them. Every number here is a
   business decision, not a technical one — the client sets the earn rate and the
   tier thresholds, and this file is the one place to change them. */
export const loyalty_data = {
  title: "Loyalty Program",
  heading: `The ${site.name} Loyalty Program`,
  intro:
    "Earn points on everything you buy, and spend them on what you buy next. Membership is free, there is nothing to sign up for beyond an account, and points are added automatically.",
  notLiveNote:
    "Online ordering is not live yet, so points are not being earned at the moment. The programme starts with the first order the shop takes.",

  howTitle: "How it works",
  steps: [
    {
      title: "Buy something",
      body: "Every completed order earns points on the amount you paid, after any discount and excluding delivery.",
    },
    {
      title: "Collect points",
      body: "Points land in your account once the order is delivered and the return window has passed.",
    },
    {
      title: "Spend them",
      body: "Redeem points against a future order at checkout. There is no minimum and nothing to claim.",
    },
  ],

  tiersTitle: "Tiers",
  tiersIntro:
    "Your tier is set by what you have spent over the previous twelve months, and is reviewed on the anniversary of your first order.",
  tierHead: {
    tier: "Tier",
    spend: "Spend in 12 months",
    earn: "Points earned",
    extra: "Also includes",
  },
  tiers: [
    {
      name: "Member",
      spend: "Any",
      earn: "1 point per Tk 100",
      extra: "Order history and saved addresses",
    },
    {
      name: "Silver",
      spend: "Tk 50,000+",
      earn: "2 points per Tk 100",
      extra: "Early access to offers",
    },
    {
      name: "Gold",
      spend: "Tk 200,000+",
      earn: "3 points per Tk 100",
      extra: "Free delivery on every order",
    },
    {
      name: "Platinum",
      spend: "Tk 500,000+",
      earn: "4 points per Tk 100",
      extra: "Priority support and extended exchange",
    },
  ],

  benefitsTitle: "What membership gets you",
  benefits: [
    {
      title: "Points on every order",
      body: "100 points is worth Tk 100 off a future purchase. Points never expire while your account stays active.",
    },
    {
      title: "Offers before anyone else",
      body: "Silver and above see campaign pricing ahead of the public offers page.",
    },
    {
      title: "Free delivery sooner",
      body: "Gold and Platinum get free delivery on every order regardless of its value.",
    },
    {
      title: "A faster way through support",
      body: "Platinum members reach a person without queueing, on the same number as everyone else.",
    },
  ],

  rulesTitle: "The rules, in short",
  rules: [
    "Points are earned on the amount actually paid, after discounts and excluding delivery charges.",
    "Points post once the order is delivered and its return window has closed.",
    "If an order is returned or refunded, the points it earned are removed.",
    "Points belong to one account and cannot be transferred, sold or exchanged for cash.",
    "Points are not earned on gift cards, or on the portion of an order paid for with points.",
    "An account inactive for twenty-four months may have its points expired, and we will email first.",
    "We may change the earn rate or the tier thresholds; changes apply from the date they are published here.",
  ],
  termsNote: "The programme also runs under the shop's",
  termsLink: "Terms & Conditions",
} as const;
