import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/xiaomi-pad-8.jpeg";
import img2 from "@/images/products/xiaomi-pad-8/02-xiaomi-pad-8-grey.jpeg";
import img3 from "@/images/products/xiaomi-pad-8/03-xiaomi-pad-8-grey-1.jpeg";
import img4 from "@/images/products/xiaomi-pad-8/04-xiaomi-pad-8-grey-2.jpeg";
import img5 from "@/images/products/xiaomi-pad-8/05-xiaomi-pad-8-grey-3.jpeg";
import img6 from "@/images/products/xiaomi-pad-8/06-xiaomi-pad-8-green.jpeg";
import img7 from "@/images/products/xiaomi-pad-8/07-xiaomi-pad-8-green-2.jpeg";
import img8 from "@/images/products/xiaomi-pad-8/08-xiaomi-pad-8-green-1.jpeg";
import img9 from "@/images/products/xiaomi-pad-8/09-xiaomi-pad-8-green-3.jpeg";
import img10 from "@/images/products/xiaomi-pad-8/10-xiaomi-pad-8-blue-1.jpeg";
import img11 from "@/images/products/xiaomi-pad-8/11-xiaomi-pad-8-blue-2.jpeg";
import img12 from "@/images/products/xiaomi-pad-8/12-xiaomi-pad-8-blue-3.jpeg";

