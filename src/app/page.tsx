"use client";

import ProductListSec from "@/components/common/ProductListSec";
import CourseListSec from "@/components/common/CourseListSec";
import AtencionPersonalizadaWrapper from "@/components/homepage/AtencionPersonalizada/AtencionPersonalizadaWrapper";
import RedesWrapper from "@/components/homepage/Redes/RedesWrapper";
import UbicacionWrapper from "@/components/homepage/Ubicacion/UbicacionWrapper";
import Header from "@/components/homepage/Header";

export default function Home() {
  return (
    <>
      <Header />
      
      <main
        className="mt-5 lg:pt-32 lg:-mt-32 overflow-x-hidden"
      >
        {/* Cursos Online */}
        <CourseListSec
          title="CURSOS ONLINE"
          subtitle="hacelos en casa"
          category="online"
          courseIds={[9556, 1925, 139, 2036]}
          showAllUrl="/shop/categoria/cursos-online"
        />

        {/* Cursos Presenciales - Ciudad Jardín */}
        <CourseListSec
          title="CURSOS PRESENCIALES"
          subtitle="Ciudad Jardin"
          category="ciudad-jardin"
          courseIds={[8987, 415, 71, 50]}
          showAllUrl="/shop/categoria/cursos-ciudad-jardin"
        />

        {/* Cursos Presenciales - Almagro */}
        <CourseListSec
          title="Almagro"
          category="almagro"
          courseIds={[11240, 150, 144, 139]}
          showAllUrl="/shop/categoria/cursos-almagro"
        />
      </main>
      {/* <DestacadosSkeleton /> */}
      {/* Resto de secciones en el orden solicitado */}
      {/* <QuienesSomosSkeleton /> */}
      <AtencionPersonalizadaWrapper />
      <RedesWrapper />
      <UbicacionWrapper />
      {/* <AnimatePresence>
        <OfferPopup />
      </AnimatePresence> */}
      {/* <WhatsAppButton /> */}
    </>
  );
}
