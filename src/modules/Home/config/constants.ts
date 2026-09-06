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
import appleLogo from "@/images/brands/logos/apple.png";
import honorLogo from "@/images/brands/logos/honor.png";
import infinixLogo from "@/images/brands/logos/infinix.png";
import oneplusLogo from "@/images/brands/logos/oneplus.png";
import oppoLogo from "@/images/brands/logos/oppo.png";
import realmeLogo from "@/images/brands/logos/realme.png";
import samsungLogo from "@/images/brands/logos/samsung.png";
import tecnoLogo from "@/images/brands/logos/tecno.png";
import vivoLogo from "@/images/brands/logos/vivo.png";
import xiaomiLogo from "@/images/brands/logos/xiaomi.png";
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
import { brandMarks } from "@/shared/config/brands";
import {
  brandProducts,
  casesProducts,
  exclusiveProducts,
  newArrivalProducts,
  soundSurroundProducts,
  topSellingProducts,
} from "@/shared/config/products";
import { trustClaims } from "@/shared/config/trust";
import type { HomeData } from "./types";

export const home_data: HomeData = {

  //
  exclusive: {
    title: "Exclusive",
    href: "/shop/exclusive",
    // Products, prices and ratings are the reference site's — placeholders
    // until a real catalogue exists. See memory.md.
    products: exclusiveProducts,
  },

  //
  // The 36 marks the reference bakes into one flat 1320×330 banner. Pulled
  // individually from its /brand page 2026-09-05 — see memory.md.
  brandWall: {
    title: "Exclusively Available",
    brands: brandMarks,
  },

  //
  // Reference-site artwork, pulled 2026-09-04 — see memory.md. The two offer
  // banners carry Gadget & Gear's own EMI and discount terms inside the image.
  promos: {
    brands: [
      { href: "/brands/spigen", image: promoSpigen, alt: "Spigen — Protected In Every Way. Rugged, clear and carbon-weave phone cases." },
      { href: "/brands/torras", image: promoTorras, alt: "TORRAS — Free Your Hands To Create. Clear and frosted cases with fold-out ring stands." },
      { href: "/brands/uag", image: promoUag, alt: "UAG — Built To Go Further. Armoured phone cases in clear, black and olive." },
      { href: "/brands/tucano", image: promoTucano, alt: "TUCANO — Designed To Move With You. Backpacks, laptop sleeves and slings." },
    ],
    offers: [
      { href: "/shop/headphone-speaker/earbuds/airpods", image: promoAirpods, alt: "AirPods Pro 3 — the world's best in-ear Active Noise Cancellation. Up to 6 months 0% EMI, ৳2,000 off, or exchange. Terms and conditions apply." },
      { href: "/shop/watches/smart-watch/apple", image: promoAppleWatch, alt: "Apple Watch Series 11 — the ultimate way to watch your health. Up to 6 months 0% EMI, ৳4,000 off, or exchange. Terms and conditions apply." },
    ],
    straps: {
      href: "/shop/watches/watch-strap",
      alt: "Made to push boundaries — straps for Apple Watch, in steel link, woven nylon, rugged and trail loop styles.",
      desktop: promoStrapsDesktop,
      mobile: promoStrapsMobile,
    },
  },

  //
  // The reference site’s own Sound Surround rail, pulled 2026-09-05 — see memory.md.
  soundSurround: {
    title: "Sound Surround",
    href: "/shop/sound-surround",
    products: soundSurroundProducts,
  },

  //
  // The reference site’s own New Arrival rail, pulled 2026-09-05 — see memory.md.
  newArrival: {
    title: "New Arrival",
    href: "/shop/new-arrival",
    products: newArrivalProducts,
  },

  //
  // The reference site’s own Cases & Screen Protector rail, pulled 2026-09-05 —
  // see memory.md. Every product here has `review: 0` upstream, so none carry a
  // rating and the star row collapses on every card.
  casesAndProtectors: {
    title: "Cases & Screen Protector",
    href: "/shop/cases-protectors",
    products: casesProducts,
  },

  //
  // The reference site’s own Top Selling rail, pulled 2026-09-04 — see memory.md.
  topSelling: {
    title: "Top Selling",
    href: "/shop/top-selling",
    products: topSellingProducts,
  },

  //
  // Ten brands, five products each, all pulled from the reference site on
  // 2026-09-04 — see memory.md. Tabs are wordmarks as text, not logos.
  brands: {
    title: "Shop By Brands",
    href: "/brands",
    items: [
      {
        key: "samsung",
        label: "Samsung",
        logo: samsungLogo,
        href: "/shop/phones/android/samsung",
        products: brandProducts.samsung,
      },
      {
        key: "apple",
        label: "Apple",
        logo: appleLogo,
        href: "/shop/phones/iphone",
        products: brandProducts.apple,
      },
      {
        key: "oppo",
        label: "Oppo",
        logo: oppoLogo,
        href: "/shop/phones/android/oppo",
        products: brandProducts.oppo,
      },
      {
        key: "vivo",
        label: "vivo",
        logo: vivoLogo,
        href: "/shop/phones/android/vivo",
        products: brandProducts.vivo,
      },
      {
        key: "honor",
        label: "HONOR",
        logo: honorLogo,
        href: "/shop/phones/android/honor",
        products: brandProducts.honor,
      },
      {
        key: "oneplus",
        label: "OnePlus",
        logo: oneplusLogo,
        href: "/shop/phones/android/oneplus",
        products: brandProducts.oneplus,
      },
      {
        key: "tecno",
        label: "Tecno",
        logo: tecnoLogo,
        href: "/shop/phones/android/tecno",
        products: brandProducts.tecno,
      },
      {
        key: "infinix",
        label: "Infinix",
        logo: infinixLogo,
        href: "/shop/phones/android/infinix",
        products: brandProducts.infinix,
      },
      {
        key: "realme",
        label: "realme",
        logo: realmeLogo,
        href: "/shop/phones/android/realme",
        products: brandProducts.realme,
      },
      {
        key: "xiaomi",
        label: "Xiaomi",
        logo: xiaomiLogo,
        href: "/shop/phones/android/xiaomi",
        products: brandProducts.xiaomi,
      },
    ],
  },

  //
  categories: {
    title: "Featured Categories",
    // The reference site's own fifteen, in its order. Artwork is theirs too —
    // see memory.md. `/shop/car-accessories` has no entry in `categoryNav` yet.
    items: [
      { label: "Phones", href: "/shop/phones", image: phones },
      { label: "MacBook", href: "/shop/mac/macbook", image: macbook },
      { label: "Tablets", href: "/shop/tablets", image: tablets },
      { label: "iPad", href: "/shop/tablets/ipad", image: ipad },
      { label: "Camera", href: "/shop/camera", image: camera },
      { label: "Watches", href: "/shop/watches", image: watches },
      { label: "Earbuds", href: "/shop/headphone-speaker/earbuds", image: earbuds },
      { label: "Cases & Protectors", href: "/shop/cases-protectors", image: casesProtectors },
      { label: "Cable & Adapter", href: "/shop/phone-accessories/cable", image: cableAdapter },
      { label: "Speaker", href: "/shop/headphone-speaker/bluetooth-speaker", image: speaker },
      { label: "Drone", href: "/shop/drone", image: drone },
      { label: "Router", href: "/shop/networking/router", image: router },
      { label: "Gaming", href: "/shop/gaming", image: gaming },
      { label: "Power Bank", href: "/shop/phone-accessories/power-bank", image: powerBank },
      { label: "Car Accessories", href: "/shop/car-accessories", image: carAccessories },
    ],
  },

  //
  trust: trustClaims,

  //
  hero: {
    interval: 5000,

    // Artwork is the reference site's own, pulled 2026-09-04 — see memory.md.
    // Every slide reads `light`: all six carry a pale bottom edge, which is why
    // the reference can hardcode one dark bullet.
    slides: [
      {
        theme: "light",
        alt: "Save big on iPhone 17 Pro — up to ৳38,000 off or 0% EMI over 24 months, with a complimentary one year extended warranty and trade-in",
        href: "/shop/phones/iphone/17-series",
        desktop: iphoneDesktop,
        mobile: iphoneMobile,
      },
      {
        theme: "light",
        alt: "MacBook Neo — ৳7,000 off or 0% EMI over 12 months, with a free Magic Mouse and Belkin 5-in-1 USB-C hub",
        href: "/shop/mac/macbook",
        desktop: macbookDesktop,
        mobile: macbookMobile,
      },
      {
        theme: "light",
        alt: "Protect your Galaxy S26 Ultra — exclusive cases and screen protectors",
        href: "/shop/cases-protectors/phone-case/samsung",
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
