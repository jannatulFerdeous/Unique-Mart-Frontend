import type { Product } from "./catalog";
/* These two use the plain product shot rather than the catalogue thumbnail:
   upstream burns an "UP TO 40% OFF" promo graphic into the thumbnail, which is
   the reference's campaign, not ours — and on the offers page it collided with
   our own discount ribbon. See memory.md. */
import appleIpadAir13InchWifiM3ChipDisplayUnit from "@/images/products/ipad-air-13-inch-wifi-m3-chip-display-unit/02-ipad-air-13-inch-wifi-m3-chip745.jpeg";
import appleMacbookAir15InchM4ChipDisplayUnit from "@/images/products/macbook-air-15-inch-m4-chip-display-unit/02-macbook-air-13-inch-m4-chip-24gb-512gb-midnight35.jpeg";
import appleMagicKeyboardForIpadAir13Inch from "@/images/brands/apple-magic-keyboard-for-ipad-air-13-inch.jpeg";
import appleWatchSe3 from "@/images/brands/apple-watch-se-3.jpeg";
import appleWatchSeries11 from "@/images/brands/apple-watch-series-11.jpeg";
import honorMagicV3 from "@/images/brands/honor-magic-v3.jpeg";
import honorPadX74gb128gb from "@/images/brands/honor-pad-x7-4gb-128gb.jpeg";
import honorPadX8b6gb128gb from "@/images/brands/honor-pad-x8b-6gb-128gb.jpeg";
import honorWatch5UltraFluororubberStrap from "@/images/brands/honor-watch-5-ultra-fluororubber-strap.jpeg";
import honorX9d from "@/images/brands/honor-x9d.jpeg";
import infinixHot60Pro from "@/images/brands/infinix-hot-60-pro.jpeg";
import infinixHot706gb128gb from "@/images/brands/infinix-hot-70-6gb-128gb.jpeg";
import infinixHot708gb128gb from "@/images/brands/infinix-hot-70-8gb-128gb.jpeg";
import infinixSmart204gb128gb from "@/images/brands/infinix-smart-20-4gb-128gb.jpeg";
import infinixXpad20 from "@/images/brands/infinix-xpad-20.jpeg";
import oneplusNordBuds4ProEarbuds from "@/images/brands/oneplus-nord-buds-4-pro-earbuds.jpeg";
import oneplusPad412gb512gb from "@/images/brands/oneplus-pad-4-12gb-512gb.jpeg";
import oneplusPadGo25g from "@/images/brands/oneplus-pad-go-2-5g.jpeg";
import oneplusPadLite8gb128gb from "@/images/brands/oneplus-pad-lite-8gb-128gb.jpeg";
import oneplusPadLite8gb128gbWithFolioCase from "@/images/brands/oneplus-pad-lite-8gb-128gb-with-folio-case.jpeg";
import oppoA6 from "@/images/brands/oppo-a6.jpeg";
import oppoA68gb256gb from "@/images/brands/oppo-a6-8gb-256gb.jpeg";
import oppoA6c from "@/images/brands/oppo-a6c.jpeg";
import oppoA6k6gb128gb from "@/images/brands/oppo-a6k-6gb-128gb.jpeg";
import oppoA6sPro from "@/images/brands/oppo-a6s-pro.jpeg";
import realme15Pro5g from "@/images/brands/realme-15-pro-5g.jpeg";
import realmeC100i4gb128gb from "@/images/brands/realme-c100i-4gb-128gb.jpeg";
import realmeC100x from "@/images/brands/realme-c100x.jpeg";
import realmeC100x6gb128gb from "@/images/brands/realme-c100x-6gb-128gb.jpeg";
import realmeC85Pro8gb128gb from "@/images/brands/realme-c85-pro-8gb-128gb.jpeg";
import samsung60wPdFastCharger from "@/images/brands/samsung-60w-pd-fast-charger.jpeg";
import samsungGalaxyBuds4Pro from "@/images/brands/samsung-galaxy-buds-4-pro.jpeg";
import samsungGalaxyS26UltraAntiReflectingFilm from "@/images/brands/samsung-galaxy-s26-ultra-anti-reflecting-film.jpeg";
import samsungGalaxyS26UltraClearCase from "@/images/brands/samsung-galaxy-s26-ultra-clear-case.jpeg";
import samsungGalaxyS26UltraClearMagnetCase from "@/images/brands/samsung-galaxy-s26-ultra-clear-magnet-case.jpeg";
import tecnoCamonAir from "@/images/brands/tecno-camon-air.jpeg";
import tecnoSpark50Pro from "@/images/brands/tecno-spark-50-pro.jpeg";
import tecnoSpark50Pro4gb128gb from "@/images/brands/tecno-spark-50-pro-4gb-128gb.jpeg";
import tecnoSpark50Pro8gb128gb from "@/images/brands/tecno-spark-50-pro-8gb-128gb.jpeg";
import tecnoWatch3ActiveSmartWatch from "@/images/brands/tecno-watch-3-active-smart-watch.jpeg";
import vivoV70Fe5g12gb256gb from "@/images/brands/vivo-v70-fe-5g-12gb-256gb.jpeg";
import vivoY054gb128gb from "@/images/brands/vivo-y05-4gb-128gb.jpeg";
import vivoY05e from "@/images/brands/vivo-y05e.jpeg";
import vivoY31d4gb128gb from "@/images/brands/vivo-y31d-4gb-128gb.jpeg";
import vivoY500 from "@/images/brands/vivo-y500.jpeg";
import xiaomi67wUsbCharger from "@/images/brands/xiaomi-67w-usb-charger.jpeg";
import xiaomiPad8 from "@/images/brands/xiaomi-pad-8.jpeg";
import xiaomiRedmi176gb128gb from "@/images/brands/xiaomi-redmi-17-6gb-128gb.jpeg";
import xiaomiRedmiBuds8LiteEarbuds from "@/images/brands/xiaomi-redmi-buds-8-lite-earbuds.jpeg";
import xiaomiRedmiPad297Inch4gb128gb from "@/images/brands/xiaomi-redmi-pad-2-9-7-inch-4gb-128gb.jpeg";
import googleFitbitAir from "@/images/products/google-fitbit-air.jpeg";
import jblBoombox4 from "@/images/products/jbl-boombox-4.jpeg";
import jblCharge6PortableWirelessSpeaker from "@/images/products/jbl-charge-6-portable-wireless-speaker.jpeg";
import jblFlip7PortableWirelessSpeaker from "@/images/products/jbl-flip-7-portable-wireless-speaker.jpeg";
import pitakaUltraslimCaseForIphone17ProMaxSunset from "@/images/products/pitaka-ultraslim-case-for-iphone-17-pro-max-sunset.jpeg";
import spigenUltraHybridCaseForIphone17ProMax from "@/images/products/spigen-ultra-hybrid-case-for-iphone-17-pro-max.jpeg";
import torrasInstallMasterScreenProtectorsForGalaxyS25Ultra from "@/images/products/torras-install-master-screen-protectors-for-galaxy-s25-ultra.jpeg";
import torrasOstandProCaseForIphone17ProMax from "@/images/products/torras-ostand-pro-case-for-iphone-17-pro-max.jpeg";
import tpLinkArcherAx73DualBandGigabitRouter from "@/images/products/tp-link-archer-ax73-dual-band-gigabit-router.jpeg";
import tpLinkDecoM4Router3Pack from "@/images/products/tp-link-deco-m4-router-3-pack.jpeg";
import tpLinkDecoS7Router3Pack from "@/images/products/tp-link-deco-s7-router-3-pack.jpeg";
import galaxyWatch7 from "@/images/products/galaxy-watch-7.jpeg";
import galaxyWatch8 from "@/images/products/galaxy-watch-8.jpeg";
import galaxyWatch8Classic from "@/images/products/galaxy-watch-8-classic.jpeg";
import ipadPro11InchWifiM5Chip from "@/images/products/ipad-pro-11-inch-wifi-m5-chip.jpeg";
import ipadPro13InchM5Chip from "@/images/products/ipad-pro-13-inch-m5-chip.jpeg";
import macbookPro14InchM5Chip16gb1tb from "@/images/products/macbook-pro-14-inch-m5-chip-16gb-1tb.jpeg";
import starlinkMiniKit from "@/images/products/starlink-mini-kit.jpeg";
import starlinkStandardKit from "@/images/products/starlink-standard-kit.jpeg";
import bearbrickAudioPortableBluetoothSpeaker from "@/images/products/bearbrick-audio-portable-bluetooth-speaker.jpeg";
import jblGo5BluetoothSpeaker from "@/images/products/jbl-go-5-bluetooth-speaker.jpeg";
import jblPartybox520WirelessSpeaker from "@/images/products/jbl-partybox-520-wireless-speaker.jpeg";
import jblPartyboxOnTheGo2PortableSpeaker from "@/images/products/jbl-partybox-on-the-go-2-portable-speaker.jpeg";
import jblXtreme5 from "@/images/products/jbl-xtreme-5.jpeg";
import marshallKilburnIiiPortableBluetoothSpeaker from "@/images/products/marshall-kilburn-iii-portable-bluetooth-speaker.jpeg";
import marshallMiddletonIiBluetoothSpeaker from "@/images/products/marshall-middleton-ii-bluetooth-speaker.jpeg";
import sonySrsUlt50PortableWirelessSpeaker from "@/images/products/sony-srs-ult50-portable-wireless-speaker.jpeg";
import appleClearMagsafeCaseForIphone17 from "@/images/products/apple-clear-magsafe-case-for-iphone-17.jpeg";
import belkinSheerforceClearCaseForIphoneAir from "@/images/products/belkin-sheerforce-clear-case-for-iphone-air.jpeg";
import belkinSheerforceGripSeriesCaseForIphone17Pro from "@/images/products/belkin-sheerforce-grip-series-case-for-iphone-17-pro.jpeg";
import spigenLiquidAirMagfitCaseForGalaxyS26Ultra from "@/images/products/spigen-liquid-air-magfit-case-for-galaxy-s26-ultra.jpeg";
import spigenUltraHybridMagfitCaseForGalaxyS26Ultra from "@/images/products/spigen-ultra-hybrid-magfit-case-for-galaxy-s26-ultra.jpeg";
import spigenUltraHybridNeoOneMagfitCaseForGalaxyS26Ultra from "@/images/products/spigen-ultra-hybrid-neo-one-magfit-case-for-galaxy-s26-ultra.jpeg";
import torrasInstallMasterScreenProtectorForGalaxyS26Ultra from "@/images/products/torras-install-master-screen-protector-for-galaxy-s26-ultra.jpeg";
import torrasOstandSlimCaseForGalaxyS26 from "@/images/products/torras-ostand-slim-case-for-galaxy-s26.jpeg";
import uagExclusivePathfinderMagsafeCaseForIphone17Pro from "@/images/products/uag-exclusive-pathfinder-magsafe-case-for-iphone-17-pro.jpeg";
import airpods from "@/images/products/airpods-pro-3.jpeg";
import iphoneAir from "@/images/products/iphone-air.jpeg";
import iphone17 from "@/images/products/iphone-17.jpeg";
import iphone17Pro from "@/images/products/iphone-17-pro.jpeg";
import iphone17ProMax from "@/images/products/iphone-17-pro-max.jpeg";
import macbook256 from "@/images/products/macbook-neo-256.png";
import macbook512 from "@/images/products/macbook-neo-512.png";

