"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { cn } from "@/lib/utils";

type CartCounterProps = {
  isZeroDelete?: boolean;
  onAdd?: (value: number) => void;
  onRemove?: (value: number) => void;
  className?: string;
  initialValue?: number;
};

const CartCounter = ({
  isZeroDelete,
  onAdd,
  onRemove,
  className,
  initialValue = 1,
}: CartCounterProps) => {
  const [counter, setCounter] = useState<number>(initialValue);

  // Sincronizar con el valor inicial cuando cambie
  useEffect(() => {
    setCounter(initialValue);
  }, [initialValue]);

  // Forzar actualización cuando el valor inicial cambie significativamente
  useEffect(() => {
    if (Math.abs(counter - initialValue) > 0) {
      setCounter(initialValue);
    }
  }, [initialValue, counter]);

  const addToCart = () => {
    const newValue = counter + 1;
    if (onAdd) {
      onAdd(newValue);
    }
    setCounter(newValue);
  };

  const remove = () => {
    if ((counter === 1 && !isZeroDelete) || counter <= 0) return;

    const newValue = counter - 1;
    if (onRemove) {
      onRemove(newValue);
    }
    setCounter(newValue);
  };

  return (
    <div
      className={cn(
        "bg-[#F0F0F0] w-full min-w-[110px] max-w-[110px] sm:max-w-[170px] py-3 md:py-3.5 px-4 sm:px-5 rounded-full flex items-center justify-between",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={() => remove()}
      >
        <FaMinus />
      </Button>
      <span className="font-medium text-sm sm:text-base">
        {!isZeroDelete ? counter : initialValue}
      </span>
      <Button
        variant="ghost"
        size="icon"
        type="button"
        className="h-5 w-5 sm:h-6 sm:w-6 text-xl hover:bg-transparent"
        onClick={() => addToCart()}
      >
        <FaPlus />
      </Button>
    </div>
  );
};

export default CartCounter;
