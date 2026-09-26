import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/vivo-y05-4gb-128gb.jpeg";
import img2 from "@/images/products/vivo-y05-4gb-128gb/02-vivo-y05-4gb-128gb-black.jpeg";
import img3 from "@/images/products/vivo-y05-4gb-128gb/03-vivo-y05-4gb-128gb-black-1.jpeg";
import img4 from "@/images/products/vivo-y05-4gb-128gb/04-vivo-y05-4gb-128gb-black-2.jpeg";
import img5 from "@/images/products/vivo-y05-4gb-128gb/05-vivo-y05-4gb-128gb-black-3.jpeg";
import img6 from "@/images/products/vivo-y05-4gb-128gb/06-vivo-y05-4gb-128gb-black-4.jpeg";
import img7 from "@/images/products/vivo-y05-4gb-128gb/07-vivo-y05-4gb-128gb-white.jpeg";
import img8 from "@/images/products/vivo-y05-4gb-128gb/08-vivo-y05-4gb-128gb-white-1.jpeg";
import img9 from "@/images/products/vivo-y05-4gb-128gb/09-vivo-y05-4gb-128gb-white-2.jpeg";
import img10 from "@/images/products/vivo-y05-4gb-128gb/10-vivo-y05-4gb-128gb-white-3.jpeg";
import img11 from "@/images/products/vivo-y05-4gb-128gb/11-vivo-y05-4gb-128gb-white-4.jpeg";
import img12 from "@/images/products/vivo-y05-4gb-128gb/12-vivo-y05-4gb-128gb-blue-1.jpeg";
import img13 from "@/images/products/vivo-y05-4gb-128gb/13-vivo-y05-4gb-128gb-blue-2.jpeg";
import img14 from "@/images/products/vivo-y05-4gb-128gb/14-vivo-y05-4gb-128gb-blue-3.jpeg";
import img15 from "@/images/products/vivo-y05-4gb-128gb/15-vivo-y05-4gb-128gb-blue-4.jpeg";

