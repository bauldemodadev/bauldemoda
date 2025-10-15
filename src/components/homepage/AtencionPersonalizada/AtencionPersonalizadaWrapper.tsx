"use client";

import React, { useState, useEffect } from "react";
import AtencionPersonalizadaSkeleton from "./AtencionPersonalizadaSkeleton";
import AtencionPersonalizada from "./index";

const AtencionPersonalizadaWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 segundos de skeleton

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AtencionPersonalizadaSkeleton />;
  }

  return <AtencionPersonalizada />;
};

export default AtencionPersonalizadaWrapper;
