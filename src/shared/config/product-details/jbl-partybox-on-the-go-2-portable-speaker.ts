import type { ProductDetail } from "../catalog";
import img1 from "@/images/products/jbl-partybox-on-the-go-2-portable-speaker.jpeg";
import img2 from "@/images/products/jbl-partybox-on-the-go-2-portable-speaker/02-jbl-partybox-on-the-go-2-portable-speaker-1.jpeg";
import img3 from "@/images/products/jbl-partybox-on-the-go-2-portable-speaker/03-jbl-partybox-on-the-go-2-portable-speaker-2.jpeg";
import img4 from "@/images/products/jbl-partybox-on-the-go-2-portable-speaker/04-jbl-partybox-on-the-go-2-portable-speaker-3.jpeg";

export const jblPartyboxOnTheGo2PortableSpeaker: ProductDetail = {
  breadcrumb: [
    { label: "Headphone & Speaker", slug: "headphone-speaker" },
    { label: "Speaker", slug: "speakers" },
    { label: "JBL", slug: "jbl-speaker" },
  ],
  gallery: [img1, img2, img3, img4],
  inStock: true,

  highlights: [
    "Power input: 100 - 240V ̴ 50/60 Hz",
    "Battery type: Li-ion 34 Wh (7.2 V / 4722 mAh)",
    "Frequency response: 40Hz - 20kHz (-6dB)",
    "Music play time: up to 15 hours",
  ],

  colors: [
    { name: "Black", hex: "#000000", image: img1 },
  ],

  emi: { months: 6, perMonth: 8000 },

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["JBL"] },
        { label: "Model Name", value: ["PartyBox On-the-Go 2"] },
      ],
    },
    {
      title: "Main Features",
      rows: [
        { label: "Connection Type", value: ["Wireless"] },
        { label: "Bluetooth Version", value: ["V5.4"] },
        { label: "Bluetooth Profiles", value: ["A2DP V1.4, AVRCP V1.6(SW), TMAP1.0, PBP1.0"] },
        { label: "Bluetooth Transmitter Power", value: ["Bluetooth® transmitter frequency range: 2.4GHz~2.4835GHz", "Bluetooth® transmitter power: ≤ 16 dBm (EIRP)", "Bluetooth® transmitter modulation: GFSK, π/4 DQPSK, 8DPSK", "2.4G wireless transmitter frequency range: 2404 - 2478 MHz", "2.4G wireless transmitter power: < 8.5 dBm (EIRP)", "2.4G wireless modulation: GFSK"] },
        { label: "Frequency Response", value: ["40Hz - 20kHz (-6dB)"] },
        { label: "Amplifier Power", value: ["Transducers: 1 x 5.25 inch (135mm) woofers, 2 x 0.75 inch (20mm) Dome tweeters"] },
        { label: "Battery Type", value: ["Li-ion 34 Wh (7.2 V / 4722 mAh)"] },
        { label: "Charging Type", value: ["< 3.5 hours (Speaker off mode)"] },
        { label: "Music play time", value: ["up to 15 hours (varies by volume level and audio content)"] },
        { label: "Signal / Noise Ratio", value: ["> 80dB"] },
        { label: "Input Impedance", value: ["100 - 240V ̴ 50/60 Hz"] },
        { label: "Output power (W)", value: ["100W RMS (IEC60268)"] },
        { label: "Others", value: ["USB file format (not for EMEA region): .MP3, .WAV, .FLAC", "USB charge out: 11V / 2A (Max) (Speaker off mode)", "Cable length: 2.0m / 6.6 ft"] },
      ],
    },
    {
      title: "Physical Specification",
      rows: [
        { label: "Dimension", value: ["501 mm x 258 mm x 221mm ( 19.72\" x 10.16\" x 8.70 \")"] },
        { label: "Weight", value: ["6.36 kg / 14.02 lbs"] },
        { label: "Colors", value: ["Black"] },
      ],
    },
  ],

  description: {
    title: "JBL PartyBox On-the-Go 2 Portable Speaker",
    blocks: [
      {
        paragraphs: [
          "Bring the party anywhere with the powerful JBL PartyBox On-the-Go 2 Portable Speaker, a high-performance portable Bluetooth party speaker designed for music lovers who want big sound on the move. Built with JBL’s signature audio technology, this speaker delivers deep bass, crisp highs, and immersive sound that fills any room or outdoor space. Whether you're hosting a backyard party, a small event, or enjoying music with friends, the PartyBox On-the-Go 2 combines 100W RMS powerful sound, long battery life, and wireless Bluetooth connectivity for a truly portable entertainment experience. With its rugged design, long playback time, and advanced wireless performance, this JBL portable speaker is the perfect companion for parties, gatherings, and outdoor adventures.",
        ],
      },
      {
        heading: "Powerful JBL Pro Sound with 100W RMS Output",
        paragraphs: [
          "The JBL PartyBox On-the-Go 2 Portable Bluetooth Speaker is engineered to deliver impressive audio performance with 100W RMS output power. Equipped with one 5.25-inch woofer and two 0.75-inch dome tweeters, the speaker produces strong bass, detailed mids, and crystal-clear highs. Whether you're playing energetic party tracks or relaxing music, the speaker provides a balanced and dynamic listening experience.",
        ],
      },
      {
        heading: "Wireless Bluetooth 5.4 Connectivity",
        paragraphs: [
          "Enjoy seamless wireless streaming with Bluetooth 5.4 technology, ensuring faster pairing, stronger signal stability, and lower latency. The speaker supports A2DP V1.4, AVRCP V1.6, TMAP1.0, and PBP1.0 Bluetooth profiles, allowing smooth audio playback from smartphones, tablets, and other compatible devices. With its reliable 2.4GHz wireless transmission, you can enjoy uninterrupted music even in crowded environments.",
        ],
      },
      {
        heading: "Wide Frequency Response for Rich Audio",
        paragraphs: [
          "With a frequency response range of 40Hz to 20kHz, the PartyBox On-the-Go 2 captures both deep bass tones and high-frequency details. This wide sound spectrum ensures that every beat, vocal, and instrument sounds full and natural, making it ideal for party playlists, live performances, and high-energy music sessions.",
        ],
      },
      {
        heading: "Long-Lasting Battery for All-Day Entertainment",
        paragraphs: [
          "The speaker features a 34Wh Li-ion battery (7.2V / 4722mAh) that offers up to 15 hours of music playback, depending on volume levels and audio content. Whether you're hosting a long party or enjoying outdoor music sessions, the PartyBox On-the-Go 2 keeps the music playing without frequent recharging.",
        ],
      },
      {
        heading: "USB Playback and Device Charging",
        paragraphs: [
          "The speaker supports USB audio playback with file formats like MP3, WAV, and FLAC (region dependent). It also includes USB charging output up to 11V / 2A, allowing you to charge your smartphone or other devices while enjoying music. When the battery runs low, the JBL PartyBox On-the-Go 2 can be fully recharged in under 3.5 hours (speaker off mode). This fast charging capability ensures you can quickly get back to your music and entertainment.",
        ],
      },
      {
        heading: "Strong Signal and High Audio Clarity",
        paragraphs: [
          "With a signal-to-noise ratio of over 80dB, the PartyBox On-the-Go 2 delivers clear and distortion-free sound even at higher volumes. This makes it an excellent choice for party speakers, portable sound systems, and outdoor audio setups.",
        ],
      },
      {
        heading: "Design, Build Quality, and Portability",
        paragraphs: [
          "The JBL PartyBox On-the-Go 2 features a durable and stylish design built for portability and performance. With dimensions of 501 mm × 258 mm × 221 mm, the speaker is large enough to deliver powerful sound yet compact enough to carry easily. Weighing approximately 6.36 kg (14.02 lbs), it offers a solid build that feels sturdy and reliable for both indoor and outdoor use. The speaker also includes a 2.0-meter power cable, providing flexibility when connecting to power sources during extended events.",
        ],
      },
      {
        heading: "Ideal for Parties, Events, and Outdoor Entertainment",
        paragraphs: [
          "If you are looking for a powerful portable party speaker, the JBL PartyBox On-the-Go 2 is designed to elevate your music experience. Its combination of high-output audio, wireless Bluetooth streaming, long battery life, and versatile playback options makes it suitable for house parties, picnics, beach gatherings, or small events. The speaker’s balanced sound performance and strong bass response ensure that your music always sounds energetic and engaging.",
        ],
      },
      {
        heading: "Buying the JBL PartyBox On-the-Go 2 Portable Speaker from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