/* Every product in the catalogue. Moved out of `modules/Home/config` on
   2026-09-06 because a second module needs it: the product detail page looks a
   product up by slug. Names, prices, ratings and imagery are the reference
   site's — placeholders until a real catalogue exists. See memory.md. */

export const exclusiveProducts: Product[] = [
  { slug: "airpods-pro-3", name: "AirPods Pro 3", image: airpods, price: 28999, compareAt: 30999, rating: 5 },
  { slug: "iphone-air", name: "iPhone Air", image: iphoneAir, price: 164999, compareAt: 189999, rating: 5 },
  { slug: "iphone-17-pro-max", name: "iPhone 17 Pro Max", image: iphone17ProMax, price: 204999, compareAt: 219999, rating: 5 },
  { slug: "iphone-17", name: "iPhone 17", image: iphone17, price: 147999, compareAt: 179999, rating: 5 },
  { slug: "iphone-17-pro", name: "iPhone 17 Pro", image: iphone17Pro, price: 186499, compareAt: 197999, rating: 5 },
  { slug: "macbook-neo-8-256", name: "MacBook Neo 8/256GB", image: macbook256, price: 105999, compareAt: 112999, rating: 5, badge: "NEW ARRIVAL" },
  { slug: "macbook-neo-8-512", name: "MacBook Neo 8/512GB", image: macbook512, price: 120999, compareAt: 127999, rating: 5, badge: "NEW ARRIVAL" },
];

