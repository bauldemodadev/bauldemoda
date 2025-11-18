"use client";

import CourseListSec from "@/components/common/CourseListSec";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-white">
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

        {/* Productos y Servicios */}
        <section className="max-w-frame mx-auto px-4 md:px-6 mb-12">
          <div className="text-left mb-8">
            <motion.h2
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-beauty text-2xl font-bold text-gray-900 mb-2"
            >
              PRODUCTOS Y SERVICIOS
            </motion.h2>
            <motion.p
              initial={{ y: "100px", opacity: 0 }}
              animate={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-beauty text-lg text-gray-600"
            >
              Revistas y herramientas de costura
            </motion.p>
          </div>

          {/* Botón VER TODOS */}
          <div className="text-center">
            <Link href="/shop/categoria/productos-servicios">
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="px-8 py-3 rounded-lg font-bold text-gray-800 transition-all duration-200"
                style={{ backgroundColor: "#F5E6E8" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#E9ABBD"} 
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#F5E6E8"}
              >
                VER TODOS
              </motion.button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
