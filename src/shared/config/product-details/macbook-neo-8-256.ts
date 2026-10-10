import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/macbook-neo-256.png";
import img2 from "@/images/products/macbook-neo-8-256/02-macbook-neo-8gb-512gb-silver-10.png";
import img3 from "@/images/products/macbook-neo-8-256/03-macbook-neo-silver.jpeg";
import img4 from "@/images/products/macbook-neo-8-256/04-macbook-neo-silver-1.jpeg";
import img5 from "@/images/products/macbook-neo-8-256/05-macbook-neo-silver-2.jpeg";
import img6 from "@/images/products/macbook-neo-512.png";
import img7 from "@/images/products/macbook-neo-8-256/07-macbook-neo-blush.jpeg";
import img8 from "@/images/products/macbook-neo-8-256/08-macbook-neo-blush-1.jpeg";
import img9 from "@/images/products/macbook-neo-8-256/09-macbook-neo-blush-2.jpeg";
import img10 from "@/images/products/macbook-neo-8-256/10-macbook-neo-indigo.jpeg";
import img11 from "@/images/products/macbook-neo-8-256/11-macbook-neo-indigo-1.jpeg";
import img12 from "@/images/products/macbook-neo-8-256/12-macbook-neo-indigo-2.jpeg";
import img13 from "@/images/products/macbook-neo-8-256/13-macbook-neo-8gb-512gb-citrus-10.png";
import img14 from "@/images/products/macbook-neo-8-256/14-macbook-neo-citrus.jpeg";
import img15 from "@/images/products/macbook-neo-8-256/15-macbook-neo-citrus-1.jpeg";
import img16 from "@/images/products/macbook-neo-8-256/16-macbook-neo-citrus-2.jpeg";