export const soundSurroundProducts: Product[] = [
  { slug: "jbl-partybox-520-wireless-speaker", name: "JBL PartyBox 520 Wireless Speaker", image: jblPartybox520WirelessSpeaker, brand: "JBL", price: 74999, compareAt: 79999, rating: 5 },
  { slug: "sony-srs-ult50-portable-wireless-speaker", name: "Sony SRS-ULT50 Wireless Bluetooth Speaker", image: sonySrsUlt50PortableWirelessSpeaker, brand: "Sony", price: 43999, rating: 5 },
  { slug: "marshall-kilburn-iii-portable-bluetooth-speaker", name: "Marshall Kilburn III Portable Bluetooth Speaker", image: marshallKilburnIiiPortableBluetoothSpeaker, brand: "Marshall", price: 44999, compareAt: 47999, rating: 5 },
  { slug: "marshall-middleton-ii-bluetooth-speaker", name: "Marshall Middleton II Portable Bluetooth Speaker", image: marshallMiddletonIiBluetoothSpeaker, brand: "Marshall", price: 35999, compareAt: 37999, rating: 5 },
  { slug: "jbl-partybox-on-the-go-2-portable-speaker", name: "JBL PartyBox On-the-Go 2 Portable Speaker", image: jblPartyboxOnTheGo2PortableSpeaker, brand: "JBL", price: 44999, compareAt: 47999, rating: 5 },
  { slug: "jbl-xtreme-5", name: "JBL XTREME 5 Portable Bluetooth Speaker", image: jblXtreme5, brand: "JBL", price: 39999, compareAt: 42999, rating: 5 },
  { slug: "jbl-go-5-bluetooth-speaker", name: "JBL GO 5 Portable Bluetooth Speaker", image: jblGo5BluetoothSpeaker, brand: "JBL", price: 6499, compareAt: 6999, rating: 5 },
  { slug: "bearbrick-audio-portable-bluetooth-speaker", name: "BE@RBRICK Audio Portable Bluetooth Speaker", image: bearbrickAudioPortableBluetoothSpeaker, brand: "BE@RBRICK", price: 64999, rating: 5 },
];

