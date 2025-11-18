import localFont from "next/font/local";

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
