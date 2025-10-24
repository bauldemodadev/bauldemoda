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

// Fuente para el resto del contenido - usando CSS custom properties
export const futura = {
  variable: "--font-futura",
  className: "font-futura",
};
