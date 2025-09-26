import { getProductById, getAllProducts } from '@/services/productService';
import ProductListSec from "@/components/common/ProductListSec";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { Product } from '@/types/product';
import { notFound } from "next/navigation";
import ProductSkeleton from '@/components/shop-page/product/ProductSkeleton';
import { Suspense } from 'react';

// Configurar no-cache para esta página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const [id] = params.slug;

  // Obtener producto individual desde servicio (evita fetch relativo en server)
  const product = await getProductById(id);
  if (!product) return notFound();

  // Intentar cargar un set de relacionados (listado rápido). No es crítico si falla
  let relatedProducts: Product[] = [];
  try {
    const all = await getAllProducts();
    relatedProducts = (all || [])
      .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
      .slice(0, 4);
  } catch {}

  return (
    <Suspense fallback={<ProductSkeleton />}>
      <main>
        <div className="max-w-frame mx-auto px-4 xl:px-0 mb-[50px] sm:mb-20">
          <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbProduct name={product.name ?? "product"} />
          <section className="mb-11">
            <Header data={product} />
          </section>
          {/* <Tabs product={product} /> */}
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListSec
            title="PRODUCTOS RELACIONADOS"
            data={relatedProducts}
          />
        </div>
      </main>
    </Suspense>
  );
}