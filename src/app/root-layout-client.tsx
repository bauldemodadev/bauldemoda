"use client"

// import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import { FilterProvider } from "@/context/FilterContext";
import { ToastProvider } from "@/context/ToastContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import Providers from "./providers";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
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