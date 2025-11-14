"use client"

// import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import { FilterProvider } from "@/context/FilterContext";
import { ToastProvider } from "@/context/ToastContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Si es una ruta admin, renderizar solo el contenido sin navbar/footer
  if (isAdminRoute) {
    return (
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    );
  }

  // Para rutas normales, renderizar con navbar y footer
  return (
    <body>
      <Providers>
        <FilterProvider>
          <ToastProvider>
            <ServiceWorkerRegistration />
            {/* <TopBanner /> */}
            <TopNavbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ToastProvider>
        </FilterProvider>
      </Providers>
    </body>
  );
} 