export const newArrivalProducts: Product[] = [
  { slug: "galaxy-watch-8-classic", name: "Galaxy Watch 8 Classic", image: galaxyWatch8Classic, brand: "Samsung", price: 33499, compareAt: 35499, rating: 5 },
  { slug: "galaxy-watch-8", name: "Galaxy Watch 8", image: galaxyWatch8, brand: "Samsung", price: 25999, compareAt: 27499, rating: 5 },
  { slug: "galaxy-watch-7", name: "Galaxy Watch 7", image: galaxyWatch7, brand: "Samsung", price: 20999, compareAt: 22499, rating: 4.8 },
  { slug: "starlink-mini-kit", name: "Starlink Mini Kit", image: starlinkMiniKit, brand: "Starlink", price: 26500, compareAt: 28500, rating: 5 },
  { slug: "starlink-standard-kit", name: "Starlink Standard Kit", image: starlinkStandardKit, brand: "Starlink", price: 49500, rating: 5 },
  { slug: "macbook-pro-14-inch-m5-chip-16gb-1tb", name: "MacBook Pro 14\" M5 Chip 16GB/1TB (10C CPU 10C GPU)", image: macbookPro14InchM5Chip16gb1tb, brand: "Apple", price: 314999, compareAt: 339999, rating: 5 },
  { slug: "ipad-pro-13-inch-m5-chip", name: "iPad Pro 13\" WiFi M5 Chip 256GB with Standard Glass", image: ipadPro13InchM5Chip, brand: "Apple", price: 214999, compareAt: 229999, rating: 5 },
  { slug: "ipad-pro-11-inch-wifi-m5-chip", name: "iPad Pro 11\" WiFi M5 Chip 256GB with Standard Glass", image: ipadPro11InchWifiM5Chip, brand: "Apple", price: 167999, compareAt: 179999, rating: 5 },
];

