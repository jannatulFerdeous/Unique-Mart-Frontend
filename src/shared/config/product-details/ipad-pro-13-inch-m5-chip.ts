import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/ipad-pro-11-inch-wifi-m5-chip.jpeg";
import img2 from "@/images/products/ipad-pro-11-inch-wifi-m5-chip/03-ipad-pro-11-inch-wifi-m5-chip-silver-1318.jpeg";

export const ipadPro13InchM5Chip: ProductDetail = {
  breadcrumb: [
    { label: "Tablets", slug: "tablets" },
    { label: "iPad", slug: "ipad" },
  ],
  gallery: [img1, img2],
  inStock: true,

  highlights: [
    "Processor: Apple M5 chip",
    "Display: 13\" Tandem OLED, Ultra Retina XDR",
    "Camera: 12MP Wide and Landscape 12MP Center Stage",
    "Memory Capacity: 256GB",
  ],

  colors: [
    { name: "Space Black with Standard Glass", hex: "#353336", image: img1 },
    { name: "Silver with Standard Glass", hex: "#E0E2E3", image: img2 },
  ],

  emi: { months: 12, perMonth: 19167 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Apple"] },
        { label: "Model Name", value: ["iPad Pro"] },
      ],
    },
    {
      title: "Main Feature",
      rows: [
        { label: "Display Type", value: ["Ultra Retina XDR display Tandem OLED"] },
        { label: "Size", value: ["13‑inch"] },
        { label: "Resolution", value: ["2752-by-2064-pixel resolution at 264 ppi"] },
        { label: "RAM", value: ["12GB"] },
        { label: "Storage", value: ["256GB"] },
        { label: "Processor", value: ["Apple M5 chip", "9-core CPU with 3 performance cores and 6 efficiency cores", "10-core GPU", "Neural Accelerators", "Hardware-accelerated ray tracing", "16-core Neural Engine"] },
        { label: "Operating System", value: ["iPadOS 26"] },
        { label: "Connectivity", value: ["Wi-Fi"] },
        { label: "Audio", value: ["FaceTime audio", "Relay cellular calls from your nearby iPhone with the Phone app"] },
        { label: "Others", value: ["Wide color (P3)", "True Tone", "Fingerprint-resistant oleophobic coating", "Fully laminated", "Antireflective coating", "Nano-texture display glass option on 1TB and 2TB models", "SDR brightness: 1000 nits max", "XDR brightness: 1000 nits max full screen, 1600 nits peak (HDR content only)", "1 nit minimum brightness", "2,000,000:1 contrast ratio"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimensions", value: ["Height: 249.7 mm", "Width: 177.5 mm", "Depth: 5.3 mm"] },
        { label: "Weight", value: ["0.98 pound (444 grams)"] },
        { label: "Color", value: ["Space Gray, Silver"] },
      ],
    },
    {
      title: "Camera",
      rows: [
        { label: "Front Camera", value: ["12MP Wide camera, ƒ/1.8 aperture", "Digital zoom up to 5x", "Five‑element lens", "Adaptive True Tone flash", "Panorama (up to 63MP)", "Sapphire crystal lens cover", "Autofocus with Focus Pixels", "Smart HDR 4", "Wide color capture for photos and Live Photos", "Advanced red-eye correction", "Photo geotagging", "Auto image stabilization", "Burst mode", "Image formats captured: HEIF and JPEG"] },
        { label: "Rear Camera", value: ["Landscape 12MP Center Stage camera", "ƒ/2.0 aperture", "Portrait mode with advanced bokeh and Depth Control", "Portrait Lighting with six effects (Natural, Studio, Contour, Stage, Stage Mono, High‑Key Mono)", "Animoji and Memoji", "Smart HDR 4", "1080p HD video recording at 25 fps, 30 fps, or 60 fps", "Time‑lapse video with stabilization", "Extended dynamic range for video up to 30 fps", "Cinematic video stabilization (1080p and 720p)", "Wide color capture for photos and Live Photos", "Lens correction", "Retina Flash with True Tone", "Auto image stabilization", "Burst mode"] },
        { label: "Video", value: ["4K video recording at 24 fps, 25 fps, 30 fps, or 60 fps", "1080p HD video recording at 25 fps, 30 fps, or 60 fps", "720p HD video recording at 30 fps", "ProRes video recording up to 4K at 30 fps (1080p at 30 fps for 256GB storage)", "Audio zoom", "Adaptive True Tone flash", "Slo‑mo video support for 1080p at 120 fps or 240 fps", "Time‑lapse video with stabilization", "Extended dynamic range for video up to 30 fps", "Cinematic video stabilization (4K, 1080p, and 720p)", "Continuous autofocus video", "Playback zoom", "Video formats recorded: HEVC and H.264", "Stereo recording"] },
      ],
    },
    {
      title: "Battery",
      rows: [
        { label: "Type", value: ["Built-in rechargeable lithium-polymer battery"] },
        { label: "Capacity", value: ["Built-in 38.99-watt-hour rechargeable lithium-polymer battery"] },
        { label: "Charging", value: ["Charging via power adapter or USB-C to computer system"] },
      ],
    },
    {
      title: "Special Features",
      rows: [
        { label: "Sensors", value: ["Face ID", "LiDAR Scanner", "Three-axis gyro", "Accelerometer", "Barometer", "Ambient light sensors"] },
        { label: "Bluetooth", value: ["Bluetooth 6"] },
        { label: "WLAN", value: ["Apple N1 wireless networking chip", "Wi‑Fi 7 (802.11be) with 2x2 MIMO6", "Simultaneous dual band", "Thread networking technology"] },
        { label: "GPS", value: ["Digital compass", "Wi-Fi", "iBeacon microlocation"] },
        { label: "USB", value: ["Thunderbolt / USB 4 port with support for:", "Charging", "DisplayPort", "Thunderbolt 3 (up to 40Gb/s)", "USB 4 (up to 40Gb/s)", "USB 3 (up to 10Gb/s)"] },
      ],
    },
  ],

  description: {
    title: "iPad Pro 13\" WiFi M5 Chip 256GB with Standard Glass",
    blocks: [
      {
        heading: "Key Features of iPad Pro 13\" WiFi M5 Chip",
        paragraphs: [
          "Immerse yourself in Apple’s most advanced 13-inch Ultra Retina XDR display. The Tandem OLED technology brings perfect blacks, vivid color accuracy, and an incredible 2,000,000:1 contrast ratio. Whether you’re editing HDR photos, streaming your favorite shows, or sketching with the Apple Pencil Pro, every detail shines with lifelike clarity. With 2752-by-2064-pixel resolution at 264 ppi, and up to 1600 nits of peak HDR brightness, the visuals stay breathtaking even in direct sunlight. The True Tone, wide color (P3), and antireflective coating make viewing comfortable and true to life.",
        ],
      },
      {
        heading: "Next-Generation Performance with the M5 Chip",
        paragraphs: [
          "Powered by Apple’s most powerful tablet processor ever, the Apple M5 chip features a 9-core CPU and 10-core GPU, enabling lightning-fast multitasking, gaming, and professional-grade editing. The 16-core Neural Engine ensures real-time AI performance, making your workflow smoother whether you’re using Final Cut Pro, Procreate, or advanced 3D rendering apps. Expect hardware-accelerated ray tracing for console-level graphics and an overall boost in efficiency thanks to Apple’s breakthrough chip architecture.",
        ],
      },
      {
        heading: "Ample Storage and Seamless iPadOS Experience",
        paragraphs: [
          "With 12GB of RAM and 256GB of high-speed internal storage, you have the space and power to manage large projects, apps, and creative files with ease. Running on iPadOS 26, this iPad Pro offers a seamless, intuitive experience with new multitasking features, improved Stage Manager, and advanced integration with Mac and iPhone. The interface is designed to help you stay creative, organized, and efficient.",
        ],
      },
      {
        heading: "Slim, Lightweight, and Built to Impress",
        paragraphs: [
          "At only 5.3 mm thin and weighing just 444 grams, the iPad Pro 13\" is Apple’s thinnest device ever. It feels feather-light in your hands, making it perfect for travel, meetings, or creative work on the go. The sleek Space Gray and Silver finishes complement its minimalist design, emphasizing Apple’s craftsmanship and innovation.",
        ],
      },
      {
        heading: "Professional-Quality Cameras",
        paragraphs: [
          "The iPad Pro 13\" doesn’t compromise on photography or video quality. The 12MP Wide rear camera with &fnof;/1.8 aperture captures crisp, vibrant photos, while Smart HDR 4 ensures true-to-life details even in tricky lighting. You can record 4K videos at up to 60 fps with ProRes support for professional video workflows. On the front, the 12MP Ultra Wide camera with Center Stage automatically keeps you perfectly framed during FaceTime calls or video meetings. With Portrait mode, Animoji, and advanced depth control, your selfies and conference calls will always look their best.",
        ],
      },
      {
        heading: "Immersive Audio and Connectivity",
        paragraphs: [
          "Experience studio-quality sound with the iPad Pro’s advanced audio system, delivering FaceTime audio, stereo recording, and adaptive True Tone flash. With Wi-Fi 7 and the Apple N1 wireless networking chip, you’ll enjoy faster, more reliable connections for streaming, gaming, and file transfers. The Thunderbolt / USB-C port supports up to 40Gb/s transfer speeds, connecting effortlessly to external drives, displays, or docking stations for a complete workstation setup.",
        ],
      },
      {
        heading: "All-Day Battery Life and Fast Charging",
        paragraphs: [
          "The 38.99-watt-hour lithium-polymer battery delivers an impressive all-day performance. Whether you’re editing 4K footage, taking notes, or binge-watching your favorite shows, you can count on hours of uninterrupted use. Recharge quickly via USB-C or your preferred power adapter and stay powered wherever you go.",
        ],
      },
      {
        heading: "Advanced Security and Smart Features",
        paragraphs: [
          "Your privacy is protected with Face ID, powered by the TrueDepth camera system, ensuring secure access and app authentication. The LiDAR Scanner enhances augmented reality experiences, while built-in sensors like the accelerometer, gyroscope, and barometer bring dynamic precision to your apps and creative tools. With Bluetooth 6 and Thread networking technology, you’re ready for the next generation of connected accessories and smart home devices.",
        ],
      },
      {
        heading: "Buying the iPad Pro 13\" WiFi M5 Chip 256GB with Standard Glass from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
