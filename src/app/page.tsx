import CourseListSec from "@/components/common/CourseListSec";
import AtencionPersonalizadaWrapper from "@/components/homepage/AtencionPersonalizada/AtencionPersonalizadaWrapper";
import RedesWrapper from "@/components/homepage/Redes/RedesWrapper";
import UbicacionWrapper from "@/components/homepage/Ubicacion/UbicacionWrapper";
import Header from "@/components/homepage/Header";
import { getProductsByIdsFromFirestore } from "@/lib/firestore/products";
import type { Product } from "@/types/product";

// ISR: Revalidar cada 5 minutos
export const revalidate = 300;

// Función helper para filtrar productos por IDs (mantiene orden)
function filterCoursesByIds(products: Product[], courseIds: (string | number)[]): Product[] {
  const filtered: Product[] = [];
  const courseIdsStr = courseIds.map(id => String(id));
  
  courseIdsStr.forEach(courseId => {
    const found = products.find(product => String(product.id) === courseId);
    if (found && !filtered.find(p => p.id === found.id)) {
      filtered.push(found);
    }
  });
  
  return filtered;
}

export default async function Home() {
  // OPTIMIZADO: Una sola lectura batch de todos los productos necesarios
  // IDs de todas las secciones combinados
  const allCourseIds = [
    // Cursos Online
    9556, 1925, 139, 2036,
    // Ciudad Jardín
    8987, 415, 71, 50,
    // Almagro
    11240, 150, 144, 139,
  ].map(id => String(id)); // Convertir a strings para Firestore

  // Una sola query batch
  const allProducts = await getProductsByIdsFromFirestore(allCourseIds);

  // Filtrar productos para cada sección
  const onlineCourses = filterCoursesByIds(allProducts, [9556, 1925, 139, 2036]);
  const ciudadJardinCourses = filterCoursesByIds(allProducts, [8987, 415, 71, 50]);
  const almagroCourses = filterCoursesByIds(allProducts, [11240, 150, 144, 139]);

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
          products={onlineCourses}
        />

        {/* Cursos Presenciales - Ciudad Jardín */}
        <CourseListSec
          title="CURSOS PRESENCIALES"
          subtitle="Ciudad Jardin"
          category="ciudad-jardin"
          courseIds={[8987, 415, 71, 50]}
          showAllUrl="/shop/categoria/cursos-ciudad-jardin"
          products={ciudadJardinCourses}
        />

        {/* Cursos Presenciales - Almagro */}
        <CourseListSec
          title="Almagro"
          category="almagro"
          courseIds={[11240, 150, 144, 139]}
          showAllUrl="/shop/categoria/cursos-almagro"
          products={almagroCourses}
        />
      </main>
      <AtencionPersonalizadaWrapper />
      <RedesWrapper />
      <UbicacionWrapper />
    </>
  );
}