export const vivoY054gb128gb: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "Vivo", slug: "vivo" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15],
  inStock: true,

  highlights: [
    "Display: 17.13 cm (6.74 inches) LCD Processor: Unisoc T7225 (12 nm) Camera: 8 MP + 5MP Features: Side-mounted capacitive fingerprint sensor",
  ],

  colors: [
    { name: "Black", hex: "#000000", image: img2 },
    { name: "Platinum", hex: "#EEECE6", image: img7 },
    { name: "Blue", hex: "#035BBC", image: img1 },
  ],

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Vivo"] },
        { label: "Model Name", value: ["Y05"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["17.13 cm (6.74 inches)"] },
        { label: "Type", value: ["LCD"] },
        { label: "Resolution", value: ["1600 × 720"] },
        { label: "Refresh Rate", value: ["Up to 120 Hz"] },
        { label: "Brightness", value: ["1200 nits"] },
        { label: "Features", value: ["Color Gamut: 83% NTSC", "Pixel Density: 260 PPI", "Light-Emitting Material: LED", "Touch Screen: Capacitive multi-touch"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["T7225"] },
        { label: "CPU Speed", value: ["2 × 1.8 GHz + 6 × 1.8 GHz"] },
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
        { label: "Resolution", value: ["8 MP"] },
        { label: "Features", value: ["f/2.0, Rear flash, Photo, Night, Portrait, Video, Live Photo, Time-lapse, Pro, Pano, Documents"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["5 MP"] },
        { label: "Features", value: ["f/2.2, Photo, Night, Portrait, Video, Live Photo"] },
      ],
    },
    {
      title: "Audio",
      rows: [
        { label: "Audio Features", value: ["AAC, WAV, MP3, MIDI, VORBIS, APE, FLAC"] },
      ],
    },
    {
      title: "Network & AMP; Connectivity",
      rows: [
        { label: "SIM", value: ["Dual SIM Dual Standby (DSDS), 2 nano SIMs + 1 microSD"] },
        { label: "Network", value: ["2G GSM, 3G WCDMA, 4G TD-LTE, 4G FDD-LTE"] },
        { label: "Wi-Fi", value: ["2.4 GHz / 5 GHz"] },
        { label: "Bluetooth", value: ["Bluetooth 5.2"] },
        { label: "GPS", value: ["GPS, BeiDou, GLONASS, Galileo, QZSS"] },
        { label: "USB", value: ["USB 2.0, Type-C"] },
        { label: "OTG", value: ["Supported"] },
      ],
    },
    {
      title: "OS",
      rows: [
        { label: "Operating System", value: ["OriginOS 6.0 Android 16"] },
      ],
    },
    {
      title: "Features",
      rows: [
        { label: "Fingerprint", value: ["Side-mounted capacitive fingerprint sensor"] },
        { label: "Sensors", value: ["Accelerometer", "Ambient Light Sensor", "Proximity Sensor", "E-compass", "Infrared blaster"] },
        { label: "IP Rating", value: ["IP65"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["Li-ion battery 6500 mAh (TYP)"] },
        { label: "Fast Charging", value: ["15W"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["167.40 × 77.10 × 8.39 mm"] },
        { label: "Weight", value: ["209g"] },
        { label: "Body Material", value: ["Back Cover Material-Composite plastic sheet"] },
        { label: "Colors", value: ["Black, Platinum, Blue"] },
      ],
    },
  ],

  description: {
    title: "Vivo Y05 (4/128GB)",
    blocks: [
      {
        paragraphs: [
          "The Vivo Y05 (4/128GB) is a feature-packed budget smartphone designed for users who demand long battery life, smooth performance, and generous storage without stretching their budget. With a stunning 120Hz display, powerful 6500mAh battery, and modern Android experience, this latest Vivo mobile phone delivers excellent value for everyday use in Bangladesh. If you are searching for a stylish yet dependable smartphone at an affordable price, the Vivo Y05 is built to impress.",
        ],
      },
      {
        heading: "Expansive 6.74-Inch 120Hz Display for Immersive Viewing",
        paragraphs: [
          "Experience smooth visuals and vibrant clarity on the large 6.74-inch HD+ LCD display. With a resolution of 1600 × 720 and a refresh rate of up to 120Hz, the Vivo Y05 ensures fluid scrolling, seamless social media browsing, and enhanced gaming performance. Whether you are streaming videos, attending online classes, or reading articles, the higher refresh rate makes every interaction feel faster and more responsive. The display reaches up to 1200 nits brightness, allowing comfortable viewing even under bright sunlight. With 83% NTSC color gamut and 260 PPI pixel density, the screen delivers balanced colors and sharp details, creating an enjoyable entertainment experience for daily users.",
        ],
      },
      {
        heading: "Efficient Performance with T7225 Octa-Core Processor",
        paragraphs: [
          "Under the hood, the Vivo Y05 runs on the T7225 chipset featuring an octa-core CPU clocked at 2 × 1.8 GHz + 6 × 1.8 GHz. This efficient processor ensures stable and reliable performance for multitasking, web browsing, video streaming, and light gaming. With 4GB RAM, switching between apps feels smooth and lag-free. The generous 128GB internal storage allows you to store thousands of photos, videos, apps, and important files without worrying about space. For users who need additional storage, the dedicated microSD card slot offers expansion flexibility while still supporting dual SIM functionality.",
        ],
      },
      {
        heading: "Capture Clear Moments with Smart Cameras",
        paragraphs: [
          "The Vivo Y05 features an 8MP rear camera that captures clear and natural-looking photos in everyday lighting conditions. It is well-suited for capturing casual moments, social media updates, and daily photography. On the front, the 5MP selfie camera supports video calls, selfies, and online meetings with decent clarity. Whether you are connecting with friends or attending virtual classes, the front camera delivers reliable performance for communication needs.",
        ],
      },
      {
        heading: "Premium Design with IP65 Protection",
        paragraphs: [
          "Designed with practicality and durability in mind, the Vivo Y05 comes with an IP65 rating that provides protection against dust and water splashes. This makes the device more resilient for daily usage in different environments. The side-mounted capacitive fingerprint sensor offers quick and secure unlocking. In addition, useful sensors such as the accelerometer, ambient light sensor, proximity sensor, and E-compass enhance usability. The inclusion of an infrared blaster adds extra convenience, allowing you to control compatible home appliances directly from your smartphone.",
        ],
      },
      {
        heading: "Seamless Connectivity and Latest Software Experience",
        paragraphs: [
          "Stay connected with strong 4G LTE network support, including GSM and WCDMA compatibility. The dual SIM dual standby feature allows you to manage personal and professional numbers efficiently. Dual-band Wi-Fi support (2.4 GHz and 5 GHz) ensures faster and more stable internet connectivity, while Bluetooth 5.2 provides improved wireless performance. The Vivo Y05 runs on OriginOS 6.0 based on Android 16, delivering a refined and intuitive user interface. You can enjoy modern features, enhanced privacy settings, and optimized system performance for a smooth smartphone experience.",
        ],
      },
      {
        heading: "Massive 6500mAh Battery with Fast Charging Support",
        paragraphs: [
          "Battery life is one of the standout strengths of the Vivo Y05. Equipped with a powerful 6500mAh Li-ion battery, this smartphone easily lasts through heavy daily usage, including streaming, gaming, social networking, and long calls. The 15W fast charging support via USB Type-C ensures efficient power replenishment. The combination of large battery capacity and energy-efficient chipset makes this device ideal for users who prioritize extended battery backup without frequent charging interruptions.",
        ],
      },
      {
        heading: "Buying the Vivo Y05 (4/128GB) from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
