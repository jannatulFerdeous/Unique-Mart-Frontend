import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/vivo-y500.jpeg";
import img2 from "@/images/products/vivo-y500/02-vivo-y500-midnight-blue-1.jpeg";
import img3 from "@/images/products/vivo-y500/03-vivo-y500-midnight-blue-2.jpeg";
import img4 from "@/images/products/vivo-y500/04-vivo-y500-midnight-blue-3.jpeg";
import img5 from "@/images/products/vivo-y500/05-vivo-y500-midnight-blue-4.jpeg";
import img6 from "@/images/products/vivo-y500/06-vivo-y500-pearl-white.jpeg";
import img7 from "@/images/products/vivo-y500/07-vivo-y500-pearl-white-1.jpeg";
import img8 from "@/images/products/vivo-y500/08-vivo-y500-pearl-white-2.jpeg";
import img9 from "@/images/products/vivo-y500/09-vivo-y500-pearl-white-3.jpeg";
import img10 from "@/images/products/vivo-y500/10-vivo-y500-pearl-white-4.jpeg";

export const vivoY500: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "Vivo", slug: "vivo" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10],
  inStock: true,

  highlights: [
    "Display: 6.83 inches AMOLED",
    "Processor: Unisoc T7300 (6 nm)",
    "Camera: 50 MP + 2 MP + 32 MP",
    "Features: In-display optical fingerprint sensor",
  ],

  colors: [
    { name: "Midnight Blue", hex: "#40485D", image: img1 },
    { name: "Pearl White", hex: "#EDEDED", image: img6 },
  ],

  emi: { months: 12, perMonth: 3333 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Vivo"] },
        { label: "Model Name", value: ["Y500"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["17.35 cm (6.83 inches)"] },
        { label: "Type", value: ["AMOLED"] },
        { label: "Resolution", value: ["2800 × 1260"] },
        { label: "Refresh Rate", value: ["120 Hz"] },
        { label: "Brightness", value: ["2000 nits"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["Unisoc T7300 (6 nm)"] },
        { label: "CPU Type", value: ["Octa-core (2x2.2 GHz Cortex-A78 & 6x2.0 GHz Cortex-A55)"] },
        { label: "CPU Speed", value: ["2 × 2.2 GHz + 6 × 2.0 GHz"] },
        { label: "GPU", value: ["Mali-G57 MP2"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["6GB"] },
        { label: "ROM", value: ["128GB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["50 MP + 2 MP"] },
        { label: "Features", value: ["Photo, Portrait, Night, Video, 50 MP, Pano, Documents, Slo-mo, Time-lapse, Pro, Live Photo, Dual View, Underwater Photography"] },
        { label: "Video Recording", value: ["1080p@30fps"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["32 MP"] },
        { label: "Features", value: ["Photo, Portrait, Night, Video, Dual View, Live Photo"] },
        { label: "Video Recording", value: ["1080p@30fps"] },
      ],
    },
    {
      title: "Network & Connectivity",
      rows: [
        { label: "SIM", value: ["Dual SIM"] },
        { label: "Network", value: ["3G/4G"] },
        { label: "Wi-Fi", value: ["2.4 GHz / 5 GHz"] },
        { label: "Bluetooth", value: ["Bluetooth 5.4"] },
        { label: "GPS", value: ["Supported"] },
        { label: "NFC", value: ["Not supported"] },
        { label: "USB", value: ["USB 2.0"] },
        { label: "OTG", value: ["Supported"] },
      ],
    },
    {
      title: "OS",
      rows: [
        { label: "Operating System", value: ["OriginOS 6"] },
      ],
    },
    {
      title: "Features",
      rows: [
        { label: "Fingerprint", value: ["In-display optical fingerprint sensor"] },
        { label: "Sensors", value: ["Accelerometer", "Ambient Light Sensor", "E-compass", "Proximity Sensor", "Color Temperature Sensor", "Front color temperature sensor", "Motor", "Conventional", "Gyroscope"] },
        { label: "IP Rating", value: ["IP68/IP69"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["8100 mAh (TYP)"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["163.73 × 76.18 × 8.19 mm (Blue)", "163.73 × 76.18 × 8.29 mm (White)"] },
        { label: "Weight", value: ["210g"] },
        { label: "Body Material", value: ["Plastic composite sheet"] },
        { label: "Colors", value: ["Midnight Blue", "Pearl White"] },
      ],
    },
  ],

  description: {
    title: "Vivo Y500 (6/128GB)",
    blocks: [
      {
        paragraphs: [
          "The Vivo Y500 (6/128GB) is a powerful and stylish smartphone designed for everyday performance, smooth multitasking, and long-lasting battery life. If you're searching for a budget-friendly smartphone in Bangladesh with premium looks, reliable camera performance, and smooth user experience, the Vivo Y500 is an excellent choice.",
        ],
      },
      {
        heading: "Top Features of Vivo Y500 (6/128GB)",
        paragraphs: [
          "6GB RAM for smooth multitasking performance",
          "128GB storage for apps, photos, and videos",
          "Large display for immersive viewing experience",
          "Long-lasting battery for all-day usage",
          "AI-powered camera for clear photos",
          "Sleek and modern design",
        ],
      },
      {
        heading: "Smooth Performance for Daily Use",
        paragraphs: [
          "The Vivo Y500 (6/128GB) is built for users who want lag-free performance in daily tasks. From browsing and social media to video streaming and light gaming, the combination of 6GB RAM and optimized processor ensures smooth operation.",
        ],
      },
      {
        heading: "Why This Matters",
        paragraphs: [
          "Many users in Bangladesh face slow performance in budget phones. The Vivo Y500 solves this by offering balanced performance for everyday needs without overheating or lag.",
        ],
      },
      {
        heading: "Immersive Display for Entertainment",
        paragraphs: [
          "Enjoy your favorite content on a large, vibrant display that delivers clear visuals and comfortable viewing. Whether you're watching YouTube, scrolling Facebook, or attending online classes, the screen provides a smooth and enjoyable experience.",
        ],
      },
      {
        heading: "AI Camera for Everyday Photography",
        paragraphs: [
          "The Vivo Y500 features an intelligent camera system designed to capture sharp, vibrant photos in different lighting conditions.",
          "Clear daylight photography",
          "Enhanced portrait mode",
          "AI scene recognition",
          "Social media-ready images",
          "This makes it ideal for users searching for a good camera phone under budget in Bangladesh.",
        ],
      },
      {
        heading: "Long-Lasting Battery for All-Day Power",
        paragraphs: [
          "Battery anxiety is a common problem for smartphone users. The Vivo Y500 addresses this with a reliable battery that easily lasts a full day on regular usage.",
          "Perfect for:",
          "Students attending online classes",
          "Office users managing work apps",
          "Travelers needing backup power",
        ],
      },
      {
        heading: "Sleek Design That Feels Premium",
        paragraphs: [
          "The Vivo Y500 stands out with its modern, slim design and attractive finish. It feels comfortable in hand and looks more premium than most smartphones in this price range.",
        ],
      },
      {
        heading: "For Students",
        paragraphs: [
          "Perfect for online classes, note-taking, video streaming, and social media use.",
        ],
      },
      {
        heading: "For Professionals",
        paragraphs: [
          "Manage emails, apps, and communication smoothly throughout the day.",
        ],
      },
      {
        heading: "For Everyday Users",
        paragraphs: [
          "Enjoy browsing, calling, entertainment, and photography without performance issues.",
        ],
      },
      {
        heading: "Why Choose Vivo Y500 Over Other Budget Smartphones?",
        paragraphs: [
          "Compared to other smartphones in this segment, the Vivo Y500 (6/128GB) offers:",
          "Better RAM management for smoother multitasking",
          "More storage for long-term usage",
          "Stylish design compared to generic models",
          "Reliable performance from a trusted brand",
        ],
      },
      {
        heading: "Buying Guide: Is Vivo Y500 Worth Buying in Bangladesh?",
        paragraphs: [
          "If you're looking for a best budget smartphone in Bangladesh 2026, the Vivo Y500 is a smart choice. It solves key user problems such as:",
          "Slow performance in low-cost phones",
          "Limited storage issues",
          "Poor battery life",
          "Average camera quality",
          "Buy the Vivo Y500 if you want a reliable phone for daily use, social media, entertainment, and light productivity.",
        ],
      },
      {
        heading: "Is Vivo Y500 good for gaming?",
        paragraphs: [
          "Yes, it supports light to moderate gaming smoothly thanks to 6GB RAM.",
        ],
      },
      {
        heading: "How long does the battery last?",
        paragraphs: [
          "The battery easily lasts a full day with normal usage.",
        ],
      },
      {
        heading: "Is Vivo Y500 suitable for students?",
        paragraphs: [
          "Yes, it is ideal for students for online classes, apps, and entertainment.",
        ],
      },
      {
        heading: "Does Vivo Y500 have enough storage?",
        paragraphs: [
          "Yes, 128GB storage is more than enough for apps, photos, and videos.",
        ],
      },
      {
        paragraphs: [
          "Browse All Smartphones",
          "Explore Vivo Phones",
          "Shop Mobile Accessories",
          "Apple Devices",
        ],
      },
      {
        heading: "Buying the Vivo Y500 (6/128GB) from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
