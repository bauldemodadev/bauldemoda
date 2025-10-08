"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
// import { useEffect, useState } from "react";
// import ProductListSec from "@/components/common/ProductListSec";
import ProductSectionSkeleton from "@/components/common/ProductSectionSkeleton";
import DressStyle from "@/components/homepage/DressStyle";
// import DressStyleSkeleton from "@/components/homepage/DressStyleSkeleton";
// import Destacados from "@/components/homepage/Destacados";
import DestacadosSkeleton from "@/components/homepage/Destacados/DestacadosSkeleton";
// import QuienesSomos from "@/components/homepage/QuienesSomos";
import QuienesSomosSkeleton from "@/components/homepage/QuienesSomos/QuienesSomosSkeleton";
// import Obras from "@/components/homepage/Obras";
import ObrasSkeleton from "@/components/homepage/Obras/ObrasSkeleton";
// import Ubicacion from "@/components/homepage/Ubicacion";
import UbicacionSkeleton from "@/components/homepage/Ubicacion/UbicacionSkeleton";
// import AtencionPersonalizada from "@/components/homepage/AtencionPersonalizada";
import AtencionPersonalizadaSkeleton from "@/components/homepage/AtencionPersonalizada/AtencionPersonalizadaSkeleton";
import Header from "@/components/homepage/Header";
// import { api } from "@/lib/api";
// import { Product } from "@/types/product";
// import OfferPopup from "@/components/common/OfferPopup";
// import { AnimatePresence } from "framer-motion";
// import WhatsAppButton from "@/components/common/WhatsAppButton";

export default function Home() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     try {
  //       // Usar la API interna que ya filtra por estadoTienda === 'Activo'
  //       const res = await fetch('/api/products?all=1', { cache: 'no-store' });
  //       if (!res.ok) {
  //         throw new Error('Error al cargar productos');
  //       }
  //       const fetchedProducts = await res.json() as Product[];
  //       setProducts(fetchedProducts);
  //       setError(null);
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //       setError('Error al cargar los productos. Por favor, intenta de nuevo.');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  // // Derivados: ofertas y nuevos productos (ya filtrados por estadoTienda === 'Activo')
  // const ofertas = products.filter(
  //   (product) => product.discount && (product.discount.amount > 0 || product.discount.percentage > 0)
  // );
  // const nuevosProductos = products
  //   .filter((product) => product.newArrival === true)
  //   .slice(0, 8);

  return (
    <>
      <Header />
      <DressStyle />

      
      <main
        className="my-[50px] sm:my-[72px] mt-5"
        style={{ backgroundColor: "#F5F0D7" }}
      >
        <section className="max-w-frame mx-auto">  
        <motion.h2
          initial={{ y: "100px", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn([
            integralCF.className,
            "text-2xl font-bold text-left mb-8 md:mb-12 ml-8 md:ml-0 pt-5",
          ])}
        >
          CURSOS PRESENCIALES
        </motion.h2>
        </section>
        
        <ProductSectionSkeleton title="Ciudad Jardín" />

        <ProductSectionSkeleton title="Almagro" />
      </main>
      {/* <DestacadosSkeleton /> */}

      {/* Resto de secciones en el orden solicitado */}
      {/* <QuienesSomosSkeleton /> */}
      <AtencionPersonalizadaSkeleton />
      <ObrasSkeleton />
      <UbicacionSkeleton />
 
      {/* <AnimatePresence>
        <OfferPopup />
      </AnimatePresence> */}
      {/* <WhatsAppButton /> */}
    </>
  );
}
