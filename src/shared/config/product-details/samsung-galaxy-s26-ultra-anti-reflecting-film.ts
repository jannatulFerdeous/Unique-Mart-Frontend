import type { ProductDetail } from "../catalog";
import img1 from "@/images/brands/samsung-galaxy-s26-ultra-anti-reflecting-film.jpeg";
import img2 from "@/images/products/samsung-galaxy-s26-ultra-anti-reflecting-film/02-samsung-galaxy-s26-ultra-anti-reflecting-film-1.jpeg";

export const samsungGalaxyS26UltraAntiReflectingFilm: ProductDetail = {
  breadcrumb: [
    { label: "Cases & Protectors", slug: "cases-screen-protectors" },
    { label: "Samsung", slug: "samsung-cases-accessories" },
    { label: "Galaxy S26 Ultra", slug: "galaxy-s26-ultra-cases-screen-protectors" },
  ],
  gallery: [img1, img2],
  inStock: true,

  highlights: [
    "Crafted for high-touch sensitivity.",
    "screen look pristine and spotless.",
    "It fits seamlessly with Galaxy S26 Ultra.",
    "Anti-scratch performance to live life freely and confidently.",
  ],

  colors: [
    { name: "Clear", hex: "#CDCCCD", image: img1 },
  ],

  specs: [
    {
      title: "Basic Information",
      rows: [
        { label: "Brand", value: ["Samsung"] },
        { label: "Model Name", value: ["Anti-reflecting Film"] },
        { label: "MPN/ Part No", value: ["EF-US948CTEGWW"] },
      ],
    },
    {
      title: "Product Specifications",
      rows: [
        { label: "Type", value: ["Opitcal Film"] },
        { label: "Compatible Devices", value: ["Galaxy S26 Ultra"] },
        { label: "Special Feature", value: ["Crafted for high-touch sensitivity.", "screen look pristine and spotless.", "Anti-scratch performance."] },
        { label: "Dimensions", value: ["74.6 x 185.1 x 0.2 mm"] },
        { label: "Weight", value: ["4g"] },
      ],
    },
  ],

  description: {
    title: "Samsung Galaxy S26 Ultra Anti-reflecting Film",
    blocks: [
      {
        paragraphs: [
          "Enjoy a clearer and more comfortable viewing experience with the Samsung Galaxy S26 Ultra Anti-reflecting Film. Designed to reduce glare and protect your screen, this ultra-thin optical film keeps your display sharp, smooth, and responsive. It’s the perfect solution for users who want to maintain their phone’s original display quality while adding an extra layer of protection.",
        ],
      },
      {
        heading: "Advanced Anti-Reflecting Technology",
        paragraphs: [
          "This high-quality optical film minimizes reflections and glare, making it easier to use your Galaxy S26 Ultra even under bright sunlight or strong indoor lighting. It enhances visibility while preserving the natural colors and clarity of your display. Crafted for high-touch sensitivity, this film ensures that every tap, swipe, and gesture feels smooth and accurate. You won’t experience any lag or reduced responsiveness, making it ideal for gaming, browsing, and daily use.",
        ],
      },
      {
        heading: "Reliable Anti-Scratch Protection",
        paragraphs: [
          "The film provides excellent anti-scratch performance, protecting your screen from everyday hazards like keys, dust, and minor abrasions. It helps keep your display looking pristine and spotless for longer. With a slim profile of just 0.2 mm thickness and a weight of only 4g, this film adds virtually no bulk to your device. It fits perfectly (74.6 x 185.1 mm) and maintains the original look and feel of your smartphone.",
        ],
      },
      {
        heading: "Buying the Samsung Galaxy S26 Ultra Anti-reflecting Film from Unique Mart",
        paragraphs: [
          "Every unit we list is sourced through official channels and intended for this market. Eligible purchases qualify for 0% EMI through partner banks, exchange is available on eligible products, and delivery is nationwide across Bangladesh.",
        ],
      },
    ],
  },
};