export const casesProducts: Product[] = [
  { slug: "uag-exclusive-pathfinder-magsafe-case-for-iphone-17-pro", name: "UAG Exclusive Pathfinder MagSafe Case for iPhone 17 Pro", image: uagExclusivePathfinderMagsafeCaseForIphone17Pro, brand: "UAG", price: 5999, compareAt: 6999, badge: "NEW ARRIVAL" },
  // Upstream slug misspells this one “ultra-hyrbird”; ours is corrected.
  { slug: "spigen-ultra-hybrid-magfit-case-for-galaxy-s26-ultra", name: "Spigen Ultra Hybrid MagFit Case for Galaxy S26 Ultra", image: spigenUltraHybridMagfitCaseForGalaxyS26Ultra, brand: "Spigen", price: 2999, badge: "NEW ARRIVAL" },
  { slug: "spigen-ultra-hybrid-neo-one-magfit-case-for-galaxy-s26-ultra", name: "Spigen Ultra Hybrid Neo One Magfit Case for Galaxy S26 Ultra", image: spigenUltraHybridNeoOneMagfitCaseForGalaxyS26Ultra, brand: "Spigen", price: 4499, badge: "NEW ARRIVAL" },
  { slug: "spigen-liquid-air-magfit-case-for-galaxy-s26-ultra", name: "Spigen Liquid Air (MagFit) Case for Galaxy S26 Ultra", image: spigenLiquidAirMagfitCaseForGalaxyS26Ultra, brand: "Spigen", price: 2799, badge: "NEW ARRIVAL" },
  { slug: "torras-ostand-slim-case-for-galaxy-s26", name: "TORRAS Ostand Slim Case for Galaxy S26", image: torrasOstandSlimCaseForGalaxyS26, brand: "Torras", price: 3999, badge: "NEW ARRIVAL" },
  { slug: "torras-install-master-screen-protector-for-galaxy-s26-ultra", name: "TORRAS Install Master Screen Protector for Galaxy S26 Ultra", image: torrasInstallMasterScreenProtectorForGalaxyS26Ultra, brand: "Torras", price: 2999 },
  { slug: "apple-clear-magsafe-case-for-iphone-17", name: "Apple Clear MagSafe Case for iPhone 17", image: appleClearMagsafeCaseForIphone17, brand: "Apple", price: 8499 },
  { slug: "belkin-sheerforce-grip-series-case-for-iphone-17-pro", name: "Belkin SheerForce Grip Series Case for iPhone 17 Pro", image: belkinSheerforceGripSeriesCaseForIphone17Pro, brand: "Belkin", price: 3499, compareAt: 3999 },
  { slug: "belkin-sheerforce-clear-case-for-iphone-air", name: "Belkin SheerForce Clear Case for iPhone Air", image: belkinSheerforceClearCaseForIphoneAir, brand: "Belkin", price: 3999, compareAt: 4499 },
];

export const topSellingProducts: Product[] = [
  { slug: "torras-install-master-screen-protectors-for-galaxy-s25-ultra", name: "Torras Install Master Screen Protectors for Galaxy S25 Ultra", image: torrasInstallMasterScreenProtectorsForGalaxyS25Ultra, brand: "Torras", price: 2999 },
  { slug: "jbl-charge-6-portable-wireless-speaker", name: "JBL Charge 6 Portable Wireless Speaker", image: jblCharge6PortableWirelessSpeaker, brand: "JBL", price: 16499, compareAt: 17499, rating: 5 },
  { slug: "jbl-flip-7-portable-wireless-speaker", name: "JBL Flip 7 Portable Wireless Speaker", image: jblFlip7PortableWirelessSpeaker, brand: "JBL", price: 12499, compareAt: 13499, rating: 5 },
  { slug: "torras-ostand-pro-case-for-iphone-17-pro-max", name: "TORRAS Ostand R Case for iPhone 17 Pro Max", image: torrasOstandProCaseForIphone17ProMax, brand: "Torras", price: 4499 },
  { slug: "pitaka-ultraslim-case-for-iphone-17-pro-max-sunset", name: "PITAKA Ultra-Slim Sunset Case for iPhone 17 Pro Max", image: pitakaUltraslimCaseForIphone17ProMaxSunset, brand: "PITAKA", price: 8499 },
  { slug: "spigen-ultra-hybrid-case-for-iphone-17-pro-max", name: "Spigen ULTRA HYBRID Case for iPhone 17 Pro Max", image: spigenUltraHybridCaseForIphone17ProMax, brand: "Spigen", price: 2699 },
  { slug: "iphone-17-pro-max", name: "iPhone 17 Pro Max", image: iphone17ProMax, brand: "Apple", price: 204999, compareAt: 219999, rating: 5 },
  { slug: "tp-link-archer-ax73-dual-band-gigabit-router", name: "TP-Link Archer AX73 AX5400 Dual-Band Gigabit Wi-Fi Router", image: tpLinkArcherAx73DualBandGigabitRouter, brand: "TP-Link", price: 15999, rating: 5 },
  { slug: "tp-link-deco-m4-router-3-pack", name: "TP-Link Deco M4 AC1200 Dual-Band Mesh Router (3 Pack)", image: tpLinkDecoM4Router3Pack, brand: "TP-Link", price: 11399, rating: 5 },
  { slug: "tp-link-deco-s7-router-3-pack", name: "TP-Link Deco S7 AC1900 Dual Band Mesh Router (3-Pack)", image: tpLinkDecoS7Router3Pack, brand: "TP-Link", price: 14699, rating: 5 },
  { slug: "jbl-boombox-4", name: "JBL Boombox 4", image: jblBoombox4, brand: "JBL", price: 52999, compareAt: 55999, rating: 5 },
  { slug: "google-fitbit-air", name: "Google Fitbit Air", image: googleFitbitAir, brand: "Google", price: 20999, rating: 5 },
];