export const xiaomiPad8: ProductDetail = {
  breadcrumb: [
    { label: "Tablets", slug: "tablets" },
    { label: "Xiaomi", slug: "xiaomi-tablet-pc" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12],
  inStock: true,

  highlights: [
    "Display: 11.2 Inches (2136 x 3200), IPS LCD, 144Hz, 800 nits",
    "Processor: Qualcomm SM8735 Snapdragon 8s Gen 4 (4 nm)",
    "RAM: 8GB, Internal Storage: 256GB",
    "Battery: 9200 mAh, 45W Wired Charging",
  ],

  colors: [
    { name: "Gray", hex: "#666666", image: img2 },
    { name: "Pine Green", hex: "#738375", image: img6 },
    { name: "Blue", hex: "#035BBC", image: img1 },
  ],

  emi: { months: 6, perMonth: 8833 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Xiaomi"] },
        { label: "Model Name", value: ["Pad 8"] },
      ],
    },
    {
      title: "Main Feature",
      rows: [
        { label: "Display Type", value: ["IPS LCD"] },
        { label: "Size", value: ["11.2 inches"] },
        { label: "Resolution", value: ["(2136 x 3200) 144Hz, HDR10, Dolby Vision, HDR Vivid, 800 nits (peak)"] },
        { label: "Processor", value: ["Qualcomm SM8735 Snapdragon 8s Gen 4 (4 nm)"] },
        { label: "RAM", value: ["8GB"] },
        { label: "Storage", value: ["256GB", "UFS 4.1"] },
        { label: "Connectivity", value: ["Wi-Fi, Bluetooth"] },
        { label: "Operating System", value: ["Android 16, HyperOS 3"] },
        { label: "Audio", value: ["4 speakers (Dolby Atmos)", "4 microphones", "Stereo Speakers"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimensions", value: ["251.2 x 173.4 x 5.8 mm (9.89 x 6.83 x 0.23 in)"] },
        { label: "Weight", value: ["485 g or 494 g (1.07 lb)"] },
        { label: "Color", value: ["Black, Blue, Green"] },
      ],
    },
    {
      title: "Camera",
      rows: [
        { label: "Front Camera", value: ["8 MP, f/2.3, (wide), 1/4.0\", 1.12µm"] },
        { label: "Rear Camera", value: ["13 MP, f/2.2, (wide), 1/3.06\", 1.12µm, PDAF"] },
        { label: "Video", value: ["Rear Camera: 4K@30fps, 1080p@30/60fps", "Front camera: 1080p@30fps"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Capacity", value: ["9200 mAh"] },
        { label: "Charging", value: ["45W wired, PD3.0, QC3+", "22.5 reverse wireless charging"] },
      ],
    },
    {
      title: "Special Features",
      rows: [
        { label: "Sensors", value: ["Accelerometer, gyro, proximity, compass"] },
        { label: "Bluetooth", value: ["Bluetooth 5.4, LHDC 5"] },
        { label: "WLAN", value: ["Wi-Fi 802.11 a/b/g/n/ac/6/7, dual-band, Wi-Fi Direct"] },
        { label: "USB", value: ["USB Type-C 3.2"] },
      ],
    },
  ],

  description: {
    title: "Xiaomi Pad 8",
    blocks: [
      {
        paragraphs: [
          "The Xiaomi Pad 8 is built for users who want a perfect blend of performance, entertainment, and productivity in one sleek tablet. With its powerful Snapdragon chipset, stunning high-refresh-rate display, and long-lasting battery, this device is ideal for gaming, streaming, online classes, and multitasking. Whether you're a student, professional, or entertainment lover, the Xiaomi Pad 8 (8/256GB) delivers a smooth and immersive experience every time you pick it up.",
        ],
      },
      {
        heading: "Stunning 11.2-Inch 144Hz Display for Ultimate Visual Experience",
        paragraphs: [
          "Enjoy crystal-clear visuals on the Xiaomi Pad 8’s 11.2-inch IPS LCD display, designed to bring content to life. With a sharp 2136 x 3200 resolution and a super-smooth 144Hz refresh rate, every scroll, swipe, and animation feels incredibly fluid. The support for HDR10, Dolby Vision, and HDR Vivid ensures vibrant colors and deep contrast, making it perfect for watching movies, gaming, or editing photos. With up to 800 nits peak brightness, the screen remains visible even in bright environments.",
        ],
      },
      {
        heading: "Next-Level Performance with Snapdragon 8s Gen 4",
        paragraphs: [
          "Powered by the advanced Qualcomm Snapdragon 8s Gen 4 processor built on a 4nm architecture, the Xiaomi Pad 8 offers lightning-fast performance. Paired with 8GB RAM and 256GB UFS 4.1 storage, it ensures seamless multitasking, faster app launches, and smooth gaming performance. Whether you're editing videos, running heavy apps, or switching between tasks, this tablet handles everything effortlessly.",
        ],
      },
      {
        heading: "Android 16 with HyperOS 3 for Smooth User Experience",
        paragraphs: [
          "The Xiaomi Pad 8 runs on Android 16 with HyperOS 3, providing a clean, optimized, and user-friendly interface. Enjoy enhanced customization, improved security, and better app optimization for a more responsive and intuitive experience.",
        ],
      },
      {
        heading: "Immersive Audio with Quad Speakers and Dolby Atmos",
        paragraphs: [
          "Experience rich, cinematic sound with the quad-speaker setup powered by Dolby Atmos. Whether you're watching movies, attending online meetings, or listening to music, the stereo speakers deliver clear and immersive audio. The inclusion of four microphones ensures crystal-clear voice capture for calls and recordings.",
        ],
      },
      {
        heading: "Massive 9200mAh Battery with Fast Charging",
        paragraphs: [
          "Stay productive and entertained all day with the powerful 9200mAh battery. The Xiaomi Pad 8 supports 45W fast wired charging, allowing you to quickly power up and get back to your tasks. It also features reverse wireless charging, adding extra convenience when you need to charge other devices on the go.",
        ],
      },
      {
        heading: "Premium Slim Design and Build Quality",
        paragraphs: [
          "With a sleek thickness of just 5.8mm and a lightweight design around 485g, the Xiaomi Pad 8 is easy to carry and comfortable to use for extended periods. Available in stylish colors like Black, Blue, and Green, it combines elegance with durability, making it perfect for both work and leisure.",
        ],
      },
      {
        heading: "Capture Moments with Reliable Cameras",
        paragraphs: [
          "The Xiaomi Pad 8 features a 13MP rear camera with PDAF, capable of recording 4K videos at 30fps, making it suitable for scanning documents or casual photography. The 8MP front camera ensures clear video calls and online meetings, supporting 1080p video recording.",
        ],
      },
      {
        heading: "Advanced Connectivity and Features",
        paragraphs: [
          "Stay connected with the latest Wi-Fi 6 and Wi-Fi 7 support, ensuring faster and more stable internet connectivity. With Bluetooth 5.4 and LHDC 5 support, you get high-quality wireless audio and improved device pairing. The USB Type-C 3.2 port allows fast data transfer and efficient charging.",
        ],
      },
      {
        heading: "Buying the Xiaomi Pad 8 (8/256GB) from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
