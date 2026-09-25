import type { StaticImageData } from "next/image";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date. */
  published: string;
  image?: StaticImageData;
};

export const blogs_data = {
  title: "Blogs",
  heading: "Guides and product news",
  intro:
    "Buying guides, comparisons and notes on what is new. Written by the people who sell the products, for people trying to choose between them.",

  recentTitle: "Recent posts",
  /* Empty on purpose. Add a post here and the grid renders it — no code change.
     Three invented articles with invented bylines would look like content and
     be worth nothing to a reader. */
  posts: [] as Post[],

  emptyTitle: "Nothing published yet",
  emptyBody:
    "The first guides are being written. In the meantime, the offers page is the fastest way to see what is worth buying right now.",
  emptyAction: "See what is reduced",

  trendingTitle: "Trending Products",
} as const;
