"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/AuthContext';
// Firestore eliminado. A futuro, estas operaciones deben ir a la API externa.
import BreadcrumbCheckout from "@/components/cart-page/BreadcrumbCheckout";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo"; // Ahora será el selector de método de pago
import { Button } from "@/components/ui/button";
import ProgressBar from "./components/ProgressBar";
import OrderSummary from "./components/OrderSummary";
import CheckoutStepSkeleton from "./components/CheckoutStepSkeleton";
import { UserIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import {
  stepOneSchema,
  stepTwoSchema,
  Step1Data,
  Step2Data,
  FormData,
} from "./schema";
import clsx from "clsx";
import { futura } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineLocalOffer } from "react-icons/md";
import { TbBasketExclamation } from "react-icons/tb";
import { useCart } from "@/lib/hooks/useCart";
import Link from "next/link";
import { Product } from "./components/OrderSummary"
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

const checkoutSteps = [
  {
    id: 1,
    name: "Información Personal",
    description: "Datos de contacto",
    icon: UserIcon,
  },
  {
    id: 2,
    name: "Método de Pago",
    description: "Selecciona cómo pagar",
    icon: CreditCardIcon,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const { cart, loading: cartLoading } = useCart();
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [step, setStep] = useState(0);
  const [checkoutCart, setCheckoutCart] = useState<Product[]>([]);
  const [useSavedInfo, setUseSavedInfo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para scroll al cambiar de paso
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Efecto para manejar el estado de carga
  useEffect(() => {
    // Simular un tiempo de carga mínimo para evitar parpadeos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const methodsStepOne = useForm<Step1Data>({
    resolver: zodResolver(stepOneSchema(true)),
    mode: "onTouched",
    defaultValues: {
      email: "",
      nombre: "",
      telefono: "",
      dni: "",
    },
  });

  const methodsStepTwo = useForm<Step2Data>({
    resolver: zodResolver(stepTwoSchema),
    mode: "onTouched",
    defaultValues: {
      paymentMethod: undefined,
      acceptTerms: false,
      comment: '',
    },
  });

  // Setear el email del usuario una vez esté disponible
  useEffect(() => {
    if (user?.email) {
      methodsStepOne.setValue("email", user.email);
    }
  }, [user, methodsStepOne]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("checkout_cart");

      if (!savedCart) {
        console.warn("🚫 No hay carrito. Redirigiendo a /cart...");
        router.replace("/cart");
        return;
      }

      try {
        const parsedCart = JSON.parse(savedCart);
        if (!Array.isArray(parsedCart) || parsedCart.length === 0) {
          console.warn("🛒 Carrito vacío o mal formado. Redirigiendo...");
          router.replace("/cart");
        } else {
          setCheckoutCart(parsedCart);
          // console.log("✅ Carrito cargado correctamente.");
        }
      } catch (err) {
        console.error("❌ Error parseando carrito:", err);
        router.replace("/cart");
      }
    }
  }, []);

  const handleStepOneSubmit = async (data: Step1Data) => {
    try {
      console.log("📝 Datos Step 1:", data);

      // TODO: Enviar datos a la API externa si corresponde

      setStep(1);
    } catch (error) {
      console.error("❌ Error guardando datos de Step 1:", error);
    }
  };

  const handleStepTwoSubmit = async (data: Step2Data) => {
    try {
      console.log("💳 Método de pago Step 2:", data);
      // El pago se procesa en StepTwo (que ahora es el método de pago)
      // No avanzamos de paso aquí, se maneja dentro de StepTwo
    } catch (error) {
      console.error("❌ Error guardando datos de Step 2:", error);
    }
  };

  // Obtener método de pago seleccionado
  const selectedPaymentMethod = methodsStepTwo.watch('paymentMethod') as 'mp' | 'cash' | 'transfer' | undefined;

  // Calcular totales para el OrderSummary según método de pago
  // Nota: Los precios diferenciados se calcularán en el backend, aquí solo mostramos el precio base
  const subtotal = checkoutCart.reduce((acc, item) => {
    // Por ahora usar price, luego se ajustará según método de pago en el backend
    return acc + (item.price * item.quantity);
  }, 0);
  
  const discountTotal = checkoutCart.reduce((acc, item) => {
    if (item.activePromo) {
      return acc + (item.price * item.quantity - item.activePromo.precioFinal);
    }
    const discount = item.discount || { percentage: 0, amount: 0 };
    if (discount.percentage > 0) {
      return acc + (item.price * item.quantity * (discount.percentage / 100));
    }
    if (discount.amount > 0) {
      return acc + (discount.amount * item.quantity);
    }
    return acc;
  }, 0);
  
  // Sin envío según FASE 7 (solo retiro en sucursal)
  const shipping = 0;
  const total = subtotal - discountTotal + shipping;


  // Mostrar estado de carga
  if (isLoading || authLoading || cartLoading) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbCheckout />
          
          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar currentStep={step + 1} steps={checkoutSteps} />
          </div>

          <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
            {/* Formulario de checkout */}
            <div className="lg:col-span-2">
              <CheckoutStepSkeleton step={step} />
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary 
                products={[]}
                subtotal={0}
                shipping={0}
                total={0}
                isLoading={true}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return (
      <main className="pb-20">
        <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
          <BreadcrumbCheckout />
          
          {/* Progress Bar */}
          <div className="mb-8">
            <ProgressBar currentStep={step + 1} steps={checkoutSteps} />
          </div>

          <div className={clsx(
            "grid gap-8",
            "grid-cols-1 lg:grid-cols-3"
          )}>
            {/* Formulario de checkout */}
            <div className="lg:col-span-2">
              {step === 0 && (
                <FormProvider {...methodsStepOne}>
                  <form onSubmit={methodsStepOne.handleSubmit(handleStepOneSubmit)}>
                    <StepOne useSaved={useSavedInfo} setUseSaved={setUseSavedInfo} onNext={() => setStep(1)} />
                  </form>
                </FormProvider>
              )}

              {step === 1 && (
                <FormProvider {...methodsStepTwo}>
                  <form onSubmit={methodsStepTwo.handleSubmit(handleStepTwoSubmit)}>
                    <StepTwo
                      step1Data={methodsStepOne.getValues()}
                      cart={checkoutCart}
                      setStep={setStep}
                    />
                  </form>
                </FormProvider>
              )}
            </div>

            {/* Order Summary - Se muestra en todos los pasos */}
            <div className="lg:col-span-1">
              <OrderSummary 
                products={checkoutCart.map(product => ({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: product.quantity,
                  image: product.image || product.srcUrl || PLACEHOLDER_IMAGE,
                  srcUrl: product.image || product.srcUrl || PLACEHOLDER_IMAGE,
                  totalPrice: product.totalPrice,
                  discount: product.discount,
                  activePromo: product.activePromo
                }))}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                isLoading={isLoading || cartLoading}
                paymentMethod={selectedPaymentMethod}
              />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
          <h2
            className={cn([
              futura.className,
              "text-3xl font-bold text-center mb-6",
            ])}
          >
            Inicia sesión para continuar
          </h2>
          <p className="text-lg text-gray-600 text-center mb-8 max-w-md">
            Debes iniciar sesión para continuar con el proceso de pago.
          </p>
          <Button
            onClick={() => (window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`)}
            className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-all shadow-md"
          >
            Iniciar Sesión
          </Button>
        </div>
      </div>
    </main>
  );
}
