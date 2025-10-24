import React from "react";
import PhotoSection from "./PhotoSection";
import { Product } from "@/types/product";
import { futura } from "@/styles/fonts";
import { cn, formatPrice } from "@/lib/utils";
import Rating from "@/components/ui/Rating";
import ColorSelection from "./ColorSelection";
import SizeSelection from "./SizeSelection";
import AddToCardSection from "./AddToCardSection";

function formatearTituloProducto(nombre: string): string {
  if (!nombre || typeof nombre !== "string") return "";
  const palabrasMinusculas = new Set([
    "de",
    "del",
    "la",
    "el",
    "los",
    "las",
    "y",
    "e",
    "o",
    "u",
    "para",
    "con",
    "sin",
    "en",
    "por",
    "al",
  ]);
  return nombre
    .toLowerCase()
    .split(/\s+/)
    .map((palabra, indice) => {
      if (palabra === "x") return "X";
      if (/^[0-9]/.test(palabra)) return palabra; // números o fracciones
      if (palabrasMinusculas.has(palabra) && indice !== 0) return palabra;
      if (!palabra) return palabra;
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(" ");
}

const Header = ({ data }: { data: Product }) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <PhotoSection data={data} />
        </div>
        <div className="pt-2">
          <h1
            className={cn([
              futura.className,
              "text-[34px] sm:text-[38px] md:text-[44px] leading-[1.2] mb-4",
            ])}
          >
            {formatearTituloProducto(data.name)}
          </h1>
          <div className="flex items-center mb-2">
            <Rating
              initialValue={data.rating}
              allowFraction
              SVGclassName="inline-block"
              emptyClassName="fill-gray-50"
              size={25}
              readonly
            />
            <span className="text-black text-xs sm:text-sm ml-3 pb-0.5">
              {data.rating.toFixed(1)}
              <span className="text-black/60">/5</span>
            </span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            {(() => {
              const precioFinal =
                data.discount.percentage > 0
                  ? Math.round(
                      data.price -
                        (data.price * data.discount.percentage) / 100
                    )
                  : data.discount.amount > 0
                  ? data.price - data.discount.amount
                  : data.price;
              return (
                <>
                  <span className="font-bold text-black text-[28px] sm:text-[32px]">
                    {formatPrice(precioFinal)}
                  </span>
                  {(data.discount.percentage > 0 || data.discount.amount > 0) && (
                    <span className="font-semibold text-black/40 line-through text-lg sm:text-xl">
                      {formatPrice(data.price)}
                    </span>
                  )}
                </>
              );
            })()}
            {/* Badge de oferta a la derecha del precio */}
            {data.discount.percentage > 0 && (
              <span className="font-medium text-xs py-1 px-2 rounded-full bg-[#FF3333]/10 text-[#FF3333]">
                {`-${data.discount.percentage}%`}
              </span>
            )}
          </div>
          <hr className="hidden md:block h-[1px] border-t-black/10 my-5" />
          <AddToCardSection data={data} />
        </div>
      </div>
    </>
  );
};

export default Header;
