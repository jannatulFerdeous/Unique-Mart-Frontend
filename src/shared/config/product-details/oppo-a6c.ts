import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/oppo-a6c.jpeg";
import img2 from "@/images/products/oppo-a6c/02-oppo-a6c-brown.jpeg";

export const oppoA6c: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "OPPO", slug: "oppo" },
  ],
  gallery: [img1, img2],
  inStock: true,

  highlights: [
    "Display: 6.75 inches LCD",
    "Processor: UNISOC T7250",
    "Camera: 13MP + 5MP",
    "Features: Side fingerprint sensor",
  ],

  colors: [
    { name: "Stone Brown", hex: "#453835", image: img2 },
    { name: "Feather White", hex: "#F6F6F7", image: img1 },
  ],

  emi: { months: 6, perMonth: 3333 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Oppo"] },
        { label: "Model Name", value: ["A6c"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["6.75 inches LCD"] },
        { label: "Resolution", value: ["HD+ 1570×720 Pixels"] },
        { label: "Refresh Rate", value: ["Maximum: 120Hz"] },
        { label: "Brightness", value: ["Normal brightness: 700 nits(Typical)"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["UNISOC T7250"] },
        { label: "CPU Type", value: ["8-core"] },
        { label: "GPU", value: ["Mali-G57@850MHz"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["4GB"] },
        { label: "ROM", value: ["64GB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["13MP"] },
        { label: "Features", value: ["f/2.2", "FOV 81°", "4P lens", "AF supported"] },
        { label: "Video Recording", value: ["1080P video: 30 fps", "720P video: 30 fps", "1080P TIME-LAPSE: 30 fps", "720P TIME-LAPSE: 30 fps"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["5MP"] },
        { label: "Features", value: ["f/2.2", "FOV 77°", "3P lens"] },
        { label: "Video Recording", value: ["720P video: 30 fps"] },
      ],
    },
    {
      title: "Network & AMP; Connectivity",
      rows: [
        { label: "SIM", value: ["Nano-SIM card, Nano-USIM card"] },
        { label: "Wi-Fi", value: ["Wi-Fi 5 (802.11ac) supported"] },
        { label: "Bluetooth", value: ["5.2"] },
        { label: "GPS", value: ["Yes"] },
        { label: "NFC", value: ["Unsupported"] },
        { label: "USB", value: ["USB Type-C"] },
        { label: "OTG", value: ["Supported"] },
        { label: "Audio Jack", value: ["3.5 mm jack"] },
      ],
    },
    {
      title: "OS",
      rows: [
        { label: "Operating System", value: ["Android V15"] },
      ],
    },
    {
      title: "Features",
      rows: [
        { label: "Fingerprint", value: ["Side fingerprint"] },
        { label: "Sensors", value: ["Proximity sensor", "Ambient light sensor", "E-compass", "Accelerometer", "Side fingerprint sensor"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["7000 mAh/27.16 Wh(Typical)", "6820 mAh/26.47 Wh(Rated)"] },
        { label: "Fast Charging", value: ["Supports(Max): 15 W Normal Charge, 15 W PD"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["166.48mm* 78.23mm*8.95mm"] },
        { label: "Weight", value: ["215g"] },
        { label: "Colors", value: ["Feather White"] },
      ],
    },
  ],

  description: {
    title: "Oppo A6c 4/64GB",
    blocks: [
      {
        paragraphs: [
          "If you're looking for a budget smartphone that delivers reliable performance, a big battery, and a smooth display, the Oppo A6c 4/64GB is a great choice. Designed for everyday users, this device combines modern features with a clean design, making it perfect for browsing, streaming, and staying connected without any hassle.",
        ],
      },
      {
        heading: "Large 6.75-inch Display with Smooth 120Hz Refresh Rate",
        paragraphs: [
          "The Oppo A6c features a 6.75-inch LCD display that provides a comfortable and immersive viewing experience. With an HD+ resolution of 1570×720 pixels, it delivers clear visuals for daily activities like watching videos and scrolling through social media. The 120Hz refresh rate ensures smoother animations and responsiveness, while the 700 nits brightness allows decent visibility even in bright environments.",
        ],
      },
      {
        heading: "Efficient Performance with UNISOC T7250 Processor",
        paragraphs: [
          "Powered by the UNISOC T7250 octa-core processor, the Oppo A6c offers stable performance for everyday tasks. Whether you're browsing the web, using apps, or enjoying light gaming, the device runs smoothly with the support of 4GB RAM. The Mali-G57 GPU further enhances the overall visual performance, ensuring a seamless user experience.",
        ],
      },
      {
        heading: "64GB Storage for Daily Essentials",
        paragraphs: [
          "With 64GB of internal storage, the Oppo A6c provides enough space to store your important apps, photos, and files. It’s an ideal option for users who need a dependable smartphone for daily usage without heavy storage demands.",
        ],
      },
      {
        heading: "13MP AI Camera for Everyday Photography",
        paragraphs: [
          "Capture your daily moments with the 13MP rear camera, which features autofocus support and an f/2.2 aperture. It delivers decent photos in good lighting conditions and supports 1080p video recording at 30fps. Additional features like time-lapse recording add creative options to your photography experience.",
        ],
      },
      {
        heading: "5MP Front Camera for Selfies and Video Calls",
        paragraphs: [
          "The 5MP front camera is suitable for casual selfies and video calls. It captures clear images for social media and supports 720p video recording, ensuring smooth communication with friends and family.",
        ],
      },
      {
        heading: "Massive 7000mAh Battery for Extended Usage",
        paragraphs: [
          "One of the key highlights of the Oppo A6c is its powerful 7000mAh battery, designed to last all day and beyond. Whether you're watching videos, browsing, or using apps, this battery keeps up with your routine. With 15W charging support, you can recharge efficiently and stay connected longer. Running on Android 15, the Oppo A6c offers a clean and user-friendly interface. It ensures smooth navigation, improved security, and access to modern features, making your smartphone experience simple and efficient.",
        ],
      },
      {
        heading: "Connectivity and Useful Features",
        paragraphs: [
          "The Oppo A6c supports dual Nano-SIM cards, making it convenient for managing multiple numbers. It includes Wi-Fi 5, Bluetooth 5.2, GPS, and USB Type-C connectivity. OTG support allows you to connect external devices easily, while the 3.5mm headphone jack is perfect for users who prefer wired audio.",
        ],
      },
      {
        heading: "Secure Design with Practical Build",
        paragraphs: [
          "The side-mounted fingerprint sensor ensures quick and secure access to your device. With a solid build measuring 8.95mm thickness and weighing 215g, the phone feels sturdy in hand. The Feather White color adds a clean and modern look, making it visually appealing.",
        ],
      },
      {
        heading: "Buying the Oppo A6c 4/64GB from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
