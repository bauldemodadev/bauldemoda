/**
 * StepTwo: Método de Pago
 * 
 * Según FASE 7:
 * - Selector de método de pago (MP, Efectivo, Transferencia)
 * - Sin campos de envío (solo retiro en sucursal)
 * - Recalcular total según método de pago
 * - Crear orden en Firestore y procesar pago
 */

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import {
  CreditCardIcon,
  BanknotesIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";
import { Step1Data, Step2Data } from "./schema";
import { cn } from "@/lib/utils";
import { futura } from "@/styles/fonts";
import { useToast } from "@/components/ui/use-toast";
import { getFormattedPickupLocations } from "@/lib/utils/pickupLocations";

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
  srcUrl?: string;
  discount?: {
    percentage: number;
    amount: number;
  };
  activePromo?: {
    cantidad: number;
    descuento: number;
    precioFinal: number;
  };
  sede?: 'almagro' | 'ciudad-jardin' | null;
  locationText?: string | null;
};

interface StepTwoProps {
  step1Data: Step1Data;
  cart: Product[];
  setStep: (step: number) => void;
}

const paymentMethods = [
  {
    id: 'mp',
    name: 'Mercado Pago',
    description: 'Paga con tarjeta de crédito, débito o dinero en cuenta',
    icon: CreditCardIcon,
    color: 'blue',
  },
  {
    id: 'cash',
    name: 'Efectivo',
    description: 'Paga en efectivo al retirar en la sucursal',
    icon: BanknotesIcon,
    color: 'green',
  },
  {
    id: 'transfer',
    name: 'Transferencia',
    description: 'Realiza una transferencia bancaria y retira en sucursal',
    icon: ArrowPathIcon,
    color: 'purple',
  },
];

