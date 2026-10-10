import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/infinix-smart-20-4gb-128gb.jpeg";
import img2 from "@/images/products/infinix-smart-20-4gb-128gb/02-infinix-smart-20-2.jpeg";
import img3 from "@/images/products/infinix-smart-20-4gb-128gb/03-infinix-smart-20-3.jpeg";
import img4 from "@/images/products/infinix-smart-20-4gb-128gb/04-infinix-smart-20.jpeg";

export const infinixSmart204gb128gb: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "Infinix", slug: "infinix-mobile-phone" },
  ],
  gallery: [img1, img2, img3, img4],
  inStock: true,

  highlights: [
    "Display: 6.78 inches, IPS LCD",
    "Processor: MediaTek Helio G81 Ultimate",
    "Camera: 8MP, 8MP",
    "Features: Fingerprint (side-mounted)",
  ],

  colors: [
    { name: "Shadow Black", hex: "#565D67", image: img2 },
    { name: "Polaris Titanium", hex: "#BAB9B3", image: img3 },
    { name: "Cloudline Blue", hex: "#384289", image: img1 },
    { name: "Sunlike Orange", hex: "#FB8C39", image: img4 },
  ],

  emi: { months: 6, perMonth: 2833 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Infinix"] },
        { label: "Model Name", value: ["Smart 20"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["6.78 inches"] },
        { label: "Type", value: ["IPS a-si LCD"] },
        { label: "Resolution", value: ["HD+ 720*1576"] },
        { label: "Refresh Rate", value: ["45Hz/60Hz/90Hz/120Hz"] },
        { label: "Brightness", value: ["560 nits (TYP), 700 nits (HBM Brightness)"] },
        { label: "Features", value: ["SCREEN RATIO: 19.7:9（90.09%)", "COLOR GAMUT: 72% NTSC (TYP)", "TOUCH SAMPLING RATE: 120Hz(@60Hz Display), 180Hz(@90Hz Display), 240Hz(@120Hz Display)", "OTHER FEATURES: AOD, Dynamic Bar"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["MediaTek Helio G81 Ultimate"] },
        { label: "CPU Type", value: ["Octa-core (2x2.0GHz Cortex-A75 & 6x1.7GHz Cortex-A55"] },
        { label: "GPU", value: ["Mali G52"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["4GB"] },
        { label: "ROM", value: ["128GB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["8MP"] },
        { label: "Features", value: ["f/2.0, 1/4'' sensor, 1.12um, AF, Rear Dual Flash, AI Cam, Video, Dual Video, Portrait, Time-Lapse, Super Night, Pro, Panorama, Documents"] },
        { label: "Video Recording", value: ["2K 30FPS/1080P 30FPS/720P 30FPS"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["8MP"] },
        { label: "Features", value: ["f/2.0, 1/4'' sensor, 1.12um, FF, AI Cam, Video, Dual Video, Portrait, Time-Lapse, Super Night, Pro, Panorama, Documents, 2K 30FPS/1080P 30FPS/720P 30FPS"] },
      ],
    },
    {
      title: "Audio",
      rows: [
        { label: "Audio Features", value: ["Audio: DTS"] },
      ],
    },
    {
      title: "Network & AMP; Connectivity",
      rows: [
        { label: "SIM", value: ["2 nano SIMs + Micro SD"] },
        { label: "Network", value: ["4G/3G/2G"] },
        { label: "Wi-Fi", value: ["Wi-Fi 802.11 (a/b/g/n/ac)"] },
        { label: "Bluetooth", value: ["Yes"] },
        { label: "GPS", value: ["Yes"] },
        { label: "NFC", value: ["Yes"] },
        { label: "USB", value: ["USB Type-C"] },
        { label: "OTG", value: ["Yes"] },
        { label: "Audio Jack", value: ["3.5 Jack"] },
      ],
    },
    {
      title: "OS",
      rows: [
        { label: "Operating System", value: ["XOS16, Powered by Android 16"] },
      ],
    },
    {
      title: "Features",
      rows: [
        { label: "Fingerprint", value: ["Fingerprint (side-mounted)"] },
        { label: "Sensors", value: ["G-SENSOR: Yes", "E-COMPASS: Yes", "GYROSCOPE: Yes/By Software", "LIGHT SENSOR: Yes", "PROXIMITY SENSOR: Yes", "FINGERPRINT: Yes", "MOTOR: Yes", "INFRARED BLASTER: Yes"] },
        { label: "IP Rating", value: ["IP64"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["5200mAh (TYP)"] },
        { label: "Fast Charging", value: ["CHARGING: 10W Charger, 15W Supported", "REVERSE CHARGING: 5W Supported"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["167.7*78.8*7.7mm"] },
        { label: "Colors", value: ["Shadow Black, Polaris Titanium, Sunlike Orange, Cloudline Blue"] },
      ],
    },
  ],

  description: {
    title: "Infinix Smart 20 (4/128GB)",
    blocks: [
      {
        heading: "Massive 6.78-inch HD+ Display with 120Hz Refresh Rate",
        paragraphs: [
          "Enjoy immersive viewing on the large 6.78-inch IPS a-si LCD display with HD+ (720 × 1576) resolution. The ultra-smooth up to 120Hz refresh rate ensures fluid scrolling, smoother animations, and a better gaming experience. With up to 700 nits HBM brightness, the screen stays visible even under bright sunlight. The 19.7:9 screen ratio and 90.09% screen-to-body ratio make it perfect for watching YouTube, Netflix, and playing games. Features like Always-On Display (AOD) and Dynamic Bar add a modern, premium feel to the interface.",
        ],
      },
      {
        heading: "MediaTek Helio G81 Ultimate Processor for Smooth Performance",
        paragraphs: [
          "Powered by the MediaTek Helio G81 Ultimate chipset, this smartphone is built to handle daily tasks effortlessly. The octa-core CPU (2x2.0GHz Cortex-A75 & 6x1.7GHz Cortex-A55) combined with Mali G52 GPU ensures smooth app usage, responsive gaming, and efficient multitasking. With 4GB RAM and 128GB internal storage, you can store plenty of photos, videos, and apps. Need more space? The dedicated microSD card slot allows easy storage expansion.",
        ],
      },
      {
        heading: "8MP AI Dual Rear Camera with 8MP Front Camera",
        paragraphs: [
          "Capture your everyday moments with the 8MP AI rear camera featuring autofocus and dual flash. From portraits to night shots, the camera modes such as Super Night, Panorama, Time-Lapse, Pro Mode, and Documents help you get creative. Record crisp videos in 2K at 30FPS, or choose 1080p and 720p options for smooth playback. Dual Video mode allows you to record from both front and rear cameras simultaneously—great for vlogging and social media content. The 8MP selfie camera ensures bright and detailed self-portraits. AI features enhance your selfies automatically, while 2K video recording support makes it a solid option for video calls and online meetings.",
        ],
      },
      {
        heading: "Powerful 5200mAh Battery with Reverse Charging",
        paragraphs: [
          "Battery anxiety is a thing of the past with the 5200mAh large battery. Enjoy all-day usage including gaming, browsing, streaming, and calling without constantly looking for a charger. The device supports 15W fast charging (10W charger included) and even 5W reverse charging, allowing you to power up other devices in emergencies.",
        ],
      },
      {
        heading: "Modern Design with Slim Build",
        paragraphs: [
          "With dimensions of 167.7 × 78.8 × 7.7mm, the Infinix Smart 20 (4/128GB) offers a slim and comfortable grip despite its large display. The sleek body design makes it stylish yet practical for everyday use. Running on XOS 16 (based on Android 16), the phone provides a clean, customizable, and user-friendly interface. You get smart features, better privacy control, and optimized performance for a smoother smartphone experience.",
        ],
      },
      {
        heading: "Buying the Infinix Smart 20 (4/128GB) from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
