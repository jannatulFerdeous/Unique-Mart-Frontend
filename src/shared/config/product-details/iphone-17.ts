import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/iphone-17.jpeg";
import img2 from "@/images/products/iphone-17/03-apple-iphone-17-black717.jpeg";
import img3 from "@/images/products/iphone-17/04-apple-iphone-17-lavender364.jpeg";
import img4 from "@/images/products/iphone-17/05-iphone-17-white918.jpeg";
import img5 from "@/images/products/iphone-17/06-apple-iphone-17-sage807.jpeg";

export const iphone17: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "iPhone", slug: "iphone" },
  ],
  gallery: [img1, img2, img3, img4, img5],
  inStock: true,

  highlights: [
    "Display Size: 6.3 inches, 97.2 cm",
    "Processor: A19 chip",
    "Camera: 48.0 MP + 48.0 MP + 18.0 MP",
    "Features: Face ID, Barometer, High dynamic range gyro",
  ],

  colors: [
    { name: "Mist Blue", hex: "#BFCACD", image: img1 },
    { name: "Black", hex: "#000000", image: img2 },
    { name: "Lavender", hex: "#E6E6FA", image: img3 },
    { name: "White", hex: "#ffffff", image: img4 },
    { name: "Sage", hex: "#B3BE94", image: img5 },
  ],

  options: [
    { label: "Storage", values: ["256GB"] },
  ],

  emi: { months: 24, perMonth: 7500 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Apple"] },
        { label: "Model Name", value: ["iPhone 17"] },
      ],
    },
    {
      title: "Display",
      rows: [
        { label: "Size", value: ["6.3‑inch (diagonal)"] },
        { label: "Type", value: ["Super Retina XDR display", "all‑screen OLED display"] },
        { label: "Resolution", value: ["2622‑by‑1206-pixel resolution at 460 ppi"] },
        { label: "Refresh Rate", value: ["ProMotion technology with adaptive refresh rates up to 120Hz"] },
        { label: "Brightness", value: ["1000 nits max brightness (typical)", "1600 nits peak brightness (HDR)", "3000 nits peak brightness (outdoor)", "1 nit minimum brightness"] },
        { label: "Protection", value: ["Ceramic Shield glass (2025 gen)"] },
        { label: "Features", value: ["Fingerprint-resistant oleophobic coating", "Anti-reflective coating", "Support for display of multiple languages and characters simultaneously", "Dynamic Island", "Always-On display", "HDR display", "True Tone", "Wide color (P3)", "Haptic Touch", "2,000,000:1 contrast ratio (typical)"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["A19 chip"] },
        { label: "CPU Type", value: ["6‑core CPU with 2 performance and 4 efficiency cores", "5‑core GPU with Neural Accelerators", "16‑core Neural Engine", "Hardware-accelerated ray tracing"] },
        { label: "GPU", value: ["Apple GPU (5-core graphics)"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "RAM", value: ["8GB"] },
        { label: "ROM", value: ["128GB, 256GB, 512GB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["48MP Dual Fusion camera system"] },
        { label: "Features", value: ["48MP Fusion Main: 26 mm, ƒ/1.6 aperture, sensor-shift optical image stabilization, 100% Focus Pixels, support for super-high-resolution photos (24MP and 48MP)", "Also enables 12MP optical-quality 2x Telephoto: 52 mm, ƒ/1.6 aperture, sensor-shift optical image stabilization, 100% Focus Pixels", "48MP Fusion Ultra Wide: 13 mm, ƒ/2.2 aperture and 120° field of view, Hybrid Focus Pixels, support for super-high-resolution photos (24MP and 48MP)", "2x optical zoom in, 2x optical zoom out", "4x optical zoom range", "Digital zoom up to 10x", "Sapphire crystal lens cover", "True Tone flash", "Photonic Engine", "Deep Fusion", "Smart HDR 5", "Next-generation portraits with Focus and Depth Control", "Portrait Lighting with six effects", "Night mode", "Panorama (up to 63MP)", "Latest-generation Photographic Styles", "Spatial photos", "48MP macro photography", "Wide color capture for photos and Live Photos", "Lens correction (Fusion Ultra Wide)", "Advanced red-eye correction", "Auto image stabilization", "Burst mode", "Photo geotagging", "Image formats captured: HEIF and JPEG"] },
        { label: "Video Recording", value: ["4K Dolby Vision video recording at 24 fps, 25 fps, 30 fps, or 60 fps", "1080p Dolby Vision video recording at 25 fps, 30 fps, or 60 fps", "720p Dolby Vision video recording at 30 fps", "Cinematic mode up to 4K Dolby Vision at 30 fps", "Action mode up to 2.8K Dolby Vision at 60 fps", "Macro video recording, including slo-mo and time-lapse", "Slo‑mo video support for 1080p at 120 fps or 240 fps", "Spatial video recording at 1080p at 30 fps", "Dual Capture up to 4K Dolby Vision at 30 fps", "Time‑lapse video with stabilization", "Night mode Time-lapse", "QuickTake video up to 4K Dolby Vision at 60 fps", "Sensor-shift optical image stabilization for video (Fusion Main)", "Digital zoom up to 6x", "Audio zoom", "True Tone flash", "Cinematic video stabilization (4K, 1080p, and 720p)", "Continuous autofocus video", "Take 8MP still photos while recording 4K video", "Playback zoom", "Video formats recorded: HEVC and H.264", "Spatial Audio and stereo recording", "Wind noise reduction", "Audio Mix"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["18MP Center Stage camera"] },
        { label: "Features", value: ["ƒ/1.9 aperture", "Autofocus with Focus Pixels", "Retina Flash", "Tap to zoom and rotate", "Center Stage for photos", "Ultra-stabilized video", "Dual Capture", "Center Stage for video calls", "Photonic Engine", "Deep Fusion", "Smart HDR 5", "Next-generation portraits with Focus and Depth Control", "Portrait Lighting with six effects", "Animoji and Memoji", "Night mode", "Latest-generation Photographic Styles", "Wide color capture for photos and Live Photos", "Lens correction", "Auto image stabilization", "Burst mode", "4K Dolby Vision video recording at 24 fps, 25 fps, 30 fps, or 60 fps", "1080p Dolby Vision video recording at 25 fps, 30 fps, or 60 fps", "Cinematic mode up to 4K Dolby Vision at 30 fps", "Slo-mo video support for 1080p at 120 fps", "Time‑lapse video with stabilization", "Night mode Time-lapse", "QuickTake video up to 4K at 60 fps in Dolby Vision", "Cinematic video stabilization (4K, 1080p, and 720p)", "Spatial Audio and stereo recording", "Wind noise reduction", "Audio Mix"] },
        { label: "Video Recording", value: ["4K@24/25/30/60fps, 1080p@25/30/60/120fps, gyro-EIS"] },
      ],
    },
    {
      title: "Audio",
      rows: [
        { label: "Speaker", value: ["Spatial Audio playback"] },
        { label: "Audio Features", value: ["FaceTime audio", "Voice over LTE (VoLTE)", "Wi‑Fi calling", "Share experiences like movies, TV, music, and other apps in a FaceTime call with SharePlay", "Screen sharing", "Spatial Audio", "Voice Isolation and Wide Spectrum microphone modes"] },
      ],
    },
    {
      title: "Network & Connectivity",
      rows: [
        { label: "SIM", value: ["Dual SIM (nano-SIM and eSIM)"] },
        { label: "Network", value: ["5G (sub-6 GHz and mmWave) with 4x4 MIMO", "Gigabit LTE with 4x4 MIMO"] },
        { label: "Wi-Fi", value: ["FDD‑5G NR (Bands n1, n2, n3, n5, n7, n8, n12, n14, n20, n25, n26, n28, n29, n30, n66, n70, n71, n75)", "TDD‑5G NR (Bands n38, n40, n41, n48, n53, n77, n78, n79)", "5G NR mmWave (Bands n258, n260, n261)", "FDD‑LTE (Bands 1, 2, 3, 4, 5, 7, 8, 12, 13, 14, 17, 18, 19, 20, 25, 26, 28, 29, 30, 32, 66, 71)", "TDD‑LTE (Bands 34, 38, 39, 40, 41, 42, 48, 53)", "UMTS/HSPA+/DC-HSDPA (850, 900, 1700/2100, 1900, 2100 MHz)", "GSM/EDGE (850, 900, 1800, 1900 MHz)", "5G (sub-6 GHz and mmWave) with 4x4 MIMO9", "Gigabit LTE with 4x4 MIMO9", "Wi‑Fi 7 (802.11be) with 2x2 MIMO10", "Bluetooth 6", "Thread networking technology"] },
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
        { label: "Other Features", value: ["Enabled by TrueDepth technology in the Center Stage front camera", "NFC with reader mode", "Express Cards with power reserve", "Camera controls: Exposure, Depth, Zoom, Cameras, Styles, Tone", "Action button features: Silent mode, Focus, Camera, Visual Intelligence, 12 Flashlight, Voice Memo, Recognize Music, Translate, Magnifier, Controls, Shortcut, or Accessibility"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["Video playback: Up to 30 hours", "Video playback (streamed): Up to 27 hours", "Built‑in rechargeable lithium‑ion battery"] },
        { label: "Fast Charging", value: ["Up to 50% charge in 20 minutes with 40W adapter or higher (available separately). paired with USB‑C charging cable", "Up to 50% charge in 30 minutes with 30W adapter or higher paired with MagSafe Charger (both available separately)", "MagSafe and Wireless Charging:", "MagSafe wireless charging up to 25W", "Qi2 wireless charging up to 25W6", "Magnet array", "Alignment magnet", "Accessory Identification NFC", "Magnetometer"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["Width: 2.81 inches (71.5 mm)", "Height: 5.89 inches (149.6 mm)", "Depth: 0.31 inch(7.95 mm)"] },
        { label: "Weight", value: ["6.24 ounces (177 grams)"] },
        { label: "Colors", value: ["Black, White, Mist Blue, Sage, Lavender"] },
      ],
    },
  ],

  description: {
    title: "iPhone 17",
    blocks: [
      {
        paragraphs: [
          "Apple iPhone 17 combines a smooth 6.3-inch ProMotion display, the powerful A19 chip, an upgraded 48MP Dual Fusion camera system and excellent all-day usability. It is a strong choice for users upgrading for photography, content creation, gaming, productivity or a more connected Apple ecosystem.",
        ],
      },
      {
        heading: "6.3-inch Super Retina XDR Display with ProMotion",
        paragraphs: [
          "The iPhone 17 features a 6.3-inch Super Retina XDR OLED display with an adaptive refresh rate of up to 120Hz. ProMotion makes scrolling, animations, gaming and video playback feel noticeably smoother. The display also supports Always-On functionality, Dynamic Island, HDR, True Tone and up to 3000 nits of peak outdoor brightness for improved visibility in bright conditions.",
        ],
      },
      {
        heading: "A19 Chip for Fast and Efficient Performance",
        paragraphs: [
          "Powered by the Apple A19 chip, iPhone 17 delivers responsive performance for everyday apps, demanding games, photo editing, video recording and multitasking. Its 6-core CPU, 5-core GPU with Neural Accelerators and 16-core Neural Engine support efficient performance, advanced graphics and compatible Apple Intelligence experiences.",
        ],
      },
      {
        heading: "48MP Dual Fusion Camera System",
        paragraphs: [
          "Capture detailed photos and high-quality videos with the 48MP Dual Fusion camera system. The 48MP Fusion Main camera supports 24MP and 48MP high-resolution photos and also enables a 12MP optical-quality 2x Telephoto view. The 48MP Fusion Ultra Wide camera provides a wider field of view for landscapes, architecture, group photos and macro photography.",
          "An 18MP Center Stage front camera helps improve selfies, video calls and group framing. The phone also supports 4K Dolby Vision video, Cinematic mode, Action mode, Dual Capture, Night mode, Smart HDR 5 and the latest-generation Photographic Styles.",
        ],
      },
      {
        heading: "Long Battery Life and Faster Charging",
        paragraphs: [
          "iPhone 17 offers up to 30 hours of video playback, helping it handle communication, streaming, photography and everyday work throughout the day. With a compatible 40W or higher power adapter, it can charge up to 50% in approximately 20 minutes. It also supports MagSafe and Qi2 wireless charging at up to 25W with compatible accessories. Charging adapters are sold separately.",
        ],
      },
      {
        heading: "Durable Design with Ceramic Shield 2",
        paragraphs: [
          "The aluminium design, Ceramic Shield 2 front and colour-infused glass back provide a premium appearance with improved everyday durability. The iPhone 17 is rated IP68 for splash, water and dust resistance under controlled laboratory conditions. Water resistance is not permanent and may decrease with normal wear.",
        ],
      },
      {
        heading: "iPhone 17 Storage and Colour Options",
        paragraphs: [
          "Choose the capacity and finish that best match your daily use and personal style. Available options may vary according to current stock.",
          "Storage: 256GB and 512GB",
          "Colours: Black, White, Mist Blue, Sage and Lavender",
          "Operating system: iOS 26",
          "Connectivity: 5G, Wi-Fi 7, Bluetooth 6, NFC and USB-C",
          "Security: Face ID and Apple privacy protections",
        ],
      },
      {
        paragraphs: [
          "Flexible payments: Up to 24 months 0% EMI may be available through selected participating banks.",
          "More Apple choices: Browse the complete official iPhone collection to compare current models and prices.",
        ],
      },
      {
        heading: "Complete Your iPhone 17 Setup",
        paragraphs: [
          "Protect and charge your new device with compatible cases, screen protection, USB-C power adapters, charging cables and MagSafe products. Explore Apple cases and accessories and confirm compatibility with the iPhone 17 before ordering.",
        ],
      },
      {
        heading: "iPhone 17 vs iPhone 17 Pro and Pro Max",
        paragraphs: [
          "The standard iPhone 17 is ideal for customers seeking balanced performance, excellent cameras and a premium display. Users who need additional professional camera controls, more advanced zoom options or higher-end performance can compare the iPhone 17 Pro and iPhone 17 Pro Max .",
        ],
      },
      {
        heading: "What is the iPhone 17 price in Bangladesh?",
        paragraphs: [
          "The current iPhone 17 price in Bangladesh is shown at the top of this product page. The final price may change depending on storage, colour, payment method, stock and active promotional offers.",
        ],
      },
      {
        heading: "Which storage options are available for iPhone 17?",
        paragraphs: [
          "Apple iPhone 17 is available in 256GB and 512GB storage capacities. Availability may differ by colour and current inventory.",
        ],
      },
      {
        heading: "Can I buy iPhone 17 with EMI in Bangladesh?",
        paragraphs: [
          "Yes. Up to 24 months 0% EMI may be available through selected participating banks. Eligibility and instalment periods depend on the card, bank and current campaign.",
        ],
      },
      {
        heading: "What colours are available for iPhone 17?",
        paragraphs: [
          "iPhone 17 is available in Black, White, Mist Blue, Sage and Lavender. Check the selection area above to see which colours are currently in stock.",
        ],
      },
      {
        heading: "Buying the iPhone 17 from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
