import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/iphone-17-pro.jpeg";
import img2 from "@/images/products/iphone-17-pro/03-iphone-17-pro-silver389.jpeg";
import img3 from "@/images/products/iphone-17-pro/04-iphone-17-pro-cosmic-orange400.jpeg";

export const iphone17Pro: ProductDetail = {
  breadcrumb: [
    { label: "Phones", slug: "phone" },
    { label: "iPhone", slug: "iphone" },
  ],
  gallery: [img1, img2, img3],
  inStock: true,

  highlights: [
    "Display Size: 6.3‑inch (diagonal), Super Retina XDR display",
    "Processor: Apple A19 Pro, 6‑core CPU",
    "Camera: 48.0 MP + 48.0 MP + 48.0 MP + 18.0 MP",
    "Features: Face ID, Barometer, High dynamic range gyro",
    "Up to 24 Months 0% EMI (Selected Banks)",
  ],

  colors: [
    { name: "Deep Blue", hex: "#406585", image: img1 },
    { name: "Silver", hex: "#ededed", image: img2 },
    { name: "Cosmic Orange", hex: "#FA8D4D", image: img3 },
  ],

  options: [
    { label: "Storage", values: ["256GB", "512GB", "1TB"] },
  ],

  emi: { months: 24, perMonth: 8250 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Apple"] },
        { label: "Model Name", value: ["iPhone 17 Pro"] },
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
        { label: "Features", value: ["Dynamic Island", "Always-On display", "ProMotion technology with adaptive refresh rates up to 120Hz", "HDR display", "True Tone", "Wide color (P3)", "Haptic Touch", "2,000,000:1 contrast ratio (typical)", "Fingerprint-resistant oleophobic coating", "Anti-reflective coating", "Support for display of multiple languages and characters simultaneously"] },
      ],
    },
    {
      title: "Processor",
      rows: [
        { label: "Chipset", value: ["A19 Pro chip"] },
        { label: "CPU Type", value: ["6‑core CPU with 2 performance and 4 efficiency cores", "16‑core Neural Engine", "Hardware‑accelerated ray tracing"] },
        { label: "GPU", value: ["6‑core GPU with Neural Accelerators"] },
      ],
    },
    {
      title: "Memory",
      rows: [
        { label: "ROM", value: ["256GB", "512GB", "1TB"] },
      ],
    },
    {
      title: "Rear Camera",
      rows: [
        { label: "Resolution", value: ["48MP Pro Fusion camera system"] },
        { label: "Features", value: ["48MP Fusion Main: 24 mm, ƒ/1.78 aperture, second‑generation sensor‑shift optical image stabilization, 100% Focus Pixels, support for super‑high‑resolution photos (24MP and 48MP)", "Also enables 12MP optical-quality 2x Telephoto: 48 mm, ƒ/1.78 aperture, second‑generation sensor‑shift optical image stabilization, 100% Focus Pixels", "48MP Fusion Ultra Wide: 13 mm, ƒ/2.2 aperture and 120° field of view, Hybrid Focus Pixels, super‑high‑resolution photos (48MP)", "48MP Fusion Telephoto: 100 mm (4x), ƒ/2.8 aperture, Hybrid Focus Pixels, 3D sensor‑shift optical image stabilization and autofocus, tetraprism design", "Also enables 12MP optical-quality 8x Telephoto: 200 mm, ƒ/2.8 aperture, Hybrid Focus Pixels, 3D sensor‑shift optical image stabilization and autofocus, tetraprism design", "8x optical‑quality zoom in, 2x optical zoom out", "16x optical‑quality zoom range", "Digital zoom up to 40x", "Customizable default lens (Fusion Main)", "Sapphire crystal lens cover", "Adaptive True Tone flash", "Photonic Engine", "Deep Fusion", "Smart HDR 5", "Next-generation portraits with Focus and Depth Control", "Portrait Lighting with six effects", "Night mode", "Panorama (up to 63MP)", "Latest-generation Photographic Styles", "Spatial photos", "48MP macro photography", "ProRAW", "Wide color capture for photos and Live Photos", "Lens correction (Fusion Ultra Wide)", "Advanced red-eye correction", "Auto image stabilization", "Burst mode", "Photo geotagging", "Image formats captured: HEIF, JPEG, and DNG"] },
        { label: "Video Recording", value: ["4K Dolby Vision video recording at 24 fps, 25 fps, 30 fps, 60 fps, 100 fps (Fusion Main), or 120 fps (Fusion Main)", "1080p Dolby Vision video recording at 25 fps, 30 fps, 60 fps, or 120 fps (Fusion Main)", "720p Dolby Vision video recording at 30 fps", "Cinematic mode up to 4K Dolby Vision at 30 fps", "Action mode up to 2.8K Dolby Vision at 60 fps", "Spatial video recording at 1080p at 30 fps", "ProRes video recording up to 4K at 120 fps with external recording", "ProRes RAW5", "Academy Color Encoding System", "Apple Log 2", "Genlock support6", "Macro video recording, including slo‑mo and time‑lapse", "Slo‑mo video support for 1080p up to 240 fps and 4K Dolby Vision up to 120 fps (Fusion Main)", "Dual Capture up to 4K Dolby Vision at 30 fps", "Time‑lapse video with stabilization", "Night mode Time‑lapse", "QuickTake video up to 4K Dolby Vision at 60 fps", "Second‑generation sensor‑shift optical image stabilization for video (Fusion Main)", "3D sensor‑shift optical image stabilization and autofocus for video (Fusion Telephoto)", "Digital zoom up to 15x", "Audio zoom", "True Tone flash", "Cinematic video stabilization (4K, 1080p, and 720p)", "Continuous autofocus video", "Take 8MP still photos while recording 4K video", "Playback zoom", "Video formats recorded: HEVC, H.264, ProRes, and ProRes RAW", "Spatial Audio and stereo recording", "Four studio-quality mics", "Wind noise reduction", "Audio Mix"] },
      ],
    },
    {
      title: "Front Camera",
      rows: [
        { label: "Resolution", value: ["18MP Center Stage camera"] },
        { label: "Features", value: ["ƒ/1.9 aperture", "Autofocus with Focus Pixels", "Retina Flash", "Tap to zoom and rotate", "Center Stage for photos", "Ultra-stabilized video", "Dual Capture", "Center Stage for video calls", "Photonic Engine", "Deep Fusion", "Smart HDR 5", "Next-generation portraits with Focus and Depth Control", "Portrait Lighting with six effects", "Animoji and Memoji", "Night mode", "Latest-generation Photographic Styles", "ProRAW", "Wide color capture for photos and Live Photos", "Lens correction", "Auto image stabilization", "Burst mode", "4K Dolby Vision video recording at 24 fps, 25 fps, 30 fps, or 60 fps", "1080p Dolby Vision video recording at 25 fps, 30 fps, or 60 fps", "Cinematic mode up to 4K Dolby Vision at 30 fps", "ProRes video recording up to 4K at 60 fps with external recording", "ProRes RAW5", "Academy Color Encoding System", "Apple Log 2", "Slo-mo video support for 1080p at 120 fps", "Time‑lapse video with stabilization", "Night mode Time-lapse", "QuickTake video up to 4K at 60 fps in Dolby Vision", "Cinematic video stabilization (4K, 1080p, and 720p)", "Spatial Audio and stereo recording", "Wind noise reduction", "Audio Mix"] },
      ],
    },
    {
      title: "Audio",
      rows: [
        { label: "Speaker", value: ["Spatial Audio playback"] },
        { label: "Audio Features", value: ["Supported formats include AAC, APAC, MP3, Apple Lossless, FLAC, Dolby Digital, Dolby Digital Plus, and Dolby Atmos", "User‑configurable maximum volume limit"] },
      ],
    },
    {
      title: "Network & AMP; Connectivity",
      rows: [
        { label: "SIM", value: ["Dual SIM (nano-SIM and eSIM)"] },
        { label: "Network", value: ["FDD-5G NR (Bands n1, n2, n3, n5, n7, n8, n12, n14, n20, n25, n26, n28, n29, n30, n66, n70, n71, n75)", "TDD-5G NR (Bands n38, n40, n41, n48, n53, n77, n78, n79)", "5G NR mmWave (Bands n258, n260, n261)", "FDD-LTE (Bands 1, 2, 3, 4, 5, 7, 8, 12, 13, 14, 17, 18, 19, 20, 25, 26, 28, 29, 30, 32, 66, 71)", "TDD-LTE (Bands 34, 38, 39, 40, 41, 42, 48, 53)", "UMTS/HSPA+/DC-HSDPA (850, 900, 1700/2100, 1900, 2100 MHz)", "GSM/EDGE (850, 900, 1800, 1900 MHz)"] },
        { label: "Wi-Fi", value: ["Apple N1 wireless networking chip", "Wi‑Fi 7 (802.11be) with 2x2 MIMO", "Thread networking technology"] },
        { label: "Bluetooth", value: ["Bluetooth 6"] },
        { label: "GPS", value: ["Precision dual-frequency GPS (GPS, GLONASS, Galileo, QZSS, BeiDou, and NavIC)"] },
        { label: "NFC", value: ["Supported"] },
        { label: "USB", value: ["USB 3 (up to 10Gb/s)"] },
        { label: "OTG", value: ["Supported"] },
        { label: "Audio Jack", value: ["USB-C"] },
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
        { label: "Sensors", value: ["Face ID", "LiDAR Scanner", "Barometer", "High dynamic range gyro", "High-g accelerometer", "Proximity sensor", "Dual ambient light sensors"] },
        { label: "IP Rating", value: ["Rated IP68 (maximum depth of 6 meters up to 30 minutes) under IEC standard 60529"] },
        { label: "Other Features", value: ["Enabled by TrueDepth technology in the Center Stage front camera", "NFC with reader mode", "Express Cards with power reserve", "Action button features", "Silent mode, Focus, Camera, Visual Intelligence14, Flashlight, Voice Memo, Recognize Music, Translate, Magnifier, Controls, Shortcut, or Accessibility", "Camera controls", "Exposure, Depth, Zoom, Cameras, Styles, Tone"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["Video playback: Up to 33 hours", "Video playback (streamed): Up to 30", "hours", "Built‑in rechargeable lithium‑ion battery"] },
        { label: "Fast Charging", value: ["Up to 50% charge in 20 minutes with 40W adapter or higher (available separately) paired with USB-C charging cable", "Up to 50% charge in 30 minutes with 30W adapter or higher paired with MagSafe Charger (both available separately)", "MagSafe wireless charging up to 25W", "Qi2 wireless charging up to 25W"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["Height: 5.91 inches (150.0 mm)", "Width: 2.83 inches (71.9 mm)", "Depth: 0.34 inch (8.75 mm)"] },
        { label: "Weight", value: ["7.27 ounces (206 grams)"] },
        { label: "Colors", value: ["Silver, Cosmic Orange, Deep Blue"] },
      ],
    },
  ],

  description: {
    title: "Latest iPhone 17 Pro in Bangladesh",
    blocks: [
      {
        heading: "Triple 48MP Camera System",
        paragraphs: [
          "Apple upgraded all three rear cameras to 48MP. The wide lens captures rich detail, the ultra-wide handles sweeping landscapes and group shots, and the periscope telephoto lens supports 4x optical zoom for professional-quality close-ups. Low-light performance is improved, letting you shoot night scenes without grain or blur. The LiDAR scanner helps with depth mapping, AR experiences, and faster autofocus. The front camera also got a boost to 18MP with Center Stage, making selfies, video calls, and spatial videos clearer and sharper. You can even record ProRes and Dolby Vision HDR videos, which makes the iPhone 17 Pro a favorite for content creators.",
        ],
      },
      {
        heading: "A19 Pro Chip for Speed and Efficiency",
        paragraphs: [
          "The new Apple A19 Pro chipset delivers faster processing, smoother graphics, and better AI performance than the A18 chip in the iPhone 16 Pro. Gaming, video editing, and multitasking are seamless. With 12GB RAM in all variants and storage options ranging from 256GB to 1TB, you have plenty of space for apps, photos, and videos. Even the iPhone 17 Pro 256GB base variant offers enough storage and speed for most users, making it an excellent value.",
        ],
      },
      {
        heading: "Brilliant Display and Visuals",
        paragraphs: [
          "The 6.3-inch LTPO Super Retina XDR OLED display supports a 120Hz refresh rate, HDR10, and Dolby Vision. It can reach peak brightness of 3000 nits, so your content remains bright and colorful even under direct sunlight. Anti-reflective coating reduces glare, and the 460 PPI pixel density ensures crisp text, images, and videos. Whether streaming, gaming, or browsing, the display feels smooth and responsive.",
        ],
      },
      {
        heading: "Long-Lasting Battery and Fast Charging",
        paragraphs: [
          "The iPhone 17 Pro comes with a 3988 mAh battery for Nano-SIM models and 4252 mAh for eSIM-only models. This provides full-day usage for heavy users who stream, game, or capture videos frequently. Wired charging reaches 50% in just 20 minutes, while 25W MagSafe wireless charging reaches half battery in 30 minutes. Even reverse wired charging is supported, letting you power smaller devices in a pinch.",
        ],
      },
      {
        heading: "Design and Durability",
        paragraphs: [
          "Apple retained its elegant yet functional design. The iPhone 17 Pro is slightly larger and heavier than the iPhone 16 Pro, with a 206 g weight that balances sturdiness and handling. The aluminum alloy frame and Ceramic Shield glass add toughness, while the IP68 rating allows submersion up to 6 meters for 30 minutes. Colors include Silver, Cosmic Orange, and Deep Blue, offering stylish choices for different tastes.",
        ],
      },
      {
        heading: "Software and Connectivity",
        paragraphs: [
          "Running iOS 26, the iPhone 17 Pro delivers smooth navigation, security updates, and Apple-exclusive features. Connectivity options include Wi-Fi 7, Bluetooth 6.0, USB-C 3.2, and Ultra Wideband Gen2 for spatial awareness. Emergency SOS and Find My via satellite add safety for travelers and outdoor enthusiasts. NFC supports Apple Pay, making daily transactions fast and secure.",
        ],
      },
      {
        heading: "Does the iPhone 17 Pro have a better camera than the iPhone 16 Pro?",
        paragraphs: [
          "Yes, the iPhone 17 Pro includes a periscope telephoto lens, improved low-light sensors, and 4K ProRes video support, making it a significant upgrade over the iPhone 16 Pro.",
        ],
      },
      {
        heading: "What storage options are available for iPhone 17 Pro?",
        paragraphs: [
          "The iPhone 17 Pro comes in 256GB, 512GB, and 1TB storage variants, all with 12GB RAM for smooth performance.",
        ],
      },
      {
        heading: "Buying the iPhone 17 Pro from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
