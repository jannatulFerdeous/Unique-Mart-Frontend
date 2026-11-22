import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pages are pre-built at deploy time with the whole catalogue (thousands of
  // products, fetched page by page); a slow API can pass the default 60s.
  staticPageGenerationTimeout: 180,
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Hero banners (and later product images) uploaded through the backend live on Cloudinary.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" }],
  },
};

export default nextConfig;