export const macbookNeo8256: ProductDetail = {
  breadcrumb: [
    { label: "Mac", slug: "apple-store" },
    { label: "MacBook", slug: "macbook" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16],
  inStock: true,

  highlights: [
    "Processor: Apple A18 Pro chip with 6‑core CPU, 5‑core GPU",
    "RAM: 8GB Unified Memory, Storage: 256GB",
    "Display: 13-inch Liquid Retina display, with IPS (2408 x 1506)",
    "Features: Bluetooth 6, Wi-Fi 6E",
  ],

  colors: [
    { name: "Silver", hex: "#ededed", image: img2 },
    { name: "Blush", hex: "#C9ADA2", image: img6 },
    { name: "Indigo", hex: "#69758D", image: img1 },
    { name: "Citrus", hex: "#DDDC8C", image: img13 },
  ],

  emi: { months: 12, perMonth: 9417 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Apple"] },
        { label: "Model Name", value: ["MacBook Neo"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Processor Core", value: ["6‑core CPU with 2 performance cores and 4 efficiency cores"] },
      ],
    },
    {
      title: "Chipset",
      rows: [
        { label: "Chipset Model", value: ["Apple A18 Pro chip"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["13.0-inch (diagonal)"] },
        { label: "Type", value: ["Liquid Retina display", "LED-backlit display with IPS technology"] },
        { label: "Resolution", value: ["2408-by-1506 native resolution at 219 pixels per inch"] },
        { label: "Touch Screen", value: ["60Hz"] },
        { label: "Display Features", value: ["500 nits brightness", "Support for 1 billion colors", "sRGB color"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["8GB"] },
        { label: "RAM Type", value: ["unified memory"] },
        { label: "Removable", value: ["Non-Removable"] },
      ],
    },
    {
      title: "Storage",
      rows: [
        { label: "Type", value: ["SSD"] },
        { label: "Storage Capacity", value: ["256GB"] },
      ],
    },
    {
      title: "Graphics",
      rows: [
        { label: "Type", value: ["Integrated Shared"] },
        { label: "Model", value: ["5‑core GPU", "ProRes encode and decode engine", "AV1 decode"] },
      ],
    },
    {
      title: "Keyboard & Touchpad",
      rows: [
        { label: "Keyboard Type", value: ["Magic Keyboard | Multi-Touch trackpad"] },
        { label: "Keyboard Features", value: ["78 (ANSI) or 79 (ISO) keys including 12 full-height function keys"] },
        { label: "TouchPad", value: ["Multi-Touch trackpad for precise cursor control and support for gestures"] },
      ],
    },
    {
      title: "Camera & Audio",
      rows: [
        { label: "Webcam", value: ["1080p FaceTime HD camera", "1080p HD video recording", "Advanced image signal processor with computational video"] },
        { label: "Speaker", value: ["Dual-speaker sound system"] },
      ],
    },
    {
      title: "Ports & Slots",
      rows: [
        { label: "Card Reader", value: ["N/A"] },
        { label: "USB 2 Port", value: ["Charging", "USB 2 (up to 480Mb/s)"] },
        { label: "USB 3 Port", value: ["Charging", "DisplayPort", "USB 3 (up to 10Gb/s)"] },
        { label: "Microphone Port", value: ["3.5 mm jack"] },
      ],
    },
    {
      title: "Network & Connectivity",
      rows: [
        { label: "LAN", value: ["N/A"] },
        { label: "WiFi", value: ["Wi-Fi 6E (802.11ax)"] },
        { label: "Bluetooth", value: ["Bluetooth 6"] },
      ],
    },
    {
      title: "Security",
      rows: [
        { label: "Fingerprint Sensor", value: ["Magic Keyboard | Multi-Touch trackpad"] },
      ],
    },
    {
      title: "Software",
      rows: [
        { label: "Operating System", value: ["macOS"] },
      ],
    },
    {
      title: "Battery & Power",
      rows: [
        { label: "Battery Type", value: ["lithium‑ion battery"] },
        { label: "Battery Capacity", value: ["36.5‑watt"] },
        { label: "Backup Time (Approx)", value: ["Up to 16 hours video streaming", "Up to 11 hours wireless web"] },
        { label: "Adapter Type", value: ["20W USB-C Power Adapter"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Body Material", value: ["MacBook Neo is made with 60% recycled content, including:", "90% recycled aluminum", "100% recycled cobalt and 95% recycled lithium in the battery", "100% recycled rare earth elements in all magnets", "100% recycled gold plating and tin solder in all Apple-designed printed circuit boards", "100% recycled copper in multiple printed circuit boards", "80% recycled steel in the battery tray, keyboard link bars, and speaker"] },
        { label: "Dimensions", value: ["Height: 0.50 inch (1.27 cm)", "Width: 11.71 inches (29.75 cm)", "Depth: 8.12 inches (20.64 cm)"] },
        { label: "Weight", value: ["2.7 pounds (1.23 kg)"] },
        { label: "Color", value: ["Silver, Blush, Citrus, Indigo"] },
      ],
    },
  ],

  description: {
    title: "MacBook Neo",
    blocks: [
      {
        paragraphs: [
          "Meet the MacBook Neo 8/256GB, a sleek and powerful laptop designed to handle your daily workflow with ease. Built with Apple’s latest innovation, this lightweight machine blends performance, portability, and efficiency into one premium device. Whether you’re a student, creative professional, or business user, the MacBook Neo delivers a smooth macOS experience, fast processing, and stunning visuals—all in a compact, eco-friendly design.",
        ],
      },
      {
        heading: "Next-Gen Apple A18 Pro Chip Performance",
        paragraphs: [
          "Powered by the advanced Apple A18 Pro chip, the MacBook Neo ensures lightning-fast performance and energy efficiency. Its 6-core CPU, featuring 2 performance cores and 4 efficiency cores, handles multitasking, productivity apps, and creative workloads effortlessly. Combined with a 5-core GPU and ProRes engine, this laptop is optimized for smooth video editing, graphics work, and everyday computing.",
        ],
      },
      {
        heading: "Brilliant 13-inch Liquid Retina Display",
        paragraphs: [
          "Enjoy a stunning viewing experience with the 13-inch Liquid Retina display. With a resolution of 2408 x 1506 and 219 PPI, every detail looks sharp and vibrant. The display supports 1 billion colors, sRGB color accuracy, and up to 500 nits brightness, making it perfect for content creation, streaming, and professional use.",
        ],
      },
      {
        heading: "Efficient 8GB Unified Memory & 256GB SSD Storage",
        paragraphs: [
          "The MacBook Neo comes with 8GB unified memory, ensuring faster performance and seamless multitasking across apps. The 256GB SSD provides quick data access, faster boot times, and enough storage for essential files, apps, and media.",
        ],
      },
      {
        heading: "All-Day Battery Life for Maximum Productivity",
        paragraphs: [
          "Stay productive longer with up to 16 hours of video playback and 11 hours of web browsing. The energy-efficient design combined with a 36.5Wh lithium-ion battery ensures you can work, study, or stream without constantly reaching for the charger.",
        ],
      },
      {
        heading: "Magic Keyboard & Precision Trackpad",
        paragraphs: [
          "Typing feels comfortable and responsive with the Magic Keyboard, featuring full-height function keys. The Multi-Touch trackpad offers precise cursor control and supports advanced gestures, making navigation smooth and intuitive.",
        ],
      },
      {
        heading: "Advanced Camera and Audio System",
        paragraphs: [
          "The 1080p FaceTime HD camera with an advanced image signal processor delivers sharp video calls and recordings. Paired with a dual-speaker sound system, the MacBook Neo ensures clear audio whether you're in meetings, classes, or entertainment sessions.",
        ],
      },
      {
        heading: "Modern Connectivity & Ports",
        paragraphs: [
          "With USB-C support including USB 3 (up to 10Gb/s), DisplayPort, and charging capabilities, the MacBook Neo keeps you connected. It also supports Wi-Fi 6E and Bluetooth 6 for faster and more stable wireless performance.",
        ],
      },
      {
        heading: "Eco-Friendly Premium Build",
        paragraphs: [
          "Designed with sustainability in mind, the MacBook Neo uses up to 60% recycled materials, including 90% recycled aluminum and 100% recycled rare earth elements. It’s not just powerful—it’s environmentally responsible too.",
        ],
      },
      {
        heading: "Buying the MacBook Neo 8/256GB from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
