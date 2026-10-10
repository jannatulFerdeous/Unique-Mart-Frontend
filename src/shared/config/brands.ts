import type { StaticImageData } from "next/image";
import amazonLogo from "@/images/brands/logos/amazon.png";
import ankerLogo from "@/images/brands/logos/anker.png";
import appleLogo from "@/images/brands/logos/apple.png";
import belkinLogo from "@/images/brands/logos/belkin.png";
import boseLogo from "@/images/brands/logos/bose.png";
import djiLogo from "@/images/brands/logos/dji.png";
import edifierLogo from "@/images/brands/logos/edifier.png";
import googleLogo from "@/images/brands/logos/google.png";
import goproLogo from "@/images/brands/logos/gopro.png";
import harmanKardonLogo from "@/images/brands/logos/harman-kardon.png";
import honorLogo from "@/images/brands/logos/honor.png";
import huaweiLogo from "@/images/brands/logos/huawei.png";
import infinixLogo from "@/images/brands/logos/infinix.png";
import jblLogo from "@/images/brands/logos/jbl.png";
import logitechLogo from "@/images/brands/logos/logitech.png";
import marshallLogo from "@/images/brands/logos/marshall.png";
import mekoLogo from "@/images/brands/logos/meko.png";
import metaLogo from "@/images/brands/logos/meta.png";
import oneplusLogo from "@/images/brands/logos/oneplus.png";
import oppoLogo from "@/images/brands/logos/oppo.png";
import ottoLogo from "@/images/brands/logos/otto.png";
import pitakaLogo from "@/images/brands/logos/pitaka.png";
import realmeLogo from "@/images/brands/logos/realme.png";
import samsungLogo from "@/images/brands/logos/samsung.png";
import sandiskLogo from "@/images/brands/logos/sandisk.png";
import skrossLogo from "@/images/brands/logos/skross.png";
import skullcandyLogo from "@/images/brands/logos/skullcandy.png";
import sonyLogo from "@/images/brands/logos/sony.png";
import spigenLogo from "@/images/brands/logos/spigen.png";
import starlinkLogo from "@/images/brands/logos/starlink.png";
import tecnoLogo from "@/images/brands/logos/tecno.png";
import torrasLogo from "@/images/brands/logos/torras.png";
import tucanoLogo from "@/images/brands/logos/tucano.png";
import uagLogo from "@/images/brands/logos/uag.png";
import vivoLogo from "@/images/brands/logos/vivo.png";
import xiaomiLogo from "@/images/brands/logos/xiaomi.png";

export type BrandMark = {
  slug: string;
  label: string;
  logo: StaticImageData;
};

export const brandMarks: BrandMark[] = [
  { slug: "infinix", label: "Infinix", logo: infinixLogo },
  { slug: "skullcandy", label: "Skullcandy", logo: skullcandyLogo },
  { slug: "sony", label: "Sony", logo: sonyLogo },
  { slug: "bose", label: "Bose", logo: boseLogo },
  { slug: "honor", label: "HONOR", logo: honorLogo },
  { slug: "samsung", label: "Samsung", logo: samsungLogo },
  { slug: "belkin", label: "Belkin", logo: belkinLogo },
  { slug: "apple", label: "Apple", logo: appleLogo },
  { slug: "pitaka", label: "PITAKA", logo: pitakaLogo },
  { slug: "amazon", label: "Amazon", logo: amazonLogo },
  { slug: "meko", label: "MEKO", logo: mekoLogo },
  { slug: "gopro", label: "GoPro", logo: goproLogo },
  { slug: "marshall", label: "Marshall", logo: marshallLogo },
  { slug: "realme", label: "realme", logo: realmeLogo },
  { slug: "oppo", label: "Oppo", logo: oppoLogo },
  { slug: "dji", label: "DJI", logo: djiLogo },
  { slug: "spigen", label: "Spigen", logo: spigenLogo },
  { slug: "google", label: "Google", logo: googleLogo },
  { slug: "logitech", label: "Logitech", logo: logitechLogo },
  { slug: "skross", label: "SKROSS", logo: skrossLogo },
  { slug: "anker", label: "Anker", logo: ankerLogo },
  { slug: "harman-kardon", label: "Harman Kardon", logo: harmanKardonLogo },
  { slug: "tecno", label: "Tecno", logo: tecnoLogo },
  { slug: "vivo", label: "vivo", logo: vivoLogo },
  { slug: "tucano", label: "TUCANO", logo: tucanoLogo },
  { slug: "uag", label: "UAG", logo: uagLogo },
  { slug: "starlink", label: "Starlink", logo: starlinkLogo },
  { slug: "meta", label: "Meta", logo: metaLogo },
  { slug: "edifier", label: "Edifier", logo: edifierLogo },
  { slug: "huawei", label: "Huawei", logo: huaweiLogo },
  { slug: "sandisk", label: "SanDisk", logo: sandiskLogo },
  { slug: "oneplus", label: "OnePlus", logo: oneplusLogo },
  { slug: "xiaomi", label: "Xiaomi", logo: xiaomiLogo },
  { slug: "jbl", label: "JBL", logo: jblLogo },
  { slug: "torras", label: "TORRAS", logo: torrasLogo },
  { slug: "otto", label: "OTTO", logo: ottoLogo },
];

export const brandsPath = "/brands";

export const brandHref = (slug: string) => `${brandsPath}/${slug}`;
