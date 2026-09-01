import { Heebo, Montserrat } from "next/font/google";

export const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const fontVariables = `${heebo.variable} ${montserrat.variable}`;