/** Keyed by the brand tab's `key` in `home_data.brands`. */
export const brandProducts: Record<string, Product[]> = {
  samsung: [
  { slug: "samsung-galaxy-buds-4-pro", name: "Samsung Galaxy Buds4 Pro", image: samsungGalaxyBuds4Pro, brand: "Samsung", price: 21999, compareAt: 22999 },
  { slug: "samsung-galaxy-s26-ultra-anti-reflecting-film", name: "Samsung Galaxy S26 Ultra Anti-reflecting Film", image: samsungGalaxyS26UltraAntiReflectingFilm, brand: "Samsung", price: 2999 },
  { slug: "samsung-galaxy-s26-ultra-clear-case", name: "Samsung Clear Case for Galaxy S26 Ultra", image: samsungGalaxyS26UltraClearCase, brand: "Samsung", price: 2999 },
  { slug: "samsung-galaxy-s26-ultra-clear-magnet-case", name: "Samsung Galaxy S26 Ultra Clear Magnet Case", image: samsungGalaxyS26UltraClearMagnetCase, brand: "Samsung", price: 4499 },
  { slug: "samsung-60w-pd-fast-charger", name: "Samsung 60W PD Fast Charger Adapter (without cable)", image: samsung60wPdFastCharger, brand: "Samsung", price: 5999 },
  ],
  apple: [
  { slug: "apple-magic-keyboard-for-ipad-air-13-inch", name: "Apple Magic Keyboard for iPad Air 13‑inch M4", image: appleMagicKeyboardForIpadAir13Inch, brand: "Apple", price: 54999 },
  { slug: "ipad-air-13-inch-wifi-m3-chip-display-unit", name: "iPad Air 13\" WiFi M3 Chip 128GB Space Gray (Display Unit)", image: appleIpadAir13InchWifiM3ChipDisplayUnit, brand: "Apple", price: 84999, compareAt: 139999 },
  { slug: "macbook-air-15-inch-m4-chip-display-unit", name: "MacBook Air 15\" M4 Chip 16/256GB Midnight (10C CPU 10C GPU) (Display Unit)", image: appleMacbookAir15InchM4ChipDisplayUnit, brand: "Apple", price: 149999, compareAt: 214999 },
  { slug: "apple-watch-se-3", name: "Apple Watch SE 3 (GPS) Aluminum Case", image: appleWatchSe3, brand: "Apple", price: 36999, compareAt: 38999 },
  { slug: "apple-watch-series-11", name: "Apple Watch Series 11 (GPS)", image: appleWatchSeries11, brand: "Apple", price: 49999, compareAt: 53999 },
  ],
  oppo: [
  { slug: "oppo-a6k-6gb-128gb", name: "OPPO A6k (6/128GB)", image: oppoA6k6gb128gb, brand: "Oppo", price: 25999 },
  { slug: "oppo-a6s-pro", name: "OPPO A6s Pro (8/256GB)", image: oppoA6sPro, brand: "Oppo", price: 39990 },
  { slug: "oppo-a6c", name: "Oppo A6c 4/64GB", image: oppoA6c, brand: "Oppo", price: 19999 },
  { slug: "oppo-a6-8gb-256gb", name: "OPPO A6 (8/256GB)", image: oppoA68gb256gb, brand: "Oppo", price: 36999 },
  { slug: "oppo-a6", name: "OPPO A6 (8/128GB)", image: oppoA6, brand: "Oppo", price: 32999 },
  ],
  vivo: [
  { slug: "vivo-y05-4gb-128gb", name: "Vivo Y05 (4/128GB)", image: vivoY054gb128gb, brand: "vivo", price: 20999 },
  { slug: "vivo-y31d-4gb-128gb", name: "Vivo Y31d (4/128GB)", image: vivoY31d4gb128gb, brand: "vivo", price: 27499 },
  { slug: "vivo-y05e", name: "Vivo Y05e (4/64GB)", image: vivoY05e, brand: "vivo", price: 16999 },
  { slug: "vivo-y500", name: "Vivo Y500 (6/128GB)", image: vivoY500, brand: "vivo", price: 39999 },
  { slug: "vivo-v70-fe-5g-12gb-256gb", name: "Vivo V70 FE 5G (12/256GB)", image: vivoV70Fe5g12gb256gb, brand: "vivo", price: 62999 },
  ],
  honor: [
  { slug: "honor-pad-x7-4gb-128gb", name: "Honor Pad X7 (4/128GB)", image: honorPadX74gb128gb, brand: "HONOR", price: 16999 },
  { slug: "honor-magic-v3", name: "HONOR Magic V3 12/512GB", image: honorMagicV3, brand: "HONOR", price: 179999 },
  { slug: "honor-pad-x8b-6gb-128gb", name: "HONOR Pad X8b (6/128GB)", image: honorPadX8b6gb128gb, brand: "HONOR", price: 24999 },
  { slug: "honor-watch-5-ultra-fluororubber-strap", name: "HONOR Watch 5 Ultra Fluororubber Strap (46mm)", image: honorWatch5UltraFluororubberStrap, brand: "HONOR", price: 32999 },
  { slug: "honor-x9d", name: "HONOR X9d 5G (12/256GB)", image: honorX9d, brand: "HONOR", price: 46999 },
  ],
  oneplus: [
  { slug: "oneplus-pad-4-12gb-512gb", name: "OnePlus Pad 4 (12/512GB)", image: oneplusPad412gb512gb, brand: "OnePlus", price: 109999 },
  { slug: "oneplus-nord-buds-4-pro-earbuds", name: "OnePlus Nord Buds 4 Pro Earbuds", image: oneplusNordBuds4ProEarbuds, brand: "OnePlus", price: 5499 },
  { slug: "oneplus-pad-lite-8gb-128gb-with-folio-case", name: "OnePlus Pad Lite LTE (8/128GB) With Folio Case", image: oneplusPadLite8gb128gbWithFolioCase, brand: "OnePlus", price: 32999 },
  { slug: "oneplus-pad-go-2-5g", name: "OnePlus Pad Go 2 5G (8/256GB)", image: oneplusPadGo25g, brand: "OnePlus", price: 49999 },
  { slug: "oneplus-pad-lite-8gb-128gb", name: "OnePlus Pad Lite LTE (8/128GB)", image: oneplusPadLite8gb128gb, brand: "OnePlus", price: 29999 },
  ],
  tecno: [
  { slug: "tecno-watch-3-active-smart-watch", name: "TECNO Watch 3 Active Smart Watch", image: tecnoWatch3ActiveSmartWatch, brand: "Tecno", price: 2695 },
  { slug: "tecno-spark-50-pro-8gb-128gb", name: "Tecno SPARK 50 Pro (8/128GB)", image: tecnoSpark50Pro8gb128gb, brand: "Tecno", price: 30999 },
  { slug: "tecno-spark-50-pro-4gb-128gb", name: "Tecno SPARK 50 Pro (4/128GB)", image: tecnoSpark50Pro4gb128gb, brand: "Tecno", price: 24999 },
  { slug: "tecno-spark-50-pro", name: "Tecno SPARK 50 Pro (6/128GB)", image: tecnoSpark50Pro, brand: "Tecno", price: 26999 },
  { slug: "tecno-camon-air", name: "TECNO Camon Air (8/128GB)", image: tecnoCamonAir, brand: "Tecno", price: 44999 },
  ],
  infinix: [
  { slug: "infinix-hot-70-8gb-128gb", name: "Infinix Hot 70 (8/128GB)", image: infinixHot708gb128gb, brand: "Infinix", price: 25999 },
  { slug: "infinix-hot-70-6gb-128gb", name: "Infinix Hot 70 (6/128GB)", image: infinixHot706gb128gb, brand: "Infinix", price: 24999 },
  { slug: "infinix-xpad-20", name: "Infinix Xpad 20 (6/128GB)", image: infinixXpad20, brand: "Infinix", price: 19999 },
  { slug: "infinix-hot-60-pro", name: "Infinix Hot 60 Pro (8/128GB)", image: infinixHot60Pro, brand: "Infinix", price: 20999 },
  { slug: "infinix-smart-20-4gb-128gb", name: "Infinix Smart 20 (4/128GB)", image: infinixSmart204gb128gb, brand: "Infinix", price: 16999 },
  ],
  realme: [
  { slug: "realme-15-pro-5g", name: "realme 15 Pro 5G (12/256GB)", image: realme15Pro5g, brand: "realme", price: 59999 },
  { slug: "realme-c85-pro-8gb-128gb", name: "realme C85 Pro (8/128GB)", image: realmeC85Pro8gb128gb, brand: "realme", price: 27999 },
  { slug: "realme-c100x-6gb-128gb", name: "realme C100x (6/128GB)", image: realmeC100x6gb128gb, brand: "realme", price: 23999 },
  { slug: "realme-c100x", name: "realme C100x (4/128GB)", image: realmeC100x, brand: "realme", price: 21999 },
  { slug: "realme-c100i-4gb-128gb", name: "realme C100i (4/128GB)", image: realmeC100i4gb128gb, brand: "realme", price: 20999 },
  ],
  xiaomi: [
  { slug: "redmi-17-6gb-128gb", name: "Redmi 17 (6/128GB)", image: xiaomiRedmi176gb128gb, brand: "Xiaomi", price: 24999 },
  { slug: "xiaomi-pad-8", name: "Xiaomi Pad 8 (8/256GB)", image: xiaomiPad8, brand: "Xiaomi", price: 52999 },
  { slug: "xiaomi-67w-usb-charger", name: "Xiaomi 67W USB Charger with Type C Cable", image: xiaomi67wUsbCharger, brand: "Xiaomi", price: 2299 },
  { slug: "redmi-buds-8-lite-earbuds", name: "Redmi Buds 8 Lite TWS Earbuds", image: xiaomiRedmiBuds8LiteEarbuds, brand: "Xiaomi", price: 3299 },
  { slug: "redmi-pad-2-9-7-inch-4gb-128gb", name: "REDMI Pad 2 9.7\" (4/128GB)", image: xiaomiRedmiPad297Inch4gb128gb, brand: "Xiaomi", price: 21999 },
  ],
};

