import { site } from "@/shared/config/site";

export type Opening = {
  title: string;
  location: string;
  /** Full time, part time, contract. */
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const careers_data = {
  title: "Careers",
  heading: `Work at ${site.name}`,
  intro:
    "We are a small team selling technology people rely on every day. That means knowing the products properly, answering the phone when it rings, and getting a parcel to the right door on the day we said we would.",

  whyTitle: "What it is like here",
  why: [
    {
      title: "Small team, real ownership",
      body: "Nobody here has a job that is only one narrow thing. You will see a problem through from the shop floor to the shipping label.",
    },
    {
      title: "Product knowledge matters",
      body: "We would rather talk a customer out of the wrong purchase than sell it. That only works if the people talking know the products.",
    },
    {
      title: "We train",
      body: "Brand and product training comes with the job. Experience in retail helps; enthusiasm for the products helps more.",
    },
  ],

  openingsTitle: "Open positions",
  /* Empty on purpose. Add a role here and the page lists it — no code change.
     A vacancy invented to fill the page costs a real applicant a real
     afternoon, which is a different thing from placeholder copy. */
  openings: [] as Opening[],

  noOpeningsTitle: "No open positions right now",
  noOpeningsBody:
    "We are not hiring for a specific role at the moment. We do read speculative applications, and we keep them on file for when something opens up.",
  speculativeAction: "Send us your CV",
  speculativeSubject: "Speculative application",

  responsibilities: "What you would do",
  requirements: "What we are looking for",

  applyTitle: "How to apply",
  applyBody: "Send your CV and a short note about why the role suits you to",
  applyNote:
    "Put the role in the subject line. We reply to every application, including the ones we turn down.",
} as const;