export default function StepTwo({ step1Data, cart, setStep }: StepTwoProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    watch,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    trigger,
  } = useFormContext<Step2Data>();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedPaymentMethod = watch('paymentMethod');

  // Validar en tiempo real
  useEffect(() => {
    if (selectedPaymentMethod) {
      trigger('paymentMethod');
    }
  }, [selectedPaymentMethod, trigger]);

  const onSubmit = async (data: Step2Data) => {
    if (!user?.email) {
      setErrorMessage("Debes iniciar sesión para continuar");
      return;
    }

    if (!data.paymentMethod) {
      setErrorMessage("Selecciona un método de pago");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Leer metadata del checkout si existe (para cursos presenciales)
      const checkoutMetadata = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('checkout_metadata') || '{}')
        : {};
      
      // Determinar si es un curso presencial y obtener la sede
      const isPresentialCheckout = checkoutMetadata.type === 'curso_presencial' || 
                                    checkoutMetadata.isDirectCheckout === true;
      const sede = checkoutMetadata.sede || null;
      
      // Llamar al nuevo endpoint /api/checkout
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: step1Data.nombre,
            email: step1Data.email || user.email,
            phone: step1Data.telefono,
          },
          items: cart.map((item) => ({
            type: 'product' as const,
            id: item.id,
            quantity: item.quantity,
          })),
          paymentMethod: data.paymentMethod,
          // Información adicional para cursos presenciales
          ...(isPresentialCheckout && sede ? {
            orderType: 'curso_presencial' as const,
            sede: sede as 'almagro' | 'ciudad-jardin',
          } : {}),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el checkout');
      }

      const result = await response.json();

      if (data.paymentMethod === 'mp') {
        // Redirigir a Mercado Pago
        if (result.paymentUrl) {
          window.location.href = result.paymentUrl;
        } else {
          throw new Error('No se recibió la URL de pago');
        }
      } else {
        // Efectivo o transferencia: mostrar mensaje de éxito con instrucciones
        toast({
          title: 'Orden creada exitosamente',
          description: `Tu orden #${result.orderId} ha sido creada. ${result.order?.instructions?.message || ''}`,
        });

        // Limpiar carrito
        localStorage.removeItem('checkout_cart');
        localStorage.removeItem('cart');

        // Redirigir a página de éxito
        router.push(`/checkout/success?orderId=${result.orderId}`);
      }
    } catch (error) {
      console.error('Error procesando checkout:', error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Hubo un error al procesar el pago. Por favor, intenta nuevamente.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h2
          className={cn([
            futura.className,
            "text-2xl md:text-3xl font-bold text-gray-900 mb-2",
          ])}
        >
          Método de Pago
        </h2>
        <p className="text-gray-600">
          Selecciona cómo deseas pagar. Todos los pedidos se retiran en sucursal.
        </p>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <ExclamationCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {/* Selector de método de pago */}
      <div>
        <input
          type="hidden"
          {...register('paymentMethod')}
        />
        <RadioGroup
          value={selectedPaymentMethod || ''}
          onChange={(value) => {
            setValue('paymentMethod', value as 'mp' | 'cash' | 'transfer');
            trigger('paymentMethod');
          }}
        >
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPaymentMethod === method.id;

              return (
                <RadioGroup.Option key={method.id} value={method.id}>
                  {({ checked }) => (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={cn(
                        "relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all",
                        checked
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      )}
                    >
                      <div className="flex items-start w-full">
                        <div className="flex-shrink-0 mt-1">
                          <Icon
                            className={cn(
                              "w-6 h-6",
                              checked ? "text-pink-600" : "text-gray-400"
                            )}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <RadioGroup.Label
                            className={cn(
                              "text-lg font-semibold",
                              checked ? "text-pink-900" : "text-gray-900"
                            )}
                          >
                            {method.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            className={cn(
                              "text-sm mt-1",
                              checked ? "text-pink-700" : "text-gray-600"
                            )}
                          >
                            {method.description}
                          </RadioGroup.Description>
                        </div>
                        {checked && (
                          <CheckCircleIcon className="w-6 h-6 text-pink-600 flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  )}
                </RadioGroup.Option>
              );
            })}
          </div>
        </RadioGroup>

        {errors.paymentMethod && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      {/* Información de retiro en sucursal */}
      {selectedPaymentMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#E9ABBD]/10 border border-[#E9ABBD] rounded-lg p-4"
        >
          <h3 className="font-semibold text-[#D44D7D] mb-2">
            Retiro en Sucursal
          </h3>
          <p className="text-sm text-[#D44D7D] mb-2">
            {cart.length === 1 
              ? 'Tu pedido debe retirarse en:'
              : 'Todos los pedidos deben retirarse en nuestras sucursales:'}
          </p>
          <ul className="mt-2 text-sm text-[#D44D7D] list-disc list-inside space-y-1">
            {getFormattedPickupLocations(cart).map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
          {selectedPaymentMethod === 'cash' && (
            <p className="mt-3 text-sm font-medium text-[#D44D7D] flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5" />
              Pagarás en efectivo al momento del retiro. La orden quedará reservada por 48 horas.
            </p>
          )}
          {selectedPaymentMethod === 'transfer' && (
            <p className="mt-3 text-sm font-medium text-[#D44D7D] flex items-center gap-2">
              <BuildingLibraryIcon className="w-5 h-5" />
              Debes realizar la transferencia y luego retirar en la sucursal. La orden quedará reservada por 48 horas.
            </p>
          )}
        </motion.div>
      )}

      {/* Términos y condiciones */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="mt-1 w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <span className="text-sm text-gray-700">
            Acepto los{' '}
            <a href="/terminos" target="_blank" className="text-pink-600 hover:underline">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="/privacidad" target="_blank" className="text-pink-600 hover:underline">
              política de privacidad
            </a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {errors.acceptTerms.message}
          </p>
        )}
      </div>

      {/* Comentario opcional */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentario adicional (opcional)
        </label>
        <textarea
          {...register('comment')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Algún comentario o instrucción especial..."
        />
      </div>

      {/* Botones de navegación */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setStep(0)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Volver
        </button>

        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          disabled={isProcessing || !isValid || !selectedPaymentMethod}
          className={cn(
            "px-6 py-3 rounded-lg font-semibold text-white transition-all",
            isProcessing || !isValid || !selectedPaymentMethod
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-pink-600 hover:bg-pink-700 shadow-lg hover:shadow-xl"
          )}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              Procesando...
            </span>
          ) : selectedPaymentMethod === 'mp' ? (
            'Pagar con Mercado Pago'
          ) : selectedPaymentMethod === 'cash' ? (
            'Confirmar Orden (Pago en Efectivo)'
          ) : selectedPaymentMethod === 'transfer' ? (
            'Confirmar Orden (Transferencia)'
          ) : (
            'Continuar'
          )}
        </button>
      </div>
    </div>
  );
}
