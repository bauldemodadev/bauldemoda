import { Step1Data, Step2Data, Step3Data } from "./schema";
import { useState, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
// Firestore removido
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import { useFormContext } from "react-hook-form";
import {
  UserIcon,
  TruckIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { futura } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from '@/lib/constants'

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
};

type StepThreeProps = {
  step1Data: Step1Data;
  step2Data: Step2Data;
  onPay: () => void;
  cart: Product[];
  setStep: (step: number) => void;
};

type Section = {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content?: Array<{ label: string; value: string }>;
  isOrder?: boolean;
  isPayment?: boolean;
};

const StepThree = ({
  step1Data,
  step2Data,
  onPay,
  cart,
  setStep,
}: StepThreeProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();

  // Calcular subtotal y descuentos
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountTotal = cart.reduce((sum, item) => {
    if (item.activePromo) {
      return sum + (item.price * item.quantity - item.activePromo.precioFinal);
    }
    const discount = item.discount || { percentage: 0, amount: 0 };
    if (discount.percentage > 0) {
      return sum + (item.price * item.quantity * (discount.percentage / 100));
    }
    if (discount.amount > 0) {
      return sum + (discount.amount * item.quantity);
    }
    return sum;
  }, 0);
  const total = subtotal - discountTotal;

  const {
    register,
    formState: { errors, isValid },
    watch,
    trigger,
  } = useFormContext<Step3Data>();

  // Validación en tiempo real
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name && type === "change") {
        trigger(name as keyof Step3Data);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  // Crear orden automáticamente al llegar a StepThree
  useEffect(() => {
    const createOrderOnMount = async () => {
      if (!user?.email || !cart.length) {
        console.log('⚠️ No se puede crear orden: usuario o carrito vacío');
        return;
      }

      try {
        const orderId = uuidv4();
        
        const orderData = {
          orderId,
          userId: user.email,
          customerInfo: {
            nombre: (step1Data as any).nombre,
            email: (step1Data as any).email,
            telefono: (step1Data as any).telefono,
            dni: (step1Data as any).dni,
          },
          deliveryInfo: {
            direccion: (step2Data as any).direccion,
            ciudad: (step2Data as any).ciudad,
            codigoPostal: (step2Data as any).codigoPostal,
            metodoEntrega: (step2Data as any).metodoEntrega,
          },
          items: cart,
          total: cart.reduce((sum, item) => sum + item.totalPrice, 0),
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        console.log('🔄 Creando orden automáticamente al llegar a StepThree...', orderData);

        const orderResponse = await fetch("/api/create-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          console.error('❌ Error al crear orden automáticamente:', errorData);
          return;
        }

        const orderResult = await orderResponse.json();
        console.log('✅ Orden creada automáticamente:', orderResult);
        
        // Usar el orderId que devuelve la API externa (si lo genera automáticamente)
        const finalOrderId = orderResult.orderId || orderId;
        setOrderId(finalOrderId);
        
      } catch (error) {
        console.error('❌ Error al crear orden automáticamente:', error);
      }
    };

    createOrderOnMount();
  }, [user?.email, cart, step1Data, step2Data]);

  const handlePayment = async () => {
    if (!user?.email) {
      setErrorMessage("Debes iniciar sesión para continuar");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Usar el orderId que ya se creó automáticamente
      if (!orderId) {
        setErrorMessage("Error: No se encontró la orden. Recarga la página e intenta nuevamente.");
        setIsProcessing(false);
        return;
      }

      console.log('💳 Procediendo al pago con orden existente:', orderId);

      // Create the payment preference in Mercado Pago
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            title: item.name,
            unit_price: Number(item.price),
            quantity: Number(item.quantity),
          })),
          orderId: orderId,
          payer: {
            email: user.email,
            name: (step1Data as any).nombre,
          },
        }),
      });

      const data = await res.json();

      if (!data.init_point) {
        throw new Error("No se recibió el punto de inicio del pago");
      }

      // Redirect to MercadoPago checkout
      window.location.href = data.init_point;
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setErrorMessage(
        "Hubo un error al procesar el pago. Por favor, intenta nuevamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const sections = [
    {
      id: 1,
      title: "Información de contacto",
      icon: UserIcon,
      content: [
        { label: "Nombre", value: (step1Data as any).nombre },
        { label: "Email", value: (step1Data as any).email },
        { label: "Teléfono", value: (step1Data as any).telefono },
        { label: "DNI", value: (step1Data as any).dni },
      ],
    },
    {
      id: 2,
      title: (step2Data as any).metodoEntrega === "retiro" ? "Información de retiro" : "Dirección de entrega",
      icon: (step2Data as any).metodoEntrega === "retiro" ? ShoppingBagIcon : TruckIcon,
      content: (step2Data as any).metodoEntrega === "retiro" 
        ? [
            { label: "Tienda", value: (step2Data as any).direccion },
            { label: "Dirección", value: (step2Data as any).ciudad },
            { label: "Método de entrega", value: "Retiro en tienda" },
          ]
        : [
            { label: "Dirección", value: (step2Data as any).direccion || "" },
            { label: "Ciudad", value: (step2Data as any).ciudad || "" },
            { label: "Código Postal", value: (step2Data as any).codigoPostal || "" },
            { label: "Método de entrega", value: "Envío a domicilio" },
          ],
    },
    {
      id: 3,
      title: "Resumen del pedido",
      icon: ShoppingBagIcon,
      isOrder: true,
    },
    {
      id: 4,
      title: "Método de pago",
      icon: CreditCardIcon,
      isPayment: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h2
        className={cn([
          futura.className,
          "text-3xl font-bold text-center mb-6",
        ])}
      >
        Confirmá tu pedido
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna izquierda: Información personal y de entrega */}
        <div>
          {sections.slice(0, 2).map((section) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
              >
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-gray-900" />
                  {section.title}
                </h3>
                <dl className="space-y-3">
                  {section.content?.map(({ label, value }) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-sm text-gray-500">{label}:</dt>
                      <dd className={clsx(
                        "text-sm font-medium text-gray-900",
                        label === "Horario" && "whitespace-pre-line"
                      )}>
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            );
          })}
        </div>

        {/* Columna centro: Resumen del pedido */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <ShoppingBagIcon className="w-5 h-5 text-gray-900" />
              Resumen del pedido
            </h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <img
                        src={item.image || item.srcUrl || PLACEHOLDER_IMAGE}
                        alt={item.name}
                        className="object-cover rounded-lg"
                        width={64}
                        height={64}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          {item.quantity} x ${item.price}
                        </p>
                        {item.activePromo && (
                          <span className="text-xs text-green-600 font-medium">
                            {item.activePromo.cantidad}x -{item.activePromo.descuento}%
                          </span>
                        )}
                        {item.discount && item.discount.percentage > 0 && !item.activePromo && (
                          <span className="text-xs text-red-600 font-medium">
                            -{item.discount.percentage}%
                          </span>
                        )}
                        {item.discount && item.discount.amount > 0 && !item.activePromo && (
                          <span className="text-xs text-red-600 font-medium">
                            -${item.discount.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.totalPrice}</p>
                    {(item.activePromo || item.discount) && (
                      <p className="text-sm text-gray-400 line-through">
                        ${item.price * item.quantity}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 space-y-3">
                <div className="flex justify-between text-base">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${subtotal.toFixed(2)}</p>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-base">
                    <p className="text-gray-600">Descuentos</p>
                    <p className="font-medium text-green-600">-${discountTotal.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p className="whitespace-nowrap">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
          >
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2 mb-4">
              <CreditCardIcon className="w-5 h-5 text-gray-900" />
              Método de pago
            </h3>
            <div className="space-y-6">
              {/* Logo y badge de MercadoPago */}
              <div className="flex items-center justify-between bg-[#F5F5F5] p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src="/mercadopago.svg"
                    alt="Mercado Pago"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span className="font-medium text-gray-900">MercadoPago</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200">
                  <span className="text-[10px] lg:text-sm text-gray-600">Pago seguro</span>
                  <svg
                    className="w-4 h-4 text-gray-600"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12L11 14L15 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Comentarios */}
              <div className="space-y-2">
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Comentarios adicionales (opcional)
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  className="mt-1 block w-full rounded-xl border-gray-200 shadow-sm 
                    focus:border-gray-900 focus:ring-gray-900 sm:text-sm p-4"
                  placeholder="Instrucciones especiales para la entrega..."
                  {...register("comment")}
                />
              </div>
            </div>
          </motion.div>
        </div>

         {/* Columna derecha: Resumen del pedido y método de pago */}
         <div>
          {/* Botones de navegación */}
          <div className="fixed z-10 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-xs font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Volver
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePayment}
                disabled={isProcessing}
                className={clsx(
                  "inline-flex items-center px-6 py-3 border border-transparent text-xs font-medium rounded-full shadow-sm text-white gap-2",
                  {
                    "bg-gray-900 hover:bg-gray-800": !isProcessing,
                    "bg-gray-400 cursor-not-allowed": isProcessing,
                  }
                )}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <img
                      src="/mercadopago.svg"
                      alt="Mercado Pago"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    Confirmar y pagar
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md bg-red-50 p-4"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{errorMessage}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StepThree;
