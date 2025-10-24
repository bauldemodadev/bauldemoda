import type { Metadata } from "next";
import "@/styles/globals.css";
import { beauty, futura } from "@/styles/fonts";
import RootLayoutClient from "./root-layout-client";
import Providers from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Baúl de Moda",
  description: "Tienda de moda y accesorios de Baúl de Moda. Ropa premium, accesorios únicos y envíos a domicilio.",
  keywords: [
    "moda", "ropa", "accesorios", "fashion",
    "vestidos", "camisas", "pantalones", "zapatos",
    "bolsos", "cinturones", "joyería", "relojes",
    "tendencias", "estilo", "elegancia", "diseño"
  ],
  authors: [{ name: "Baúl de Moda" }],
  creator: "Baúl de Moda",
  publisher: "Baúl de Moda",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://bauldemoda.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Baúl de Moda",
    description: "Tienda de moda y accesorios de Baúl de Moda. Ropa premium, accesorios únicos y envíos a domicilio.",
    url: "https://bauldemoda.com",
    siteName: "Baúl de Moda",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: "Baúl de Moda | Moda Premium",
    description: "Tienda de moda y accesorios. Ropa premium, accesorios únicos y envíos a domicilio.",
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={cn(beauty.variable, futura.variable)}>
      <head>
        <meta name="geo.region" content="AR" />
        <meta name="geo.placename" content="Argentina" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Baúl de Moda",
                url: "https://bauldemoda.com",
                logo: "https://bauldemoda.com/images/og-image.jpg",
                telephone: "01134976239",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Av. Dr. Honorio Pueyrredón 4625",
                  postalCode: "B1631",
                  addressLocality: "Villa Rosa",
                  addressRegion: "Provincia de Buenos Aires",
                  addressCountry: "AR",
                },
                sameAs: [
                  "https://www.instagram.com/bauldemoda/",
                  "https://www.facebook.com/bauldemoda",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Baúl de Moda",
                url: "https://bauldemoda.com",
                inLanguage: "es-AR",
              },
              {
                "@context": "https://schema.org",
                "@type": "Store",
                name: "Baúl de Moda",
                url: "https://bauldemoda.com",
                areaServed: "AR",
                telephone: "01134976239",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Av. Dr. Honorio Pueyrredón 4625",
                  postalCode: "B1631",
                  addressLocality: "Villa Rosa",
                  addressRegion: "Provincia de Buenos Aires",
                  addressCountry: "AR",
                },
                sameAs: [
                  "https://www.instagram.com/bauldemoda/",
                  "https://www.facebook.com/bauldemoda",
                ],
                hasMap: "https://maps.app.goo.gl/7yjPAd41fKKH9ErF9",
              },
            ]),
          }}
        />
      </head>
      <body className={cn("min-h-screen bg-white antialiased")}>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}