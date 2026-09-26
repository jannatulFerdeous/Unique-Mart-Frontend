import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/honor-pad-x8b-6gb-128gb.jpeg";
import img2 from "@/images/products/honor-pad-x8b-6gb-128gb/02-honor-pad-x8b-1.jpeg";
import img3 from "@/images/products/honor-pad-x8b-6gb-128gb/03-honor-pad-x8b-2.jpeg";
import img4 from "@/images/products/honor-pad-x8b-6gb-128gb/04-honor-pad-x8b-5.jpeg";
import img5 from "@/images/products/honor-pad-x8b-6gb-128gb/05-honor-pad-x8b-3.jpeg";
import img6 from "@/images/products/honor-pad-x8b-6gb-128gb/06-honor-pad-x8b-4.jpeg";

export const honorPadX8b6gb128gb: ProductDetail = {
  breadcrumb: [
    { label: "Tablets", slug: "tablets" },
    { label: "HONOR", slug: "honor-tablet-pc" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6],
  inStock: true,

  highlights: [
    "Display Type: 11 inches / TFT LCD (IPS)",
    "Processor: Snapdragon 680 4G Mobile Platform",
    "Battery Capacity: 10100 mAh (typical value)",
    "Camera: 5MP + 5MP",
  ],

  colors: [
    { name: "Space Gray", hex: "#a7adba", image: img1 },
  ],

  emi: { months: 3, perMonth: 8333 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["HONOR"] },
        { label: "Model Name", value: ["Pad X8b"] },
      ],
    },
    {
      title: "Main Feature",
      rows: [
        { label: "Display Type", value: ["TFT LCD (IPS)"] },
        { label: "Size", value: ["11 inches"] },
        { label: "Resolution", value: ["1920*1200"] },
        { label: "RAM", value: ["6GB"] },
        { label: "Storage", value: ["128GB"] },
        { label: "Processor", value: ["Snapdragon 680 4G Mobile Platform"] },
        { label: "Operating System", value: ["MagicOS 10 (Android 16)"] },
        { label: "Connectivity", value: ["Wi-Fi, Bluetooth"] },
        { label: "Audio", value: ["Single MIC", "HONOR Sound", "Quad-speaker System"] },
        { label: "Others", value: ["Screen-to-body Ratio: 16:10", "PPI: 207PPI", "Brightness: 500nits", "Contrast Ratio: 1500:1 (typical value)", "Refresh Rate: 90Hz (Support 2 gears, 90Hz/60Hz)", "Screen Color: 16.7 million colors", "Switzerland SGS Drop Resistance Certification and Crush Resistance Certification", "HONOR Eye Comfort FullView Display", "TÜV Rheinland Low Blue Light Certification and Flicker Free Certification7", "Dynamic Dimming, E-ink Mode"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimensions", value: ["Width: 256.91mm", "Height: 168.46mm", "Thickness: 7.25mm"] },
        { label: "Weight", value: ["Approx. 496g (with battery)"] },
        { label: "Color", value: ["Space Gray"] },
      ],
    },
    {
      title: "Camera",
      rows: [
        { label: "Front Camera", value: ["5MP"] },
        { label: "Rear Camera", value: ["5MP"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["Lithium ion battery"] },
        { label: "Capacity", value: ["10100 mAh (typical), 10000 mAh (rated)"] },
        { label: "Charging", value: ["5W Reverse Charging, 15W Wired Charging (Type-C)"] },
      ],
    },
    {
      title: "Special Features",
      rows: [
        { label: "Bluetooth", value: ["BT 5.0, Supported BLE, SBC, AAC, LDAC"] },
        { label: "WLAN", value: ["WIFI 5, 802.11 a/b/g/n/ac", "Wi-Fi Frequency: 2.4GHz and 5GHz"] },
        { label: "USB", value: ["Type-C, USB 2.0"] },
      ],
    },
  ],

  description: {
    title: "HONOR Pad X8b (6/128GB)",
    blocks: [
      {
        paragraphs: [
          "The HONOR Pad X8b (6/128GB) is a stylish and performance-driven tablet designed for entertainment, productivity, and everyday use. With a large immersive display, powerful Snapdragon processor, and long-lasting battery, it delivers a smooth and enjoyable user experience for work and play.",
        ],
      },
      {
        heading: "11-Inch FullView Display with Eye Comfort Technology",
        paragraphs: [
          "Enjoy a stunning visual experience on the 11-inch TFT LCD (IPS) display with 1920×1200 resolution and 90Hz refresh rate. The HONOR Eye Comfort FullView Display is certified by T&Uuml;V Rheinland for low blue light and flicker-free viewing, reducing eye strain during long usage. With 500 nits brightness, 16.7 million colors, and dynamic dimming, this tablet is perfect for streaming, reading, and browsing.",
        ],
      },
      {
        heading: "Powerful Snapdragon 680 Processor",
        paragraphs: [
          "Powered by the Snapdragon 680 4G Mobile Platform, the HONOR Pad X8b ensures smooth multitasking and efficient performance. Paired with 6GB RAM and 128GB storage, it offers enough space and speed for apps, files, and entertainment. Running on MagicOS 10 (Android 16), this tablet provides a modern and user-friendly interface with improved performance, smart features, and enhanced security for a seamless experience.",
        ],
      },
      {
        heading: "Massive 10100mAh Battery for Long Usage",
        paragraphs: [
          "Stay productive and entertained all day with the 10100mAh battery. It supports 15W wired charging via Type-C and even offers 5W reverse charging, allowing you to power other devices when needed. Experience immersive sound with the quad-speaker system powered by HONOR Sound. Whether you’re watching movies or listening to music, the audio output is clear, rich, and well-balanced.",
        ],
      },
      {
        heading: "Slim, Lightweight & Durable Design",
        paragraphs: [
          "With a thickness of just 7.25mm and a weight of approximately 496g, the HONOR Pad X8b is sleek and easy to carry. It also features SGS-certified drop and crush resistance, ensuring durability for everyday use. The tablet comes with 5MP front and rear cameras, suitable for video calls and basic photography. It supports Wi-Fi 5 (dual-band) and Bluetooth 5.0, ensuring fast and stable connectivity.",
        ],
      },
      {
        heading: "Buying the HONOR Pad X8b (6/128GB) from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
