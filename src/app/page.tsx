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
        className="my-[50px] sm:my-[72px] mt-5 lg:pt-32 lg:-mt-32"
        style={{ backgroundColor: "#F5F0D7" }}
      >
        {/* Cursos Online */}
        <CourseListSec
          title="CURSOS ONLINE"
          subtitle="hacelos en casa"
          category="online"
          courseNames={[
            "Arreglos de Ropa",
            "Intensivo Mi primer jean",
            "abc costura online",
            "Intensivo Mallas"
          ]}
          showAllUrl="/shop/categoria/cursos-online"
        />

        {/* Cursos Presenciales - Ciudad Jardín */}
        <CourseListSec
          title="CURSOS PRESENCIALES"
          subtitle="Ciudad Jardin"
          category="ciudad-jardin"
          courseNames={[
            "Abc Overlock & Collareta",
            "abc Costura",
            "Indumentaria",
            "Lenceria y mallas"
          ]}
          showAllUrl="/shop/categoria/cursos-ciudad-jardin"
        />

        {/* Cursos Presenciales - Almagro */}
        <CourseListSec
          title="Almagro"
          category="almagro"
          courseNames={[
            "Intensivo Indumentaria",
            "Arreglos de Ropa",
            "Carteras",
            "Indumentaria",
            "Abc Costura"
          ]}
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