/** Flat, de-duplicated view — several products appear in more than one rail
 *  (iPhone 17 Pro Max is in both Exclusive and Top Selling). */
export const allProducts: Product[] = Object.values(
  [
    ...exclusiveProducts,
    ...soundSurroundProducts,
    ...newArrivalProducts,
    ...casesProducts,
    ...topSellingProducts,
    ...Object.values(brandProducts).flat(),
  ].reduce<Record<string, Product>>((acc, product) => {
    acc[product.slug] ??= product;
    return acc;
  }, {}),
);

export const findProduct = (slug: string): Product | undefined =>
  allProducts.find((product) => product.slug === slug);

export const productHref = (slug: string) => `/shop/product/${slug}`;

/** A product whose price is below what it is normally listed at. */
export type Offer = {
  product: Product;
  /** Taka off. */
  saving: number;
  /** Whole per cent off, rounded — what the card's ribbon reads. */
  percent: number;
};

/** Every real discount in the catalogue, deepest first.
 *
 *  Derived rather than curated on purpose: the offers page cannot then
 *  advertise a saving the product page does not also show, and a price edit
 *  here is the only thing needed to add or drop an offer. */
export const offers: Offer[] = allProducts
  .flatMap((product) => {
    const was = product.compareAt;
    if (!was || was <= product.price) return [];

    return [
      {
        product,
        saving: was - product.price,
        percent: Math.round((1 - product.price / was) * 100),
      },
    ];
  })
  .sort((a, b) => b.percent - a.percent || b.saving - a.saving);
