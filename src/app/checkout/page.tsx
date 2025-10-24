"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from '@/context/AuthContext';
// Firestore eliminado. A futuro, estas operaciones deben ir a la API externa.
import BreadcrumbCheckout from "@/components/cart-page/BreadcrumbCheckout";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { Button } from "@/components/ui/button";
import ProgressBar from "./components/ProgressBar";
import OrderSummary from "./components/OrderSummary";
import CheckoutStepSkeleton from "./components/CheckoutStepSkeleton";
import { UserIcon, TruckIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import {
  stepOneSchema,
  stepTwoSchema,
  stepThreeSchema,
  Step1Data,
  Step2Data,
  Step3Data,
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
import { validateLocation, calculateDistance } from '@/lib/validations'
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
    name: "Dirección de Envío",
    description: "Datos de entrega",
    icon: TruckIcon,
  },
  {
    id: 3,
    name: "Método de Pago",
    description: "Datos de pago",
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
  const [shippingMethod, setShippingMethod] = useState('delivery');

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
  });

  const methodsStepThree = useForm<Step3Data>({
    resolver: zodResolver(stepThreeSchema),
    mode: "onTouched",
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
      console.log("📦 Dirección Step 2:", data);

      // TODO: Guardar dirección en API externa

      setStep(2);
    } catch (error) {
      console.error("❌ Error guardando datos de Step 2:", error);
    }
  };

  const onConfirm = async () => {
    console.log("🚀 Validando todos los pasos antes de confirmar...");

    const isStep1Valid = await methodsStepOne.trigger();
    const isStep2Valid = await methodsStepTwo.trigger();
    const isStep3Valid = await methodsStepThree.trigger();

    if (!isStep1Valid || !isStep2Valid || !isStep3Valid) {
      console.warn("⚠️ Validación fallida. Revisá los datos antes de finalizar el checkout.");
      alert("Revisá los datos antes de finalizar el checkout.");
      return;
    }

    const allData = {
      ...methodsStepOne.getValues(),
      ...methodsStepTwo.getValues(),
      ...methodsStepThree.getValues(),
      cart: checkoutCart,
    };

    console.log("🎉 Checkout finalizado. Datos completos:", allData);

    alert("🎉 Checkout finalizado correctamente");

    localStorage.removeItem("checkout_cart");
    console.log("🧹 Carrito eliminado de localStorage post-checkout");
  };

  // Calcular totales para el OrderSummary
  const subtotal = checkoutCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
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
  const shipping = subtotal > 100 ? 0 : 10; // Envío gratis para compras mayores a $100
  const total = subtotal - discountTotal + shipping;

  // Función para manejar el cambio de método de envío
  const handleShippingMethodChange = async (method: string) => {
    if (method === 'delivery') {
      // Obtener la ubicación actual del usuario usando la API de geolocalización
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLat = position.coords.latitude
          const userLng = position.coords.longitude
          
          // Validar la ubicación
          const isValid = await validateLocation(userLat, userLng)
          
          if (!isValid) {
            // Obtener la configuración general para mostrar la ubicación más cercana
            // TODO: Obtener settings desde API externa
            const settingsDoc = null as any
            if (!settingsDoc) {
              alert('No se encontró la configuración general. Por favor, intenta de nuevo.')
              return
            }
            
            const settings = {} as any
            if (!settings) {
              alert('No se encontró la configuración general. Por favor, intenta de nuevo.')
              return
            }
            
            const locations = settings.locations || []
            
            // Encontrar la ubicación más cercana
            let minDistance = Infinity
            let closestLocation = null
            
            for (const location of locations) {
              const distance = calculateDistance(userLat, userLng, location.lat, location.lng)
              if (distance < minDistance) {
                minDistance = distance
                closestLocation = location
              }
            }
            
            if (closestLocation) {
              alert(`Lo sentimos, no realizamos envíos a esta ubicación. La ubicación más cercana es ${closestLocation.nombre} (${Math.round(minDistance * 1000)}m)`)
            } else {
              alert('No se encontraron ubicaciones configuradas. Por favor, intenta de nuevo.')
            }
            
            return
          }
          
          // Si la validación pasa, continuar
          setShippingMethod(method)
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error)
          alert('No se pudo obtener tu ubicación. Por favor, intenta de nuevo.')
        }
      )
    } else {
      // Si es retiro en local, continuar
      setShippingMethod(method)
    }
  }

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

          <div className={clsx(
            "grid gap-8",
            step === 2 
              ? "grid-cols-1 lg:grid-cols-2" 
              : "grid-cols-1 lg:grid-cols-3"
          )}>
            {/* Formulario de checkout */}
            <div className={clsx(
              step === 2 ? "lg:col-span-2" : "lg:col-span-2"
            )}>
              <CheckoutStepSkeleton step={step} />
            </div>

            {/* Order Summary - Solo se muestra en los pasos 1 y 2 */}
            {step !== 2 && (
              <div className="lg:col-span-1">
                <OrderSummary 
                  products={[]}
                  subtotal={0}
                  shipping={0}
                  total={0}
                  isLoading={true}
                />
              </div>
            )}
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
            step === 2 
              ? "grid-cols-1 lg:grid-cols-2" 
              : "grid-cols-1 lg:grid-cols-3"
          )}>
            {/* Formulario de checkout */}
            <div className={clsx(
              step === 2 ? "lg:col-span-2" : "lg:col-span-2"
            )}>
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
                      register={methodsStepTwo.register}
                      errors={methodsStepTwo.formState.errors}
                      setValue={methodsStepTwo.setValue}
                      onNext={() => setStep(2)}
                      setStep={setStep}
                    />
                  </form>
                </FormProvider>
              )}

              {step === 2 && (
                <FormProvider {...methodsStepThree}>
                  <form onSubmit={methodsStepThree.handleSubmit(onConfirm)}>
                    <StepThree
                      step1Data={methodsStepOne.getValues()}
                      step2Data={methodsStepTwo.getValues()}
                      onPay={onConfirm}
                      cart={checkoutCart}
                      setStep={setStep}
                    />
                  </form>
                </FormProvider>
              )}
            </div>

            {/* Order Summary - Solo se muestra en los pasos 1 y 2 */}
            {step !== 2 && (
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
                />
              </div>
            )}
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
