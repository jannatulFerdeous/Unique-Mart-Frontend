import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/jbl-go-5-bluetooth-speaker.jpeg";
import img2 from "@/images/products/jbl-go-5-bluetooth-speaker/02-jbl-go-5-bluetooth-speaker-black-1.jpeg";
import img3 from "@/images/products/jbl-go-5-bluetooth-speaker/03-jbl-go-5-bluetooth-speaker-blue.jpeg";
import img4 from "@/images/products/jbl-go-5-bluetooth-speaker/04-jbl-go-5-bluetooth-speaker-blue-1.jpeg";
import img5 from "@/images/products/jbl-go-5-bluetooth-speaker/05-jbl-go-5-bluetooth-speaker-pink.jpeg";
import img6 from "@/images/products/jbl-go-5-bluetooth-speaker/06-jbl-go-5-bluetooth-speaker-pink-1.jpeg";
import img7 from "@/images/products/jbl-go-5-bluetooth-speaker/07-jbl-go-5-bluetooth-speaker-purple.jpeg";
import img8 from "@/images/products/jbl-go-5-bluetooth-speaker/08-jbl-go-5-bluetooth-speaker-purple-1.jpeg";
import img9 from "@/images/products/jbl-go-5-bluetooth-speaker/09-jbl-go-5-bluetooth-speaker-red.jpeg";
import img10 from "@/images/products/jbl-go-5-bluetooth-speaker/10-jbl-go-5-bluetooth-speaker-red-1.jpeg";
import img11 from "@/images/products/jbl-go-5-bluetooth-speaker/11-jbl-go-5-bluetooth-speaker-squad.jpeg";
import img12 from "@/images/products/jbl-go-5-bluetooth-speaker/12-jbl-go-5-bluetooth-speaker-squad-1.jpeg";
import img13 from "@/images/products/jbl-go-5-bluetooth-speaker/13-jbl-go-5-bluetooth-speaker-white.jpeg";
import img14 from "@/images/products/jbl-go-5-bluetooth-speaker/14-jbl-go-5-bluetooth-speaker-white-1.jpeg";

