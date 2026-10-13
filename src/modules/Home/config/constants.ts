import bkashDesktop from "@/images/banners/bkash-desktop.jpg";
import bkashMobile from "@/images/banners/bkash-mobile.jpg";
import galaxyDesktop from "@/images/banners/galaxy-s26-desktop.png";
import galaxyMobile from "@/images/banners/galaxy-s26-mobile.png";
import incaseDesktop from "@/images/banners/incase-desktop.png";
import incaseMobile from "@/images/banners/incase-mobile.png";
import iphoneDesktop from "@/images/banners/iphone-17-pro-max-desktop.png";
import iphoneMobile from "@/images/banners/iphone-17-pro-max-mobile.png";
import macbookDesktop from "@/images/banners/macbook-neo-desktop.png";
import macbookMobile from "@/images/banners/macbook-neo-mobile.png";
import storeDesktop from "@/images/banners/store-locator-desktop.png";
import storeMobile from "@/images/banners/store-locator-mobile.png";
import promoAirpods from "@/images/promos/airpods-pro-3.png";
import promoAppleWatch from "@/images/promos/apple-watch.png";
import promoSpigen from "@/images/promos/spigen.png";
import promoStrapsDesktop from "@/images/promos/watch-straps-desktop.png";
import promoStrapsMobile from "@/images/promos/watch-straps-mobile.png";
import promoTorras from "@/images/promos/torras.png";
import promoTucano from "@/images/promos/tucano.png";
import promoUag from "@/images/promos/uag.png";
import cableAdapter from "@/images/categories/cable-adapter.png";
import camera from "@/images/categories/camera.png";
import carAccessories from "@/images/categories/car-accessories.png";
import casesProtectors from "@/images/categories/cases-protectors.png";
import drone from "@/images/categories/drone.png";
import earbuds from "@/images/categories/earbuds.png";
import gaming from "@/images/categories/gaming.png";
import ipad from "@/images/categories/ipad.png";
import macbook from "@/images/categories/macbook.png";
import phones from "@/images/categories/phones.png";
import powerBank from "@/images/categories/power-bank.png";
import router from "@/images/categories/router.png";
import speaker from "@/images/categories/speaker.png";
import tablets from "@/images/categories/tablets.png";
import watches from "@/images/categories/watches.png";
import { trustClaims } from "@/shared/config/trust";
import type { HomeData } from "./types";

export const home_data: HomeData = {

  exclusive: {
    title: "Exclusive",
    href: "/shop/exclusive",
  },

  // Its logos are every brand the admin has added.
  brandWall: {
    title: "Exclusively Available",
  },

  promos: {
    brands: [
      { href: "/brands/spigen", image: promoSpigen, alt: "Spigen — Protected In Every Way. Rugged, clear and carbon-weave phone cases." },
      { href: "/brands/torras", image: promoTorras, alt: "TORRAS — Free Your Hands To Create. Clear and frosted cases with fold-out ring stands." },
      { href: "/brands/uag", image: promoUag, alt: "UAG — Built To Go Further. Armoured phone cases in clear, black and olive." },
      { href: "/brands/tucano", image: promoTucano, alt: "TUCANO — Designed To Move With You. Backpacks, laptop sleeves and slings." },
    ],
    offers: [
      { href: "/category/airpods", image: promoAirpods, alt: "AirPods Pro 3 — the world's best in-ear Active Noise Cancellation. Up to 6 months 0% EMI, ৳2,000 off, or exchange. Terms and conditions apply." },
      { href: "/category/watches/smart-watch/apple", image: promoAppleWatch, alt: "Apple Watch Series 11 — the ultimate way to watch your health. Up to 6 months 0% EMI, ৳4,000 off, or exchange. Terms and conditions apply." },
    ],
    straps: {
      href: "/category/watches",
      alt: "Made to push boundaries — straps for Apple Watch, in steel link, woven nylon, rugged and trail loop styles.",
      desktop: promoStrapsDesktop,
      mobile: promoStrapsMobile,
    },
  },

  soundSurround: {
    title: "Sound Surround",
    href: "/category/headphone-speaker",
  },

  newArrival: {
    title: "New Arrival",
    href: "/shop/new-arrival",
  },

  casesAndProtectors: {
    title: "Cases & Screen Protector",
    href: "/category/cases-protectors",
  },

  topSelling: {
    title: "Top Selling",
    href: "/shop/top-selling",
  },

  // A tab for each of the brands with the most products in the admin.
  brands: {
    title: "Shop By Brands",
    href: "/brands",
    tabs: 10,
  },

  categories: {
    title: "Featured Categories",
    items: [
      { label: "Phones", href: "/category/phones", image: phones },
      { label: "MacBook", href: "/category/macbook", image: macbook },
      { label: "Tablets", href: "/category/tablets", image: tablets },
      { label: "iPad", href: "/category/ipad", image: ipad },
      { label: "Camera", href: "/category/camera", image: camera },
      { label: "Watches", href: "/category/watches", image: watches },
      { label: "Earbuds", href: "/category/earbuds", image: earbuds },
      { label: "Cases & Protectors", href: "/category/cases-protectors", image: casesProtectors },
      { label: "Cable & Adapter", href: "/category/cable-adapter", image: cableAdapter },
      { label: "Speaker", href: "/category/speaker", image: speaker },
      { label: "Drone", href: "/category/drone", image: drone },
      { label: "Router", href: "/category/router", image: router },
      { label: "Gaming", href: "/category/video-games", image: gaming },
      { label: "Power Bank", href: "/category/power-banks", image: powerBank },
      { label: "Car Accessories", href: "/category/car-accessories", image: carAccessories },
    ],
  },

  trust: trustClaims,

  hero: {
    interval: 5000,

    slides: [
      {
        theme: "light",
        alt: "Save big on iPhone 17 Pro — up to ৳38,000 off or 0% EMI over 24 months, with a complimentary one year extended warranty and trade-in",
        href: "/category/iphone",
        desktop: iphoneDesktop,
        mobile: iphoneMobile,
      },
      {
        theme: "light",
        alt: "MacBook Neo — ৳7,000 off or 0% EMI over 12 months, with a free Magic Mouse and Belkin 5-in-1 USB-C hub",
        href: "/category/macbook",
        desktop: macbookDesktop,
        mobile: macbookMobile,
      },
      {
        theme: "light",
        alt: "Protect your Galaxy S26 Ultra — exclusive cases and screen protectors",
        href: "/category/cases-protectors/samsung-cases-protectors",
        desktop: galaxyDesktop,
        mobile: galaxyMobile,
      },
      {
        theme: "light",
        alt: "Incase — designed to take you places. Backpacks, sleeves and slings sold in Apple Stores",
        href: "/brands",
        desktop: incaseDesktop,
        mobile: incaseMobile,
      },
      {
        theme: "light",
        alt: "Pay with bKash and get up to ৳1,000 cashback on online electronics purchases",
        href: "/offers",
        desktop: bkashDesktop,
        mobile: bkashMobile,
      },
      {
        theme: "light",
        alt: "Find us on Apple Store Locator — Gadget Studio, bti Landmark, 16 Gulshan Avenue, Dhaka",
        href: "/store-locator",
        desktop: storeDesktop,
        mobile: storeMobile,
      },
    ],
  },
};
