"use client";

import ProductListSec from "@/components/common/ProductListSec";
import DressStyle from "@/components/homepage/DressStyle";
import AtencionPersonalizadaWrapper from "@/components/homepage/AtencionPersonalizada/AtencionPersonalizadaWrapper";
import RedesWrapper from "@/components/homepage/Redes/RedesWrapper";
import UbicacionWrapper from "@/components/homepage/Ubicacion/UbicacionWrapper";
import Header from "@/components/homepage/Header";

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
        className="my-[50px] sm:my-[72px] mt-5 lg:pt-32 lg:-mt-32"
        style={{ backgroundColor: "#F5F0D7" }}
      >
        <ProductListSec 
          title="Ciudad Jardín" 
          productIds={["M2eaBFE4haP9wNZlU2VH", "O1gikBervfIpQjDiCNwL", "Ojq1RVHKUKdb4mQ0gLNr", "WX8IIznI7dGaYVROMUXa"]} 
        />

        <ProductListSec 
          title="Almagro" 
          productIds={["findiO6O15Vr6kZdZnrG", "mtNpT3XBRwGtTPe5rYU4", "11VBGCw2AoAgYHUSL76p", "Ojq1RVHKUKdb4mQ0gLNr", "O1gikBervfIpQjDiCNwL"]} 
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
