import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/samsung-galaxy-buds-4-pro.jpeg";
import img2 from "@/images/products/samsung-galaxy-buds-4-pro/02-samsung-galaxy-buds-4-pro-1.jpeg";
import img3 from "@/images/products/samsung-galaxy-buds-4-pro/03-samsung-galaxy-buds-4-pro-2.jpeg";
import img4 from "@/images/products/samsung-galaxy-buds-4-pro/04-samsung-galaxy-buds-4-pro-3.jpeg";
import img5 from "@/images/products/samsung-galaxy-buds-4-pro/05-samsung-galaxy-buds-4-pro-4.jpeg";
import img6 from "@/images/products/samsung-galaxy-buds-4-pro/06-samsung-galaxy-buds-4-pro-5.jpeg";
import img7 from "@/images/products/samsung-galaxy-buds-4-pro/07-samsung-galaxy-buds-4-pro-6.jpeg";
import img8 from "@/images/products/samsung-galaxy-buds-4-pro/08-samsung-galaxy-buds-4-pro-7.jpeg";

export const samsungGalaxyBuds4Pro: ProductDetail = {
  breadcrumb: [
    { label: "Headphone & Speaker", slug: "headphone-speaker" },
    { label: "Earbuds", slug: "earbuds" },
    { label: "Samsung", slug: "samsung-earbuds" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7, img8],
  inStock: true,

  highlights: [
    "Number of MIC: 6",
    "Bluetooth v6.1",
    "Active Noise Cancellation",
    "Case Battery Capacity: 530mAh",
  ],

  colors: [
    { name: "Black", hex: "#000000", image: img1 },
    { name: "White", hex: "#ffffff", image: img5 },
  ],

  emi: { months: 6, perMonth: 3833 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Samsung"] },
        { label: "Model Name", value: ["Buds4 Pro"] },
      ],
    },
    {
      title: "Main Feature",
      rows: [
        { label: "Connection Type", value: ["Wireless"] },
        { label: "Wireless Version", value: ["v6.1"] },
        { label: "Sensors", value: ["Accelerometer, Gyro Sensor, Hall Sensor, Pressure Sensor, Proximity Sensor, Touch Sensor, VPU(Voice Pickup Unit)"] },
        { label: "Microphone", value: ["6"] },
        { label: "Talk Time", value: ["Talk Time (Hours, ANC On): Up to 4.5", "Total Talk Time (Hours, ANC On): Up to 20", "Talk Time (Hours, ANC Off): Up to 5", "Total Talk Time (Hours, ANC Off): Up to 22"] },
        { label: "Music Time", value: ["Music Play Time (Hours, ANC On): Up to 6", "Total Music Play Time (Hours, ANC On): Up to 26", "Music Play Time (Hours, ANC Off): Up to 7", "Total Music Play Time (Hours, ANC Off): Up to 30"] },
        { label: "Battery Capacity", value: ["Earbud Battery Capacity: 61 (mAh, Typical)", "Case Battery Capacity: 530 (mAh, Typical)"] },
        { label: "Others", value: ["Speaker: Enhanced 2-way", "Ambient Sound: Yes", "Voice Detect: Yes", "360 Audio: Yes", "Siren Detect: Yes", "Adaptive EQ: Yes", "Adaptive ANC: Yes", "Super Wide Band: Yes", "Bluetooth Profiles: A2DP, AVRCP, HFP, PBP, TMAP", "LE Audio: Yes", "Auto Switch: Yes", "Samsung Find: Yes", "Bixby Voice Wake-up: Yes", "Neck Stretch Reminder: Yes", "Voice Command: Yes"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Water Resistant", value: ["IP57"] },
        { label: "Dimension", value: ["Earbud: 30.9 x 18.1 x 19.6", "Case: 51 x 28.3 x 51"] },
        { label: "Weight", value: ["Case: 44.3g"] },
        { label: "Colors", value: ["Black, White"] },
      ],
    },
  ],

  description: {
    title: "Samsung Galaxy Buds4 Pro",
    blocks: [
      {
        paragraphs: [
          "The Samsung Galaxy Buds4 Pro redefine premium wireless audio with intelligent features, powerful sound performance, and next-generation connectivity. Designed for seamless everyday use, these earbuds combine adaptive noise cancellation, immersive 360 audio, and crystal-clear call quality—making them a perfect choice for music lovers, gamers, and professionals alike.",
        ],
      },
      {
        heading: "Premium Sound with Enhanced 2-Way Speakers",
        paragraphs: [
          "The Samsung Galaxy Buds4 Pro come equipped with enhanced 2-way speakers that deliver a balanced and rich audio experience. From deep bass to clear vocals and detailed highs, these earbuds ensure every note sounds precise and immersive. With Adaptive EQ, the sound automatically adjusts based on your listening habits and surroundings, giving you a personalized audio experience every time.",
        ],
      },
      {
        heading: "Adaptive ANC and Intelligent Ambient Sound",
        paragraphs: [
          "Experience superior noise control with Adaptive Active Noise Cancellation (ANC) that intelligently blocks unwanted background noise. Whether you are traveling, working, or relaxing, the earbuds adapt in real time to your environment. The Ambient Sound mode allows you to hear important external sounds without removing the earbuds, making it ideal for conversations or staying aware in busy areas.",
        ],
      },
      {
        heading: "360 Audio and Super Wide Band Technology",
        paragraphs: [
          "The 360 Audio feature creates a surround sound experience, making movies, music, and games more immersive. Combined with Super Wide Band technology, you get enhanced clarity and spatial awareness, especially when watching content or gaming.",
        ],
      },
      {
        heading: "Advanced Call Clarity with 6 Microphones",
        paragraphs: [
          "The earbuds feature six high-quality microphones along with a dedicated Voice Pickup Unit (VPU) that captures your voice with exceptional clarity. Background noise is minimized, ensuring clear and natural conversations even in noisy environments.",
        ],
      },
      {
        heading: "Smart Sensors and AI Features",
        paragraphs: [
          "The Samsung Galaxy Buds4 Pro are packed with advanced sensors, including accelerometer, gyro, proximity, and touch sensors, enabling intuitive control and smart automation. Features like Voice Detect automatically lower media volume when you start speaking, while Siren Detect alerts you to important sounds around you. The Neck Stretch Reminder adds a unique health-focused feature, encouraging better posture during long listening sessions.",
        ],
      },
      {
        heading: "Next-Gen Wireless Connectivity with Bluetooth 6.1",
        paragraphs: [
          "With Bluetooth 6.1, the earbuds provide faster, more stable connections with lower latency and improved energy efficiency. Support for LE Audio ensures better audio quality with reduced power consumption. The Auto Switch feature allows seamless switching between Samsung devices, making multitasking effortless. Compatibility with multiple Bluetooth profiles ensures wide device support.",
        ],
      },
      {
        heading: "Long-Lasting Battery Life with Fast Charging",
        paragraphs: [
          "The Samsung Galaxy Buds4 Pro offer reliable battery performance for all-day use. With ANC enabled, you get up to 6 hours of music playback on the earbuds and up to 26 hours with the charging case. When ANC is turned off, playback extends up to 7 hours on the earbuds and 30 hours with the case. For calls, the earbuds provide up to 4.5 hours talk time with ANC and 5 hours without ANC, ensuring consistent communication throughout the day. The earbuds feature a 61mAh battery, while the case houses a 530mAh battery, providing extended usage without frequent charging.",
        ],
      },
      {
        heading: "Smart Ecosystem Features and Voice Control",
        paragraphs: [
          "Designed to work seamlessly within the Samsung ecosystem, these earbuds support Samsung Find, helping you locate your earbuds easily if misplaced. With Bixby Voice Wake-up and voice command support, you can control your music, calls, and settings hands-free. The earbuds also support multiple Bluetooth profiles, ensuring smooth connectivity across devices.",
        ],
      },
      {
        heading: "Buying the Samsung Galaxy Buds4 Pro from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
