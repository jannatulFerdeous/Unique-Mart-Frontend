import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/iphone-air.jpeg";
import img2 from "@/images/products/iphone-air/02-iphone-air-sky-blue510.jpeg";
import img3 from "@/images/products/iphone-air/03-iphone-air-cloud-white642.jpeg";
import img4 from "@/images/products/iphone-air/04-iphone-air-light-gold769.jpeg";

export const iphoneAir: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "iPhone", slug: "iphone" },
  ],
  gallery: [img1, img2, img3, img4],
  inStock: true,

  highlights: [
    "Display Size: 6.5‑inch (diagonal), Super Retina XDR display",
    "Processor: Apple A19 Pro, 6‑core CPU",
    "Camera: 48.0 MP + 18.0 MP",
    "Features: Face ID, Barometer, High dynamic range gyro",
    "Up to 24 months EMI",
  ],

  colors: [
    { name: "Sky Blue", hex: "#E4EDF4", image: img2 },
    { name: "Space Black", hex: "#17161B", image: img1 },
    { name: "Cloud White", hex: "#F0F0F1", image: img3 },
    { name: "Light Gold", hex: "#FCEDE3", image: img4 },
  ],

  options: [
    { label: "Memory", values: ["256GB"] },
  ],

  emi: { months: 24, perMonth: 7917 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Apple"] },
        { label: "Model Name", value: ["iPhone Air"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["6.5‑inch (diagonal)"] },
        { label: "Type", value: ["Super Retina XDR display", "all‑screen OLED display"] },
        { label: "Resolution", value: ["2736‑by‑1260‑pixel resolution at 460 ppi"] },
        { label: "Refresh Rate", value: ["ProMotion technology with adaptive refresh rates up to 120 Hz"] },
        { label: "Brightness", value: ["1000 nits max brightness (typical)", "1600 nits peak brightness (HDR)", "3000 nits peak brightness (outdoor)", "1 nit minimum brightness"] },
        { label: "Protection", value: ["Scratch-resistant glass"] },
        { label: "Features", value: ["Fingerprint-resistant oleophobic coating", "Anti-reflective coating", "Support for display of multiple languages and characters simultaneously", "Dynamic Island", "Always-On display", "HDR display", "True Tone", "Wide color (P3)", "Haptic Touch", "2,000,000:1 contrast ratio (typical)"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["A19 Pro chip"] },
        { label: "CPU Type", value: ["6‑core CPU with 2 performance and 4 efficiency cores", "16‑core Neural Engine", "Hardware-accelerated ray tracing"] },
        { label: "GPU", value: ["5‑core GPU with Neural Accelerators"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["8GB"] },
        { label: "ROM", value: ["256GB, 512GB, 1TB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["48MP Fusion camera system"] },
        { label: "Features", value: ["48MP Fusion Main: 26 mm, ƒ/1.6 aperture, sensor-shift optical image stabilization, 100% Focus Pixels, support for super-high-resolution photos (24MP and 48MP)", "Also enables 12MP optical-quality 2x Telephoto: 52 mm, ƒ/1.6 aperture, sensor-shift optical image stabilization, 100% Focus Pixels", "Digital zoom up to 10x", "Customizable default lens (Fusion Main)", "Sapphire crystal lens cover", "True Tone flash", "Photonic Engine", "Deep Fusion", "Smart HDR 5", "Next-generation portraits with Focus and Depth Control", "Portrait Lighting with six effects", "Night mode", "Panorama (up to 63MP)", "Latest-generation Photographic Styles", "Wide color capture for photos and Live Photos", "Advanced red‑eye correction", "Auto image stabilization", "Burst mode", "Photo geotagging", "Image formats captured: HEIF and JPEG"] },
        { label: "Video Recording", value: ["4K Dolby Vision video recording at 24 fps, 25 fps, 30 fps, or 60 fps", "1080p Dolby Vision video recording at 25 fps, 30 fps, or 60 fps", "720p Dolby Vision video recording at 30 fps", "Action mode up to 2.8K Dolby Vision at 60 fps", "Slo‑mo video support for 1080p at 120 fps or 240 fps", "Dual Capture up to 4K Dolby Vision at 30 fps", "Time‑lapse video with stabilization", "Night mode Time-lapse", "QuickTake video up to 4K Dolby Vision at 60 fps", "Sensor-shift optical image stabilization for video", "Digital zoom up to 6x", "Audio zoom", "True Tone flash", "Cinematic video stabilization (4K, 1080p, and 720p)", "Continuous autofocus video", "Take 8MP still photos while recording 4K video", "Playback zoom", "Video formats recorded: HEVC and H.264", "Spatial Audio and stereo recording", "Wind noise reduction", "Audio Mix"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["18MP Center Stage camera"] },
        { label: "Features", value: ["ƒ/1.9 aperture", "Autofocus with Focus Pixels", "Retina Flash", "Tap to zoom and rotate", "Center Stage for photos", "Ultra-stabilized video", "Dual Capture", "Center Stage for video calls", "Photonic Engine", "Deep Fusion", "Smart HDR 5", "Next-generation portraits with Focus and Depth Control", "Portrait Lighting with six effects", "Animoji and Memoji", "Night mode", "Latest-generation Photographic Styles", "Wide color capture for photos and Live Photos", "Lens correction", "Auto image stabilization", "Burst mode", "4K Dolby Vision video recording at 24 fps, 25 fps, 30 fps, or 60 fps", "1080p Dolby Vision video recording at 25 fps, 30 fps, or 60 fps", "Slo-mo video support for 1080p at 120 fps", "Time‑lapse video with stabilization", "Night mode Time-lapse", "QuickTake video up to 4K at 60 fps in Dolby Vision", "Cinematic video stabilization (4K, 1080p, and 720p)", "Spatial Audio and stereo recording", "Wind noise reduction", "Audio Mix"] },
      ],
    },
    {
      title: "Audio",
      rows: [
        { label: "Speaker", value: ["Spatial Audio playback"] },
        { label: "Audio Features", value: ["Supported formats include AAC, APAC, MP3, Apple Lossless, FLAC, Dolby Digital, Dolby Digital Plus, and Dolby Atmos", "Spatial Audio playback with compatible AirPods", "User‑configurable maximum volume limit"] },
      ],
    },
    {
      title: "Network & AMP; Connectivity",
      rows: [
        { label: "SIM", value: ["Dual eSIM (two active eSIMs", "stores eight or more eSIMs)15", "iPhone Air uses advanced eSIM technology for more convenience and security (not compatible with physical SIM cards)."] },
        { label: "Network", value: ["GSM / CDMA / HSPA / EVDO / LTE / 5G"] },
        { label: "Wi-Fi", value: ["FDD‑5G NR (Bands n1, n2, n3, n5, n7, n8, n12, n14, n20, n25, n26, n28, n29, n30, n66, n70, n71, n75)", "TDD‑5G NR (Bands n38, n40, n41, n48, n53, n77, n78, n79)", "5G NR mmWave (Bands n258, n260, n261)", "FDD‑LTE (Bands 1, 2, 3, 4, 5, 7, 8, 12, 13, 14, 17, 18, 19, 20, 25, 26, 28, 29, 30, 32, 66, 71)", "TDD‑LTE (Bands 34, 38, 39, 40, 41, 42, 48, 53)", "UMTS/HSPA+/DC-HSDPA (850, 900, 1700/2100, 1900, 2100 MHz)", "GSM/EDGE (850, 900, 1800, 1900 MHz)", "5G (sub-6 GHz and mmWave) with 4x4 MIMO9", "Gigabit LTE with 4x4 MIMO9", "Wi‑Fi 7 (802.11be) with 2x2 MIMO10", "Thread networking technology"] },
        { label: "Bluetooth", value: ["Bluetooth 6"] },
        { label: "GPS", value: ["Precision dual-frequency GPS (GPS, GLONASS, Galileo, QZSS, BeiDou, and NavIC)"] },
        { label: "NFC", value: ["Supported"] },
        { label: "USB", value: ["USB 2 (up to 480Mb/s)"] },
        { label: "OTG", value: ["Supported"] },
        { label: "Audio Jack", value: ["Type C"] },
      ],
    },
    {
      title: "OS",
      rows: [
        { label: "Operating System", value: ["iOS 26", "iOS is the world’s most personal and secure mobile operating system, packed with powerful features and designed to protect your privacy."] },
      ],
    },
    {
      title: "Features",
      rows: [
        { label: "Sensors", value: ["Face ID", "Barometer", "High dynamic range gyro", "High-g accelerometer", "Proximity sensor", "Dual ambient light sensors"] },
        { label: "IP Rating", value: ["Rated IP68 (maximum depth of 6 meters up to 30 minutes) under IEC standard 60529"] },
        { label: "Other Features", value: ["Face ID: Enabled by TrueDepth technology in the Center Stage front camera", "NFC with reader mode", "Express Cards with power reserve", "Camera controls: Exposure, Depth, Zoom, Cameras, Styles, Tone", "Action button features: Silent mode, Focus, Camera, Visual Intelligence, 12 Flashlight, Voice Memo, Recognize Music, Translate, Magnifier, Controls, Shortcut, or Accessibility"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["Video playback: Up to 27 hours", "Video playback: with iPhone Air MagSafe battery6: Up to 40 hours", "Video playback (streamed): Up to 22 hours", "Video playback (streamed) with iPhone Air MagSafe battery: Up to 35 hours", "Built-in rechargeable lithium-ion battery"] },
        { label: "Fast Charging", value: ["Up to 50% charge in 30 minutes7 with 20W adapter or higher (available separately) paired with USB‑C charging cable, or 30W adapter or higher paired with MagSafe Charger (both available separately)", "MagSafe wireless charging up to 20W", "Qi2 wireless charging up to 20W", "Magnet array"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["Width: 2.94 inches (74.7 mm)", "Height: 6.15 inches (156.2 mm)", "Depth: 0.22 inch (5.64 mm)"] },
        { label: "Weight", value: ["5.82 ounces (165 grams)"] },
        { label: "Colors", value: ["Space Black, Cloud White, Light Gold, Sky Blue"] },
      ],
    },
  ],

  description: {
    title: "Latest iPhone Air in Bangladesh",
    blocks: [
      {
        heading: "Best iPhone Air Features",
        paragraphs: [
          "The iPhone Air offers several features that make it stand out, especially for those who want a premium Apple experience in a lighter, simpler package.",
        ],
      },
      {
        heading: "Lightweight and Elegant Design",
        paragraphs: [
          "Weighing just 165 grams, the iPhone Air is Apple’s lightest flagship yet. This Apple iPhone is one the thinnest mobile phones also. Its titanium frame provides extra durability without adding bulk, and the Ceramic Shield glass keeps it scratch and impact resistant. The IP68 rating ensures water and dust resistance, letting you use it confidently in everyday conditions.",
        ],
      },
      {
        heading: "Single 48MP Camera with Advanced Capabilities",
        paragraphs: [
          "Even with a single rear camera, the iPhone Air delivers professional-quality photos. The wide 48MP lens has sensor-shift OIS for stability and sharp detail, while low-light photography is significantly improved compared to previous Air models. The front camera also supports HDR, Dolby Vision, and Center Stage, making selfies, video calls, and spatial videos crisp and clear.",
        ],
      },
      {
        heading: "A19 Pro Chip for Smooth Performance",
        paragraphs: [
          "The A19 Pro chipset powers everything efficiently, from multitasking to mobile gaming. Combined with 12GB RAM and storage options of 256GB, 512GB, and 1TB, the iPhone Air offers a fast, reliable experience for daily use. Even the iPhone Air 256GB base variant is powerful enough for most users while being more affordable.",
        ],
      },
      {
        heading: "Brilliant Display",
        paragraphs: [
          "The 6.5-inch LTPO Super Retina XDR OLED display supports 120Hz refresh rate, HDR10, and Dolby Vision. Peak brightness reaches 3000 nits, so content stays sharp and vibrant outdoors. Text, images, and videos look crisp thanks to 460 PPI density, and the anti-reflective coating reduces glare for better viewing in any lighting.",
        ],
      },
      {
        heading: "Battery and Charging",
        paragraphs: [
          "The iPhone Air features a 3149 mAh battery, offering a full day of usage even for heavy users. Fast wired charging reaches 50% in 30 minutes, while MagSafe wireless charging also reaches 50% in the same time. Reverse wired charging is supported for smaller devices, making it a flexible choice for on-the-go power needs.",
        ],
      },
      {
        heading: "Software and Connectivity",
        paragraphs: [
          "Running iOS 26, the iPhone Air ensures smooth navigation and access to Apple-exclusive features. Connectivity options include Wi-Fi 7, Bluetooth 6.0, USB-C 2.0, and Ultra Wideband Gen2 for spatial awareness. Emergency SOS and Find My via satellite add extra security, while NFC supports Apple Pay for fast, safe transactions.",
        ],
      },
      {
        heading: "What storage options are available for iPhone Air?",
        paragraphs: [
          "The iPhone Air comes in 256GB, 512GB, and 1TB variants, all with 12GB RAM for smooth performance.",
        ],
      },
      {
        heading: "Does the iPhone Air support 5G?",
        paragraphs: [
          "Yes, the iPhone Air supports 5G, LTE, HSPA, and EV-DO, ensuring fast connectivity wherever you go.",
        ],
      },
      {
        heading: "Buying the iPhone Air from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
