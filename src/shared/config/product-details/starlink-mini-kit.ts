import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/starlink-mini-kit.jpeg";
import img2 from "@/images/products/starlink-mini-kit/02-starlink-mini-kit-3427.jpeg";
import img3 from "@/images/products/starlink-mini-kit/03-starlink-mini-kit-5426.jpeg";
import img4 from "@/images/products/starlink-mini-kit/04-starlink-mini-kit-1173.jpeg";
import img5 from "@/images/products/starlink-mini-kit/05-starlink-mini-kit-6430.jpeg";
import img6 from "@/images/products/starlink-mini-kit/06-starlink-mini-kit-7957.jpeg";
import img7 from "@/images/products/starlink-mini-kit/07-starlink-mini-kit-2483.jpeg";

export const starlinkMiniKit: ProductDetail = {
  breadcrumb: [
    { label: "Networking", slug: "networking" },
    { label: "Starlink", slug: "starlink" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7],
  inStock: true,

  highlights: [
    "Antenna: Electronic Phased Array",
    "Frequency: Dual Band 3 x 3 MU-MIMO, Wi-Fi 5",
    "Coverage: Up to 112m&sup2; (1,200 ft&sup2;), Connect up to 128 Devices",
    "Ethernet Ports: 1x Latching Ethernet LAN port with Starlink Plug",
  ],

  emi: { months: 12, perMonth: 2375 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Starlink"] },
        { label: "Model Name", value: ["Mini"] },
      ],
    },
    {
      title: "Main Features",
      rows: [
        { label: "Antenna", value: ["Electronic Phased Array"] },
        { label: "Frequency", value: ["Dual Band 3 x 3 MU-MIMO, Wi-Fi 5"] },
        { label: "Network Standard", value: ["802.11a/b/g/n/ac"] },
        { label: "Wireless", value: ["WiFi 5"] },
        { label: "Encryption", value: ["WPA2"] },
        { label: "Ports", value: ["1x Latching Ethernet LAN port with Starlink Plug"] },
        { label: "Others", value: ["Field of View: 110 °", "Orientation: Software Assisted Manual Orienting", "Environmental Rating: IP67 Type 4 with DC Power Cable and Starlink Plug/Cable installed", "Operating Temperature: -30°C to 50°C (-22°F to 122°F)", "Wind Speed: Operational: 96 kph+ (60 mph+)", "Snow Melt Capability: Up to 25mm / hour (1 in / hour)", "Power Consumption: Average: 25-40W", "Input Rating: 12-48V 60W (12v short Starlink cable coming soon in Shop)", "USB PD Requirement: 100W, 20V/5A Minimum (with Starlink USB-C to Barrel Jack Cable Accessory)", "Coverage: Up to 112 m² (1,200 ft²)", "Power Indicator: LED | rear face plate, lower left corner", "Mesh Compatibility: Compatible with all Starlink mesh systems *Not compatible with 3rd party mesh systems", "Devices: Connect up to 128 devices"] },
      ],
    },
    {
      title: "Power Source",
      rows: [
        { label: "Power Mode", value: ["100-240V ~ 1.6A 50 - 60 Hz"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["298.5 x 259 x 38.5 mm (11.75 x 10.2 x 1.45 in) (Starlink)", "91 x 44 x 51 mm (3.6 in x 1.7 in x 2.0 in) (Power Supply)", "430 x 334 x 79 mm (16.92 x 13.14 x 3.11 in) (Package)"] },
        { label: "Weight", value: ["1.10 kg (2.43 lb) (Starlink)", "1.16 kg (2.56 lb) with Kickstand (Starlink)", "1.53 kg (3.37 lb) with Kickstand & 15 m Cable (Starlink)", "0.2 kg (0.44 lbs) (Power Supply)", "6.73 kg (14.83 lbs) (Package)"] },
        { label: "Color", value: ["White"] },
      ],
    },
  ],

  description: {
    title: "Starlink Mini Kit",
    blocks: [
      {
        heading: "Starlink Mini Kit Specification",
        paragraphs: [
          "The heart of the Starlink Mini Kit lies in its cutting-edge electronic phased array antenna. Designed to provide superior satellite signal reception, this antenna ensures you stay connected, even in remote locations where traditional internet services fail. With an efficient and stable connection, you can experience uninterrupted browsing, streaming, and gaming.",
          "Antenna: Electronic Phased Array",
          "Frequency: Dual Band 3 x 3 MU-MIMO, Wi-Fi 5",
          "Network Standard: 802.11a/b/g/n/ac",
          "Wireless: Wi-Fi 5",
          "Encryption: WPA2",
          "Ports: 1x Latching Ethernet LAN port with Starlink Plug",
          "Field of View: 110°",
          "Orientation: Software Assisted Manual Orienting",
          "Environmental Rating: IP67 Type 4 with DC Power Cable and Starlink Plug/Cable installed",
          "Operating Temperature: -30°C to 50°C (-22°F to 122°F)",
          "Wind Speed: Operational: 96 kph+ (60 mph+)",
          "Snow Melt Capability: Up to 25mm / hour (1 in / hour)",
          "Power Consumption: Average: 25-40W",
          "Input Rating: 12-48V 60W (12V short Starlink cable coming soon in Shop)",
          "USB PD Requirement: 100W, 20V/5A Minimum (with Starlink USB-C to Barrel Jack Cable Accessory)",
          "Coverage: Up to 112 m&sup2; (1,200 ft&sup2;)",
          "Power Indicator: LED | rear faceplate, lower left corner",
          "Mesh Compatibility: Compatible with all Starlink mesh systems (Not compatible with 3rd party mesh systems)",
          "Devices: Connect up to 128 devices",
          "Power Mode: 100-240V ~ 1.6A 50 - 60 Hz",
        ],
      },
      {
        heading: "Dual Band Wi-Fi for Enhanced Speed",
        paragraphs: [
          "Enjoy Wi-Fi 5 connectivity with the Starlink Mini Kit, thanks to its dual-band 3 x 3 MU-MIMO (Multi-User, Multiple Input, Multiple Output) technology. This allows multiple devices to connect simultaneously, maintaining fast internet speeds even with heavy traffic. Whether you’re working from home or enjoying a family movie night, this system handles all your needs effortlessly.",
        ],
      },
      {
        heading: "Designed for Rugged Environments",
        paragraphs: [
          "The Starlink Mini Kit is built to endure harsh weather conditions. With an IP67 rating, it is protected against dust and water immersion, making it perfect for both urban and rural installations. Operating in extreme temperatures from -30°C to 50°C (-22°F to 122°F) and capable of withstanding wind speeds of up to 96 kph (60 mph), this kit is ready for any environment.",
        ],
      },
      {
        heading: "Impressive Coverage and Capacity",
        paragraphs: [
          "The Starlink Mini Kit covers up to 112 m&sup2; (1,200 ft&sup2;), making it ideal for small to medium-sized homes, offices, or even outdoor setups. It also supports up to 128 devices, ensuring that everyone in your household or business has access to high-speed internet at the same time without any slowdowns.",
        ],
      },
      {
        heading: "Enhanced Performance with Mesh Compatibility",
        paragraphs: [
          "The kit is fully compatible with Starlink’s mesh systems, allowing you to expand your network for even better coverage. However, it’s important to note that it does not support third-party mesh systems, ensuring optimal performance when used with Starlink products.",
        ],
      },
      {
        heading: "Buying the Starlink Mini Kit from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
