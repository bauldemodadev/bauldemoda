"use client";

import React, { useState, useEffect } from "react";
import UbicacionSkeleton from "./UbicacionSkeleton";
import Ubicacion from "./index";

const UbicacionWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 segundos de skeleton

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <UbicacionSkeleton />;
  }

  return <Ubicacion />;
};

export default UbicacionWrapper;