export const jblGo5BluetoothSpeaker: ProductDetail = {
  breadcrumb: [
    { label: "Headphone & Speaker", slug: "headphone-speaker" },
    { label: "Speaker", slug: "speakers" },
    { label: "JBL", slug: "jbl-speaker" },
  ],
  gallery: [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14],
  inStock: true,

  highlights: [
    "Frequency response: 87 Hz-20 kHz",
    "Transducer: 45 mm/1.75\"",
    "IP68 waterproof and dustproof",
    "Up to 8 hours of playtime",
  ],

  colors: [
    { name: "Black", hex: "#000000", image: img1 },
    { name: "Blue", hex: "#035BBC", image: img3 },
    { name: "Pink", hex: "#FDAEC8", image: img5 },
    { name: "Purple", hex: "#800080", image: img7 },
    { name: "Red", hex: "#FF0000", image: img9 },
    { name: "Squad", hex: "#737D62", image: img11 },
    { name: "White", hex: "#ffffff", image: img13 },
  ],

  emi: { months: 6, perMonth: 1167 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["JBL"] },
        { label: "Model Name", value: ["GO 5"] },
      ],
    },
    {
      title: "Main Features",
      rows: [
        { label: "Connection Type", value: ["USB-C (in)"] },
        { label: "Bluetooth Version", value: ["6.0"] },
        { label: "Bluetooth Profiles", value: ["A2DP V1.4, AVRCP V1.6"] },
        { label: "Bluetooth Transmitter Power", value: ["≤ 16 dBm (EIRP)"] },
        { label: "Frequency Response", value: ["87 Hz –20 kHz (-6dB)"] },
        { label: "Battery Type", value: ["Li-ion 3.85 Wh"] },
        { label: "Battery charge time", value: ["3 Hours"] },
        { label: "Music play time", value: ["8 Hours"] },
        { label: "Signal / Noise Ratio", value: ["> 85 dB"] },
        { label: "Output power (W)", value: ["4.8 W RMS"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["3.98 x 3.05 x 1.7 inches"] },
        { label: "Weight", value: ["0.23kg"] },
        { label: "Colors", value: ["Black, Blue, Pink, Purple, Red, Squad, White"] },
      ],
    },
  ],

  description: {
    title: "JBL GO 5",
    blocks: [
      {
        paragraphs: [
          "Take powerful JBL sound wherever you go with the JBL GO 5 Portable Bluetooth Speaker. Designed for music lovers who want clear audio without carrying a large speaker, this compact model combines a 45mm full-range driver, 4.8W RMS output and an easy-to-carry body. Whether you are listening at home, travelling with friends or enjoying an outdoor gathering, the JBL GO 5 delivers an enjoyable balance of portability, durability and sound quality.",
        ],
      },
      {
        heading: "Powerful JBL Sound in a Pocket-Friendly Design",
        paragraphs: [
          "Do not let its small size fool you. The JBL GO 5 is powered by a 45mm transducer and produces up to 4.8W RMS output. Its frequency response of 87Hz–20kHz helps reproduce clear vocals, detailed treble and satisfying bass across different types of music. With a signal-to-noise ratio above 85dB, your playlists, podcasts and online content sound clean and engaging.",
          "Weighing approximately 230 grams and measuring only 3.98 × 3.05 × 1.7 inches, it can fit conveniently inside a handbag, backpack or travel pouch. The compact construction makes it a practical mini Bluetooth speaker for bedrooms, workspaces, picnics and everyday travel.",
        ],
      },
      {
        heading: "IP68 Waterproof and Dustproof Protection",
        paragraphs: [
          "The IP68 waterproof and dustproof rating makes the JBL GO 5 ready for more demanding environments. You can carry it beside the pool, use it during an outdoor trip or enjoy music in Bangladesh’s dusty and rainy conditions with greater confidence. Its rugged, portable design makes it suitable for users who need a durable outdoor Bluetooth speaker without unnecessary bulk.",
        ],
      },
      {
        heading: "Up to 8 Hours of Wireless Playtime",
        paragraphs: [
          "Enjoy up to 8 hours of music playback from the built-in 3.85Wh lithium-ion battery. Actual battery life can vary according to volume, audio content and usage conditions. When it is time to recharge, the battery takes approximately three hours to charge. The convenient USB-C connection also means you can use a widely available modern charging interface.",
        ],
      },
      {
        heading: "Fast and Stable Bluetooth 6.0 Connectivity",
        paragraphs: [
          "Equipped with Bluetooth 6.0, the JBL GO 5 provides a stable wireless connection with compatible smartphones, tablets and laptops. Pairing is quick and straightforward, allowing you to start streaming without dealing with audio cables. Its support for modern Bluetooth profiles helps provide reliable playback control during regular use.",
        ],
      },
      {
        heading: "Why Choose the JBL GO 5?",
        paragraphs: [
          "Compact and lightweight portable design",
          "45mm full-range transducer",
          "Powerful 4.8W RMS audio output",
          "87Hz–20kHz frequency response",
          "IP68 waterproof and dustproof protection",
          "Up to eight hours of music playback",
          "Modern Bluetooth 6.0 wireless connectivity",
          "USB-C charging connection",
          "Multiple colour options to match your style",
        ],
      },
      {
        paragraphs: [
          "Looking for more audio options? Browse our complete collection of speakers in Bangladesh or compare other models from the JBL speaker collection. You can also explore the JBL CLIP 5 for a convenient clip-on design or the more powerful JBL Flip 7. For headphones, earbuds and additional audio products, visit our Headphone & Speaker category.",
        ],
      },
      {
        heading: "Is the JBL GO 5 waterproof?",
        paragraphs: [
          "Yes. The JBL GO 5 has an IP68 rating, providing strong protection against water and dust under the conditions specified by the manufacturer.",
        ],
      },
      {
        heading: "How long does the JBL GO 5 battery last?",
        paragraphs: [
          "It offers up to eight hours of music playback. Battery performance depends on volume level, content and other usage conditions.",
        ],
      },
      {
        heading: "Can I connect the JBL GO 5 to a smartphone or laptop?",
        paragraphs: [
          "Yes. Its Bluetooth 6.0 connectivity supports wireless pairing with compatible smartphones, tablets, laptops and other Bluetooth-enabled devices.",
        ],
      },
      {
        heading: "Buying the JBL GO 5 Portable Bluetooth Speaker from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
