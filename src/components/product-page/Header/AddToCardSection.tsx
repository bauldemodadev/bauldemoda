"use client";

import React, { useState } from "react";
import AddToCartBtn from "./AddToCartBtn";
import { Product } from '@/types/product';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AddToCardSection = ({ data }: { data: Product }) => {
  const [quantity, setQuantity] = useState<number>(1);

  return (
    <div className="md:relative w-full bg-white border-t md:border-none border-black/5 bottom-0 left-0 p-4 md:p-0 z-10 flex flex-col space-y-4">
      {data.promos && data.promos.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-900">
            ¡Aprovecha estas ofertas especiales! 🎉
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.promos.map((promo, index) => (
              <Badge 
                key={index}
                variant={quantity >= promo.cantidad ? "default" : "outline"}
                className={cn(
                  "text-xs",
                  quantity >= promo.cantidad && "bg-green-500 hover:bg-green-600"
                )}
              >
                {promo.cantidad}x -{promo.descuento}%
              </Badge>
            ))}
          </div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-full md:w-auto">
          <AddToCartBtn data={{ ...data, quantity }} />
        </div>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: data.name,
                text: data.description,
                url: typeof window !== 'undefined' ? window.location.href : ''
              }).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href).catch(() => {});
            }
          }}
          className="hidden md:inline-flex items-center justify-center h-12 px-5 rounded-full border border-black/10 text-sm font-medium hover:bg-gray-50 gap-2"
          aria-label="Compartir"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7a3.27 3.27 0 0 0 0-1.39l7.02-4.11A2.99 2.99 0 1 0 14 5a2.99 2.99 0 0 0 .04.5L7.02 9.61a3 3 0 1 0 0 4.78l7.02 4.12c-.03.16-.04.33-.04.49a3 3 0 1 0 3-2.92z" />
          </svg>
          Compartir
        </button>
      </div>

      <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />

      {data.description && (
        <p className="text-base text-gray-600 leading-relaxed">
          {data.description}
        </p>
      )}
    </div>
  );
};

export default AddToCardSection;
