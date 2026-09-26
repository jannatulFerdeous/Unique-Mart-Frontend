import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/apple-magic-keyboard-for-ipad-air-13-inch.jpeg";
import img2 from "@/images/products/apple-magic-keyboard-for-ipad-air-13-inch/02-apple-magic-keyboard-for-ipad-air-11-inch.jpeg";
import img3 from "@/images/products/apple-magic-keyboard-for-ipad-air-13-inch/03-apple-magic-keyboard-for-ipad-air-11-inch-2.jpeg";
import img4 from "@/images/products/apple-magic-keyboard-for-ipad-air-13-inch/04-apple-magic-keyboard-for-ipad-air-11-inch-3.jpeg";

export const appleMagicKeyboardForIpadAir13Inch: ProductDetail = {
  breadcrumb: [
    { label: "PC Accessories", slug: "computer-accessories" },
    { label: "Keyboard", slug: "keyboard" },
    { label: "Apple", slug: "apple-keyboard" },
  ],
  gallery: [img1, img2, img3, img4],
  inStock: true,

  highlights: [
    "Brand compatibility: Apple",
    "Material: Polyurethane (PU)",
    "Accessory type: Keyboard covers",
    "Device compatibility: iPad Air 13-inch M4",
  ],

  colors: [
    { name: "Black", hex: "#000000", image: img2 },
  ],

  emi: { months: 6, perMonth: 9167 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Apple"] },
        { label: "Model Name", value: ["Magic Keyboard"] },
      ],
    },
    {
      title: "Main Features",
      rows: [
        { label: "Connection Type", value: ["Smart Connector, USB-C"] },
        { label: "Others", value: ["Compatibility:", "iPad Air 13-inch (M4)", "iPad Air 13-inch (M3)", "iPad Air 13-inch (M2)"] },
      ],
    },
    {
      title: "Physical Specifications",
      rows: [
        { label: "System Requirements", value: ["Requires iPadOS 18.3 or later."] },
        { label: "Material", value: ["Polyurethane (PU)"] },
        { label: "Color", value: ["Black"] },
      ],
    },
  ],

  description: {
    title: "Apple Magic Keyboard for iPad Air 13-inch M4",
    blocks: [
      {
        paragraphs: [
          "The Apple Magic Keyboard for iPad Air 13-inch M4 transforms your iPad Air into a powerful productivity companion. Designed with Apple's signature precision, this premium keyboard features a comfortable typing experience, an integrated trackpad, and a floating cantilever design that lets you adjust the viewing angle with ease. Whether you're working, studying, creating content, or browsing the web, the Magic Keyboard delivers a seamless laptop-like experience while maintaining the sleek portability of your iPad Air.",
        ],
      },
      {
        heading: "Premium Design Meets Everyday Productivity",
        paragraphs: [
          "Crafted from durable polyurethane (PU), the Apple Magic Keyboard is built to protect the front and back of your iPad while offering a sophisticated look. Its floating magnetic attachment securely holds your iPad Air in place and allows for smooth angle adjustment, making it comfortable for typing, video calls, streaming, or creative work.",
        ],
      },
      {
        heading: "Responsive Keyboard with Built-in Trackpad",
        paragraphs: [
          "The full-size backlit keyboard offers responsive, quiet keys that make typing emails, documents, and reports effortless. The built-in multi-touch trackpad supports iPadOS gestures, allowing you to navigate apps, edit documents, and multitask with greater precision. If you're looking for the best keyboard case for iPad Air 13-inch, the Apple Magic Keyboard is an excellent choice.",
        ],
      },
      {
        heading: "Smart Connector with USB-C Charging",
        paragraphs: [
          "Using Apple's Smart Connector, the Magic Keyboard connects instantly without Bluetooth pairing or battery charging. The integrated USB-C port supports pass-through charging, keeping your iPad's USB-C port available for accessories like external storage, displays, or other compatible devices.",
        ],
      },
      {
        heading: "Compatibility",
        paragraphs: [
          "The Apple Magic Keyboard is compatible with the following iPad Air models:",
          "iPad Air 13-inch (M4)",
          "iPad Air 13-inch (M3)",
          "iPad Air 13-inch (M2)",
          "It requires iPadOS 18.3 or later for full functionality.",
        ],
      },
      {
        heading: "Buying the Apple Magic Keyboard for iPad Air 13‑inch M4 from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
