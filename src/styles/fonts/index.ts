import localFont from "next/font/local";
import { Poppins } from "next/font/google";

// Fuente para títulos importantes y h1 - usando archivos locales
export const beauty = localFont({
  src: [
    {
      path: "../../../public/fonts/beauty/BeautyDemo.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/beauty/BeautyDemo.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-beauty",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "serif"],
});

// Fuente Futura Md BT - usando archivo local
export const futura = localFont({
  src: [
    {
      path: "../../../public/fonts/Futura Md BT/futuramdbt_bold.otf",
      style: "normal",
    },
  ],
  variable: "--font-futura",
  display: "swap",
  preload: true,
  fallback: ["Arial", "sans-serif"],
});

// Fuente Poppins para el panel admin
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
