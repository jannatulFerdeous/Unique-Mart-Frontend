export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export const categoryNav: NavItem[] = [
  {
    label: "Phones",
    href: "/shop/phones",
    children: [
      {
        label: "iPhone",
        href: "/shop/phones/iphone",
        children: [
          { label: "iPhone 17 Series", href: "/shop/phones/iphone/17-series" },
          { label: "iPhone 16 Series", href: "/shop/phones/iphone/16-series" },
          { label: "iPhone 15 Series", href: "/shop/phones/iphone/15-series" },
          { label: "iPhone SE", href: "/shop/phones/iphone/se" },
        ],
      },
      {
        label: "Android Phone",
        href: "/shop/phones/android",
        children: [
          { label: "Samsung", href: "/shop/phones/android/samsung" },
          { label: "Xiaomi", href: "/shop/phones/android/xiaomi" },
          { label: "Realme", href: "/shop/phones/android/realme" },
          { label: "OnePlus", href: "/shop/phones/android/oneplus" },
          { label: "Google Pixel", href: "/shop/phones/android/google-pixel" },
          { label: "Nothing", href: "/shop/phones/android/nothing" },
          { label: "Infinix", href: "/shop/phones/android/infinix" },
          { label: "Tecno", href: "/shop/phones/android/tecno" },
        ],
      },
      { label: "Feature Phone", href: "/shop/phones/feature-phone" },
      { label: "Refurbished Phone", href: "/shop/phones/refurbished" },
    ],
  },
  {
    label: "Mac",
    href: "/shop/mac",
    children: [
      {
        label: "MacBook",
        href: "/shop/mac/macbook",
        children: [
          { label: "MacBook Air", href: "/shop/mac/macbook/air" },
          { label: "MacBook Pro", href: "/shop/mac/macbook/pro" },
        ],
      },
      {
        label: "Desktop Mac",
        href: "/shop/mac/desktop",
        children: [
          { label: "iMac", href: "/shop/mac/desktop/imac" },
          { label: "Mac Mini", href: "/shop/mac/desktop/mac-mini" },
          { label: "Mac Studio", href: "/shop/mac/desktop/mac-studio" },
        ],
      },
      { label: "Mac Accessories", href: "/shop/mac/accessories" },
      { label: "Display", href: "/shop/mac/display" },
    ],
  },
  {
    label: "Phone Accessories",
    href: "/shop/phone-accessories",
    children: [
      {
        label: "Power Bank",
        href: "/shop/phone-accessories/power-bank",
        children: [
          { label: "Anker", href: "/shop/phone-accessories/power-bank/anker" },
          { label: "Baseus", href: "/shop/phone-accessories/power-bank/baseus" },
          { label: "UGREEN", href: "/shop/phone-accessories/power-bank/ugreen" },
          { label: "Xiaomi", href: "/shop/phone-accessories/power-bank/xiaomi" },
        ],
      },
      {
        label: "Charger & Adapter",
        href: "/shop/phone-accessories/charger",
        children: [
          { label: "Wall Charger", href: "/shop/phone-accessories/charger/wall" },
          { label: "Car Charger", href: "/shop/phone-accessories/charger/car" },
          { label: "Wireless Charger", href: "/shop/phone-accessories/charger/wireless" },
        ],
      },
      { label: "Cable & Converter", href: "/shop/phone-accessories/cable" },
      { label: "Phone Holder", href: "/shop/phone-accessories/holder" },
      { label: "Selfie Stick & Gimbal", href: "/shop/phone-accessories/gimbal" },
      { label: "Memory Card", href: "/shop/phone-accessories/memory-card" },
    ],
  },
  {
    label: "Tablets",
    href: "/shop/tablets",
    children: [
      {
        label: "iPad",
        href: "/shop/tablets/ipad",
        children: [
          { label: "iPad Pro", href: "/shop/tablets/ipad/pro" },
          { label: "iPad Air", href: "/shop/tablets/ipad/air" },
          { label: "iPad Mini", href: "/shop/tablets/ipad/mini" },
          { label: "iPad", href: "/shop/tablets/ipad/standard" },
        ],
      },
      {
        label: "Android Tablet",
        href: "/shop/tablets/android",
        children: [
          { label: "Samsung Galaxy Tab", href: "/shop/tablets/android/samsung" },
          { label: "Xiaomi Pad", href: "/shop/tablets/android/xiaomi" },
          { label: "Lenovo Tab", href: "/shop/tablets/android/lenovo" },
        ],
      },
      { label: "Drawing Tablet", href: "/shop/tablets/drawing" },
      { label: "Tablet Accessories", href: "/shop/tablets/accessories" },
    ],
  },
  {
    label: "Cases & Protectors",
    href: "/shop/cases-protectors",
    children: [
      {
        label: "Phone Case",
        href: "/shop/cases-protectors/phone-case",
        children: [
          { label: "iPhone Case", href: "/shop/cases-protectors/phone-case/iphone" },
          { label: "Samsung Case", href: "/shop/cases-protectors/phone-case/samsung" },
          { label: "MagSafe Case", href: "/shop/cases-protectors/phone-case/magsafe" },
        ],
      },
      {
        label: "Screen Protector",
        href: "/shop/cases-protectors/screen-protector",
        children: [
          { label: "Tempered Glass", href: "/shop/cases-protectors/screen-protector/tempered-glass" },
          { label: "Privacy Glass", href: "/shop/cases-protectors/screen-protector/privacy" },
          { label: "Camera Protector", href: "/shop/cases-protectors/screen-protector/camera" },
        ],
      },
      { label: "Tablet Case", href: "/shop/cases-protectors/tablet-case" },
      { label: "Laptop Sleeve", href: "/shop/cases-protectors/laptop-sleeve" },
      { label: "Watch Case", href: "/shop/cases-protectors/watch-case" },
    ],
  },
  {
    label: "Watches",
    href: "/shop/watches",
    children: [
      {
        label: "Wrist Watch",
        href: "/shop/watches/wrist-watch",
        children: [
          { label: "Men's Watch", href: "/shop/watches/wrist-watch/mens" },
          { label: "Women's Watch", href: "/shop/watches/wrist-watch/womens" },
          { label: "KENNETH COLE", href: "/shop/watches/wrist-watch/kenneth-cole" },
          { label: "Santa Barbara", href: "/shop/watches/wrist-watch/santa-barbara" },
          { label: "Police", href: "/shop/watches/wrist-watch/police" },
          { label: "Fossil", href: "/shop/watches/wrist-watch/fossil" },
          { label: "Michael Kors", href: "/shop/watches/wrist-watch/michael-kors" },
          { label: "Tommy Hilfiger", href: "/shop/watches/wrist-watch/tommy-hilfiger" },
          { label: "Tissot", href: "/shop/watches/wrist-watch/tissot" },
          { label: "Seiko", href: "/shop/watches/wrist-watch/seiko" },
          { label: "Daniel Klein", href: "/shop/watches/wrist-watch/daniel-klein" },
          { label: "Casio", href: "/shop/watches/wrist-watch/casio" },
        ],
      },
      {
        label: "Smart Watch",
        href: "/shop/watches/smart-watch",
        children: [
          { label: "Apple Watch", href: "/shop/watches/smart-watch/apple" },
          { label: "Samsung Galaxy Watch", href: "/shop/watches/smart-watch/samsung" },
          { label: "Amazfit", href: "/shop/watches/smart-watch/amazfit" },
          { label: "Huawei", href: "/shop/watches/smart-watch/huawei" },
          { label: "Xiaomi", href: "/shop/watches/smart-watch/xiaomi" },
          { label: "Haylou", href: "/shop/watches/smart-watch/haylou" },
          { label: "Kids Watch", href: "/shop/watches/smart-watch/kids" },
        ],
      },
      { label: "Smart Bands", href: "/shop/watches/smart-bands" },
      { label: "Watch Strap", href: "/shop/watches/watch-strap" },
      { label: "Watch Accessories", href: "/shop/watches/accessories" },
    ],
  },
  {
    label: "Headphone & Speaker",
    href: "/shop/headphone-speaker",
    children: [
      {
        label: "Earbuds",
        href: "/shop/headphone-speaker/earbuds",
        children: [
          { label: "AirPods", href: "/shop/headphone-speaker/earbuds/airpods" },
          { label: "Samsung Buds", href: "/shop/headphone-speaker/earbuds/samsung" },
          { label: "Soundcore", href: "/shop/headphone-speaker/earbuds/soundcore" },
          { label: "JBL", href: "/shop/headphone-speaker/earbuds/jbl" },
        ],
      },
      { label: "Headphone", href: "/shop/headphone-speaker/headphone" },
      { label: "Neckband", href: "/shop/headphone-speaker/neckband" },
      { label: "Wired Earphone", href: "/shop/headphone-speaker/wired-earphone" },
      { label: "Bluetooth Speaker", href: "/shop/headphone-speaker/bluetooth-speaker" },
      { label: "Soundbar", href: "/shop/headphone-speaker/soundbar" },
      { label: "Microphone", href: "/shop/headphone-speaker/microphone" },
    ],
  },
  {
    label: "PC Accessories",
    href: "/shop/pc-accessories",
    children: [
      {
        label: "Keyboard",
        href: "/shop/pc-accessories/keyboard",
        children: [
          { label: "Mechanical Keyboard", href: "/shop/pc-accessories/keyboard/mechanical" },
          { label: "Wireless Keyboard", href: "/shop/pc-accessories/keyboard/wireless" },
          { label: "Gaming Keyboard", href: "/shop/pc-accessories/keyboard/gaming" },
        ],
      },
      {
        label: "Mouse",
        href: "/shop/pc-accessories/mouse",
        children: [
          { label: "Wireless Mouse", href: "/shop/pc-accessories/mouse/wireless" },
          { label: "Gaming Mouse", href: "/shop/pc-accessories/mouse/gaming" },
          { label: "Mouse Pad", href: "/shop/pc-accessories/mouse/mouse-pad" },
        ],
      },
      { label: "Monitor", href: "/shop/pc-accessories/monitor" },
      { label: "Hub & Dock", href: "/shop/pc-accessories/hub-dock" },
      { label: "SSD & Storage", href: "/shop/pc-accessories/storage" },
      { label: "Laptop Stand", href: "/shop/pc-accessories/laptop-stand" },
      { label: "Webcam", href: "/shop/pc-accessories/webcam" },
      { label: "UPS", href: "/shop/pc-accessories/ups" },
    ],
  },
  {
    label: "Camera",
    href: "/shop/camera",
    children: [
      {
        label: "Action Camera",
        href: "/shop/camera/action-camera",
        children: [
          { label: "GoPro", href: "/shop/camera/action-camera/gopro" },
          { label: "DJI Osmo", href: "/shop/camera/action-camera/dji-osmo" },
          { label: "Insta360", href: "/shop/camera/action-camera/insta360" },
        ],
      },
      { label: "DSLR & Mirrorless", href: "/shop/camera/dslr-mirrorless" },
      { label: "Security Camera", href: "/shop/camera/security-camera" },
      { label: "Tripod & Gimbal", href: "/shop/camera/tripod-gimbal" },
      { label: "Camera Accessories", href: "/shop/camera/accessories" },
    ],
  },
  {
    label: "Gadget",
    href: "/shop/gadget",
    children: [
      {
        label: "Smart Home",
        href: "/shop/gadget/smart-home",
        children: [
          { label: "Smart Light", href: "/shop/gadget/smart-home/smart-light" },
          { label: "Smart Plug", href: "/shop/gadget/smart-home/smart-plug" },
          { label: "Smart Lock", href: "/shop/gadget/smart-home/smart-lock" },
          { label: "Robot Vacuum", href: "/shop/gadget/smart-home/robot-vacuum" },
        ],
      },
      { label: "Health Gadget", href: "/shop/gadget/health" },
      { label: "Trimmer & Shaver", href: "/shop/gadget/trimmer-shaver" },
      { label: "Portable Fan", href: "/shop/gadget/portable-fan" },
      { label: "Massager", href: "/shop/gadget/massager" },
      { label: "Lifestyle Gadget", href: "/shop/gadget/lifestyle" },
    ],
  },
  {
    label: "Networking",
    href: "/shop/networking",
    children: [
      {
        label: "Router",
        href: "/shop/networking/router",
        children: [
          { label: "Wi-Fi 6 Router", href: "/shop/networking/router/wifi-6" },
          { label: "Dual Band Router", href: "/shop/networking/router/dual-band" },
          { label: "Pocket Router", href: "/shop/networking/router/pocket" },
        ],
      },
      { label: "Mesh System", href: "/shop/networking/mesh-system" },
      { label: "Range Extender", href: "/shop/networking/range-extender" },
      { label: "Network Switch", href: "/shop/networking/network-switch" },
      { label: "Network Adapter", href: "/shop/networking/network-adapter" },
    ],
  },
  {
    label: "Gaming",
    href: "/shop/gaming",
    children: [
      {
        label: "Console",
        href: "/shop/gaming/console",
        children: [
          { label: "PlayStation", href: "/shop/gaming/console/playstation" },
          { label: "Xbox", href: "/shop/gaming/console/xbox" },
          { label: "Nintendo Switch", href: "/shop/gaming/console/nintendo-switch" },
        ],
      },
      { label: "Controller", href: "/shop/gaming/controller" },
      { label: "Gaming Headset", href: "/shop/gaming/headset" },
      { label: "Gaming Chair", href: "/shop/gaming/chair" },
      { label: "Gaming Accessories", href: "/shop/gaming/accessories" },
    ],
  },
  {
    label: "Drone",
    href: "/shop/drone",
    children: [
      {
        label: "DJI Drone",
        href: "/shop/drone/dji",
        children: [
          { label: "DJI Mini", href: "/shop/drone/dji/mini" },
          { label: "DJI Air", href: "/shop/drone/dji/air" },
          { label: "DJI Mavic", href: "/shop/drone/dji/mavic" },
        ],
      },
      { label: "FPV Drone", href: "/shop/drone/fpv" },
      { label: "Beginner Drone", href: "/shop/drone/beginner" },
      { label: "Drone Accessories", href: "/shop/drone/accessories" },
    ],
  },
];

export const utilityNav: NavItem[] = [
  { label: "Offers", href: "/offers" },
  { label: "Store Locator", href: "/store-locator" },
];
