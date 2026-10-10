import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/oppo-a6.jpeg";
import img2 from "@/images/products/oppo-a6/02-oppo-a6-blue-2547.jpeg";
import img3 from "@/images/products/oppo-a6/03-oppo-a6-gold-2178.jpeg";
import img4 from "@/images/brands/oppo-a6-8gb-256gb.jpeg";
import img5 from "@/images/products/oppo-a6/05-oppo-a6-gold-1602.jpeg";

export const oppoA6: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "OPPO", slug: "oppo" },
  ],
  gallery: [img1, img2, img3, img4, img5],
  inStock: true,

  highlights: [
    "Display: 6.75 inches, IPS Display",
    "Processor: Qualcomm Snapdragon®685 Mobile Platform",
    "Camera: 50MP + 2MP + 8MP",
    "Features: Side-mounted fingerprint sensor",
  ],

  colors: [
    { name: "Sapphire Blue", hex: "#3B6295", image: img1 },
    { name: "Aurora Gold", hex: "#DDC8B6", image: img4 },
  ],

  emi: { months: 12, perMonth: 2750 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["OPPO"] },
        { label: "Model Name", value: ["A6"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["6.75 inches"] },
        { label: "Type", value: ["LCD"] },
        { label: "Resolution", value: ["HD+ 1570 × 720 Pixels"] },
        { label: "Refresh Rate", value: ["Maximum: 120Hz"] },
        { label: "Brightness", value: ["Normal brightness: 800nits (Typical)", "HBM: 1125nits (Typical)"] },
        { label: "Features", value: ["Screen Ratio: 90.6%", "Touch Sampling Rate:", "Maximum: 240Hz", "Default: 120Hz", "Colour Gamut", "Vivid mode: 85% DCI-P3", "Natural mode: 100% sRGB", "Colour Depth: 16.7 million colours (8-bit)", "Pixel Density: 256 PPI"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["Qualcomm Snapdragon®685 Mobile Platform"] },
        { label: "CPU Speed", value: ["8 cores"] },
        { label: "GPU", value: ["Adreno™ 610@1.26GHz"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["8GB"] },
        { label: "ROM", value: ["128GB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["Wide angle: 50MP", "f/1.8", "FOV 76°", "5P lens", "AF supported", "Monochrome: 2MP", "f/2.4", "FOV 89°", "3P lens"] },
        { label: "Features", value: ["Photo, Video, Portrait, Night, PANO, SLO-MO, Dual-view video, TIME-LAPSE, STICKER, HI-RES, Google Lens, Underwater, PRO"] },
        { label: "Video Recording", value: ["1080P video: 30fps", "720P video: 30fps", "720P SLO-MO video: 120fps, except 4G RAM", "1080P TIME-LAPSE: 30fps", "Supports Dual-view video shooting, except 4G RAM", "Supports video zoom shooting: up to 10x digital zoom"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["8MP", "f/2.0", "FOV 80°", "4P lens"] },
        { label: "Features", value: ["Photo, Video, Portrait, Night, PANO, Dual-view video, TIME-LAPSE, STICKER, Retouch, Screen Fill Light, HI-RES"] },
        { label: "Video Recording", value: ["1080P video: 30fps", "720P video: 30fps", "1080P TIME-LAPSE: 30fps", "Supports Dual-view video shooting, except 4G RAM"] },
      ],
    },
    {
      title: "Network & AMP; Connectivity",
      rows: [
        { label: "SIM", value: ["Nano-SIM card, Nano-USIM card"] },
        { label: "Wi-Fi", value: ["Wi-Fi 5 (802.11ac) supported", "802.11a/b/g/n supported", "Wi-Fi Display supported", "WLAN Tethering supported"] },
        { label: "Bluetooth", value: ["Bluetooth® 5.0, Low Energy"] },
        { label: "GPS", value: ["Beidou, GPS, GLONASS, Galileo, QZSS", "Supports A-GPS assisted positioning, WLAN positioning, Cellular network positioning, A-GNSS assisted positioning"] },
        { label: "USB", value: ["Type-C"] },
        { label: "OTG", value: ["Supported"] },
        { label: "Audio Jack", value: ["Type-C"] },
      ],
    },
    {
      title: "OS",
      rows: [
        { label: "Operating System", value: ["ColorOS 15.0"] },
      ],
    },
    {
      title: "Features",
      rows: [
        { label: "Fingerprint", value: ["Supported"] },
        { label: "Sensors", value: ["Proximity sensor", "Ambient light sensor", "E-compass", "Accelerometer", "Side fingerprint sensor"] },
        { label: "IP Rating", value: ["IP69"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["7000mAh/27.44Wh (Typical)", "6830mAh/26.78Wh (Rated)"] },
        { label: "Fast Charging", value: ["Supports (Max): 45W SUPERVOOCTM", "Compatible with: 33W and below SUPERVOOCTM, 33W PPS, 15W VOOCTM, 13.5W PD, 13.5W QC"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["Height: about 166.61mm", "Width: about 78.51mm", "Thickness: about 8.61mm"] },
        { label: "Weight", value: ["about 215g"] },
        { label: "Colors", value: ["Sapphire Blue | Aurora Gold"] },
      ],
    },
  ],

  description: {
    title: "OPPO A6 (8/128GB)",
    blocks: [
      {
        paragraphs: [
          "The OPPO A6 (8/128GB) arrives as a fresh blend of performance, design, and unbeatable value. Whether you're scrolling, gaming, watching content, or capturing memories, this smartphone stands out with a vibrant 6.75-inch display, a massive 7000mAh battery, Snapdragon power, and OPPO’s smooth ColorOS 15.0 experience. It’s the ideal choice for users who want speed, stamina, and style without stretching their budget.",
        ],
      },
      {
        heading: "Key Features of OPPO A6",
        paragraphs: [
          "The OPPO A6 (8/128GB) brings your content to life with a 6.75-inch LCD screen offering crisp HD+ resolution at 1570 × 720 pixels. With a maximum refresh rate of 120Hz, everything feels fluid—scrolling, gaming, or streaming. Its typical brightness reaches 800 nits, while HBM enhances clarity all the way to 1125 nits under bright sunlight. A 90.6% screen-to-body ratio ensures an immersive experience, supported by a high 240Hz touch sampling rate for precise and fast touch response. Colours appear natural and vibrant with 85% DCI-P3 in vivid mode and full 100% sRGB support in natural mode, backed by 16.7 million colour depth.",
          "Size: 6.75 inches",
          "Type: LCD",
          "Resolution: HD+ 1570 × 720 pixels",
          "Refresh Rate: Up to 120Hz",
          "Brightness: 800 nits (typical), 1125 nits HBM",
          "Screen Ratio: 90.6%",
          "Touch Sampling Rate: 240Hz (max), 120Hz (default)",
          "Colour Gamut: 85% DCI-P3 (Vivid), 100% sRGB (Natural)",
          "Colour Depth: 16.7 million colours (8-bit)",
          "Pixel Density: 256 PPI",
          "Chipset: Qualcomm Snapdragon® 685",
          "CPU: 8-core",
          "GPU: Adreno™ 610 @ 1.26GHz",
          "RAM: 8GB",
          "ROM: 128GB",
          "Main Camera: 50MP, f/1.8, FOV 76°, 5P lens, AF",
          "Resolution: 8MP, f/2.0, FOV 80°, 4P lens",
          "SIM: Nano-SIM, Nano-USIM",
          "Wi-Fi: Wi-Fi 5 (802.11ac), 802.11a/b/g/n, Wi-Fi Display, WLAN tethering",
          "Bluetooth: Bluetooth® 5.0 (Low Energy)",
          "GPS: GPS, GLONASS, Beidou, Galileo, QZSS",
          "Positioning Support: A-GPS, WLAN, Cellular network, A-GNSS",
          "USB: Type-C",
          "OTG: Supported",
          "Audio: Type-C audio output",
        ],
      },
      {
        heading: "Reliable Power with Snapdragon® 685 Performance",
        paragraphs: [
          "Inside the OPPO A6 (8/128GB), the Qualcomm Snapdragon® 685 chipset delivers reliable speed through an 8-core CPU and Adreno™ 610 GPU clocked at 1.26GHz. The device handles everyday multitasking, gaming, and entertainment smoothly, and its 8GB RAM paired with 128GB internal storage ensures you have the space and speed you need daily. This combination makes the OPPO A6 an excellent pick for users who want long-term performance without slowdowns.",
        ],
      },
      {
        heading: "Capture Beautiful Shots with Camera",
        paragraphs: [
          "The rear camera system of the OPPO A6 includes a sharp 50MP f/1.8 main lens with autofocus and a 2MP monochrome sensor for depth and detail. Its feature suite includes Night mode, Portrait, PANO, SLO-MO, PRO mode, Underwater capture, Google Lens, and high-resolution imaging. Video recording supports 1080p at 30fps, and you can zoom digitally up to 10x. Dual-view video adds a creative touch by using both front and rear cameras simultaneously. The 8MP front camera delivers clear selfies with an f/2.0 aperture and an 80° field of view. With Portrait mode, Retouch, Screen Fill Light, Night mode, and Dual-view, the OPPO A6 (8/128GB) makes your content crisp and social-media-ready. Video recording remains smooth at 1080p and 720p at 30fps, with time-lapse support for creative moments.",
        ],
      },
      {
        heading: "Fast and Smooth Connectivity",
        paragraphs: [
          "The OPPO A6 supports Nano-SIM and Nano-USIM with reliable VoLTE compatibility. Wi-Fi 5 ensures faster wireless performance, while Bluetooth® 5.0 maintains stable connections for earbuds, smartwatches, and accessories. Navigation stays precise with multi-system positioning including GPS, GLONASS, Galileo, Beidou, QZSS, and advanced A-GPS support. The USB Type-C port handles data, charging, and OTG accessories effortlessly.",
        ],
      },
      {
        heading: "Fluid User Experience",
        paragraphs: [
          "Running on ColorOS 15.0, the OPPO A6 offers a clean, responsive interface with practical features that enhance multitasking, security, and personalization. The side fingerprint sensor ensures quick unlocking, and additional sensors like an accelerometer, E-compass, proximity, and ambient light enhance accuracy in daily use.",
        ],
      },
      {
        heading: "Massive 7000mAh Battery with 45W SUPERVOOC Fast Charging",
        paragraphs: [
          "Battery life is one of the strongest advantages of the OPPO A6 (8/128GB). Its huge 7000mAh battery provides all-day power and more. Charging is fast with 45W SUPERVOOC support, giving you more time using the phone and less time waiting. It is further compatible with 33W PPS, 15W VOOC, and multiple PD/QC charging standards, making it flexible with chargers you already own.",
        ],
      },
      {
        heading: "Built Strong with an IP69 Rating",
        paragraphs: [
          "Durability is a highlight of the OPPO A6. An IP69 rating means the device is engineered to handle dust and high-pressure water exposure, giving you peace of mind in unexpected conditions. Weighing about 215g and measuring 8.61mm thick, the phone maintains a comfortable grip despite its large battery.",
        ],
      },
      {
        heading: "Buying the OPPO A6 (8/128GB) from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
