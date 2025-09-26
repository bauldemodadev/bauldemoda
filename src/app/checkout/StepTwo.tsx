import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Step2Data } from "./schema";
import { useEffect, useState } from "react";
import { useAuth } from '@/context/AuthContext';
import { api } from "@/lib/api";
import { useObtenerDireccionesCliente, useGuardarDireccionCliente } from "@/lib/hooks/useClientAddresses";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup } from "@headlessui/react";
import {
  PencilIcon,
  MapPinIcon,
  TruckIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { satoshi } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import DeliveryAddressInput from "@/components/checkout/DeliveryAddressInput";

type DireccionGuardada = {
  id: string;
  direccion: string;
  ciudad: string;
  codigoPostal?: string;
  metodoEntrega: "envio";
  lat?: number;
  lng?: number;
  esFavorita?: boolean;
  sucursal?: {
    ciudad: string;
  };
};

interface SavedAddress extends Step2Data {
  id: string;
  isFavorite?: boolean;
  lat?: number;
  lng?: number;
  sucursal?: {
    city: string;
  };
}

interface AddressData {
  address: string;
  city: string;
  postalCode: string;
  deliveryMethod: "envio";
  lat: number;
  lng: number;
  isFavorite: boolean;
}

type StepTwoProps = {
  register: UseFormRegister<Step2Data>;
  errors: FieldErrors<Step2Data>;
  setValue: any;
  onNext: () => void;
  setStep: (step: number) => void;
};

// Componente de Skeleton para placeholders
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
);

// Componente de LoadingSpinner
const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn("animate-spin", sizeClasses[size])}>
        <svg className="text-gray-900" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
};

// Componente de AddressCard para mostrar direcciones guardadas
const AddressCard = ({ direccion, isSelected, onClick }: { 
  direccion: DireccionGuardada; 
  isSelected: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={clsx(
      "p-4 border rounded-xl cursor-pointer transition-all duration-200",
      "hover:shadow-md",
      isSelected ? "border-gray-900 bg-gray-50" : "border-gray-200"
    )}
    onClick={onClick}
  >
    <div className="flex items-start gap-3">
      <div className={clsx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
        isSelected ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"
      )}>
        <MapPinIcon className="h-6 w-6" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{direccion.direccion}</h4>
        <p className="text-sm text-gray-500">{direccion.ciudad}</p>
        {direccion.codigoPostal && (
          <p className="text-sm text-gray-500">CP: {direccion.codigoPostal}</p>
        )}
      </div>
      <div className={clsx(
        "shrink-0 rounded-full border-2 h-5 w-5 flex items-center justify-center",
        isSelected ? "border-gray-900 bg-gray-900" : "border-gray-300"
      )}>
        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
    </div>
  </motion.div>
);

// Componente de AddressCardSkeleton para el estado de carga
const AddressCardSkeleton = () => (
  <div className="p-4 border rounded-xl">
    <div className="flex items-start gap-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
  </div>
);

const StepTwo = ({
  register,
  errors,
  setValue,
  onNext,
  setStep,
}: StepTwoProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [useSaved, setUseSaved] = useState(true);
  const [storeLocations, setStoreLocations] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [deliveryType, setDeliveryType] = useState<"envio" | "retiro" | null>(null);
  const [isValidAddress, setIsValidAddress] = useState(false);

  const {
    watch,
    trigger,
  } = useFormContext<Step2Data>();

  // Hooks a nivel superior (evita invalid hook call)
  const { guardar, guardando } = useGuardarDireccionCliente();

  const address = watch("direccion");
  const city = watch("ciudad");
  const postalCode = watch("codigoPostal");
  const deliveryMethod = watch("metodoEntrega");

  const deliveryOptions = [
    {
      id: "envio",
      title: "Envío a domicilio",
      description: "Recibe tu pedido en la dirección que prefieras",
      icon: TruckIcon,
    },
    {
      id: "retiro",
      title: "Retiro en tienda",
      description: "Retira tu pedido en nuestra tienda física",
      icon: ShoppingBagIcon,
    },
  ];

  const addressOptions = [
    {
      id: "saved",
      title: "Usar dirección guardada",
      description: "Selecciona una de tus direcciones guardadas",
      icon: MapPinIcon,
    },
    {
      id: "new",
      title: "Ingresar nueva dirección",
      description: "Completa el formulario con los datos de entrega",
      icon: TruckIcon,
    },
  ];

  // Cargar direcciones guardadas desde API externa
  const { direcciones, cargando, refetch } = useObtenerDireccionesCliente();
  useEffect(() => {
    if (Array.isArray(direcciones)) {
      // Adaptar shape externo al interno usado por el formulario
      const adaptadas: any[] = direcciones.map((d) => ({
        id: d.id,
        direccion: d.direccion,
        ciudad: d.ciudad,
        codigoPostal: d.codigoPostal,
        metodoEntrega: (d.metodoEntrega as any) || "envio",
        lat: d.lat,
        lng: d.lng,
        esFavorita: d.esFavorita,
      }));
      setSavedAddresses(adaptadas);
      if (adaptadas.length > 0) {
        const first = adaptadas[0];
        setSelectedValue(first.id);
        setValue("direccion", first.direccion);
        setValue("ciudad", first.ciudad);
        setValue("codigoPostal", first.codigoPostal || "");
        setValue("lat", first.lat);
        setValue("lng", first.lng);
        setIsValidAddress(true);
      }
    }
  }, [direcciones, setValue]);

  // Cargar sucursales
  useEffect(() => {
    const loadStoreLocations = async () => {
      try {
        const settings = await api.get<{ locations?: any[] }>(`/settings/general`);
        const locations = settings.locations || [];
        setStoreLocations(locations);
      } catch (error) {
        console.error("Error al cargar sucursales:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreLocations();
  }, []);

  const handleAddressSelect = (data: {
    direccion: string;
    lat: number;
    lng: number;
    sucursal: any;
    postalCode: string;
  }) => {
    const address: any = {
      id: uuidv4(),
      direccion: data.direccion,
      ciudad: data.sucursal?.city || "Buenos Aires",
      codigoPostal: data.postalCode,
      metodoEntrega: "envio",
      lat: data.lat,
      lng: data.lng,
      sucursal: data.sucursal
    };

    setSelectedAddress(address);
    setUseSaved(false);
    setSelectedValue(null);
    setIsEditing(false);
    setIsValidAddress(true);

    setValue("direccion", address.direccion);
    setValue("ciudad", address.ciudad);
    setValue("codigoPostal", address.codigoPostal || "");
    setValue("lat", address.lat);
    setValue("lng", address.lng);
  };

  const handleStoreSelect = (store: any) => {
    setSelectedStore(store);
    setValue("metodoEntrega", "retiro");
    setValue("direccion", store.direccion);
    setValue("ciudad", store.nombre);
    setValue("codigoPostal", "");
    setValue("lat", store.lat);
    setValue("lng", store.lng);
  };

  const checkDeliveryRadius = async (lat: number, lng: number): Promise<{
    isInRadius: boolean;
    distance: number;
    maxRadius: number;
    nearestStore: {
      id: string;
      nombre: string;
      direccion: string;
      lat: number;
      lng: number;
      radio: number;
    };
  } | null> => {
    try {
      const baseUrl = window.location.origin;
      console.log('URL base:', baseUrl);
      const url = `${baseUrl}/api/check-delivery-radius?lat=${lat}&lng=${lng}`;
      console.log('Verificando radio de entrega en:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la respuesta:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);
      return data;
    } catch (error) {
      console.error("Error al verificar el radio de entrega:", error);
      return null;
    }
  };

  const handleNext = async () => {
    if (!user?.email) {
      setErrorMessage("Debes iniciar sesión para continuar");
      return;
    }

    if (!deliveryType) {
      setErrorMessage("Por favor, selecciona un método de entrega");
      return;
    }

    if (deliveryType === "retiro") {
      if (!selectedStore) {
        setErrorMessage("Por favor, selecciona una tienda para retiro");
        return;
      }
      onNext();
      return;
    }

    if (deliveryType === "envio") {
      let addressToCheck: { lat: number; lng: number } | null = null;

      if (useSaved && savedAddresses.length > 0) {
        if (!selectedValue) {
          setErrorMessage("Por favor, selecciona una dirección de la lista");
          return;
        }
        const selectedSavedAddress = savedAddresses.find(addr => addr.id === selectedValue);
        if (!selectedSavedAddress) {
          setErrorMessage("La dirección seleccionada no es válida");
          return;
        }
        if (!selectedSavedAddress.lat || !selectedSavedAddress.lng) {
          setErrorMessage("La dirección seleccionada no tiene coordenadas válidas");
          return;
        }
        
        const deliveryCheck = await checkDeliveryRadius(
          selectedSavedAddress.lat,
          selectedSavedAddress.lng
        );

        if (!deliveryCheck) {
          setErrorMessage("Error al verificar la disponibilidad de entrega. Por favor, intenta nuevamente.");
          return;
        }

        if (!deliveryCheck.isInRadius) {
          const distance = Math.round(deliveryCheck.distance * 10) / 10;
          const maxRadius = Math.round(deliveryCheck.maxRadius * 10) / 10;
          setErrorMessage(
            `Lo sentimos, esta dirección está fuera de nuestro radio de entrega. ` +
            `La tienda más cercana (${deliveryCheck.nearestStore.nombre}) está a ${distance}km ` +
            `y su radio de entrega es de ${maxRadius}km. ` +
            `Por favor, elige retiro en tienda o consulta por envío especial.`
          );
          return;
        }

        addressToCheck = {
          lat: selectedSavedAddress.lat,
          lng: selectedSavedAddress.lng
        };
      } else if (!useSaved) {
        if (!selectedAddress) {
          setErrorMessage("Por favor, selecciona una dirección válida usando el buscador");
          return;
        }
        if (!selectedAddress.lat || !selectedAddress.lng) {
          setErrorMessage("La dirección seleccionada no tiene coordenadas válidas");
          return;
        }
        addressToCheck = {
          lat: selectedAddress.lat,
          lng: selectedAddress.lng
        };
      }

      if (!addressToCheck) {
        setErrorMessage("Error al procesar la dirección");
        return;
      }

      setIsSaving(true);
      setErrorMessage(null);

      try {
        let address: string;
        let lat: number;
        let lng: number;
        let postalCode: string;
        let city: string;

        if (useSaved) {
          const savedAddr = savedAddresses.find(addr => addr.id === selectedValue);
          if (!(savedAddr as any)?.direccion || !savedAddr?.lat || !savedAddr?.lng || !(savedAddr as any)?.codigoPostal) {
            setErrorMessage("Error al procesar la dirección guardada");
            return;
          }
          address = (savedAddr as any).direccion;
          lat = savedAddr.lat;
          lng = savedAddr.lng;
          postalCode = (savedAddr as any).codigoPostal;
          city = (savedAddr as any).ciudad;
        } else {
          if (!(selectedAddress as any)?.direccion || !selectedAddress?.lat || !selectedAddress?.lng) {
            setErrorMessage("Error al procesar la nueva dirección");
            return;
          }
          address = (selectedAddress as any).direccion;
          lat = selectedAddress.lat;
          lng = selectedAddress.lng;
          postalCode = (selectedAddress as any).codigoPostal || "";
          city = (selectedAddress as any).ciudad;
        }

        // Guardar dirección en API externa (adaptando a español)
        const direccionPayload = {
          direccion: address,
          ciudad: city,
          codigoPostal: postalCode,
          metodoEntrega: "envio" as const,
          lat,
          lng,
          esFavorita: false,
        };

        if (!useSaved || (selectedValue && isEditing)) {
          // Crear o actualizar según corresponda
          await guardar(direccionPayload, selectedValue || undefined);
          await refetch();
        }

        onNext();
      } catch (error) {
        console.error("Error al guardar la dirección:", error);
        setErrorMessage("Ocurrió un error al guardar la dirección. Por favor, intenta nuevamente");
        return;
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <h2
        className={cn([
          satoshi.className,
          "text-3xl font-bold text-center mb-6",
        ])}
      >
        {!deliveryType ? "Método de entrega" : "Dirección de entrega"}
      </h2>

      {/* Mensaje de error */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!deliveryType ? (
        <RadioGroup
          value={deliveryType}
          onChange={(type) => {
            setDeliveryType(type);
            setValue("metodoEntrega", type);
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deliveryOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = option.id === deliveryType;

              return (
                <RadioGroup.Option
                  key={option.id}
                  value={option.id}
                  className={({ active }) =>
                    clsx(
                      "relative rounded-2xl shadow-sm px-6 py-4 cursor-pointer flex items-start space-x-4",
                      "transition-all duration-200 ease-in-out",
                      "hover:shadow-md",
                      "border-2",
                      isSelected
                        ? "border-gray-900 bg-gray-50"
                        : "border-gray-200",
                      active && !isSelected && "border-gray-300 bg-gray-50"
                    )
                  }
                >
                  <>
                    <div
                      className={clsx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                        isSelected
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <RadioGroup.Label
                        className={clsx(
                          "block text-sm font-medium leading-6",
                          isSelected ? "text-gray-900" : "text-gray-900"
                        )}
                      >
                        {option.title}
                      </RadioGroup.Label>
                      <RadioGroup.Description className="mt-1 text-sm text-gray-500">
                        {option.description}
                      </RadioGroup.Description>
                    </div>
                    <div
                      className={clsx(
                        "shrink-0 rounded-full border-2 h-5 w-5 flex items-center justify-center",
                        isSelected
                          ? "border-gray-900 bg-gray-900"
                          : "border-gray-300"
                      )}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </>
                </RadioGroup.Option>
              );
            })}
          </div>
        </RadioGroup>
      ) : (
        <>
          {deliveryType === "retiro" ? (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Selecciona una sucursal</h3>
              <div className="grid grid-cols-1 gap-4">
                {isLoading ? (
                  <>
                    <AddressCardSkeleton />
                    <AddressCardSkeleton />
                  </>
                ) : (
                  storeLocations.map((store) => (
                    <motion.div
                      key={store.nombre}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={clsx(
                        "p-4 border rounded-lg cursor-pointer transition-all duration-200",
                        "hover:shadow-md",
                        selectedStore?.nombre === store.nombre
                          ? "border-gray-900 bg-gray-50"
                          : "border-gray-200 hover:border-gray-900"
                      )}
                      onClick={() => handleStoreSelect(store)}
                    >
                      <h4 className="font-medium">{store.nombre}</h4>
                      <p className="text-sm text-gray-600">{store.direccion}</p>
                      <p className="text-sm text-gray-600">Radio de entrega: {store.radio}m</p>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {savedAddresses.length > 0 && (
                <RadioGroup
                  value={useSaved}
                  onChange={(value) => {
                    setUseSaved(value);
                    if (!value) {
                      setSelectedValue(null);
                      setSelectedAddress(null);
                      setIsValidAddress(false);
                      setValue("direccion", "");
                      setValue("ciudad", "");
                      setValue("codigoPostal", "");
                      setValue("lat", null);
                      setValue("lng", null);
                    } else if (savedAddresses.length > 0) {
                      const firstAddress = savedAddresses[0];
                      setSelectedValue(firstAddress.id);
                      setValue("direccion", (firstAddress as any).direccion ?? firstAddress.address);
                      setValue("ciudad", (firstAddress as any).ciudad ?? firstAddress.city);
                      setValue("codigoPostal", (firstAddress as any).codigoPostal ?? firstAddress.postalCode ?? "");
                      setValue("lat", firstAddress.lat);
                      setValue("lng", firstAddress.lng);
                      setIsValidAddress(true);
                      setSelectedAddress(firstAddress as any);
                    }
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addressOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = option.id === "saved" ? useSaved : !useSaved;

                      return (
                        <RadioGroup.Option
                          key={option.id}
                          value={option.id === "saved"}
                          className={({ active }) =>
                            clsx(
                              "relative rounded-2xl shadow-sm px-6 py-4 cursor-pointer flex items-start space-x-4",
                              "transition-all duration-200 ease-in-out",
                              "hover:shadow-md",
                              "border-2",
                              isSelected
                                ? "border-gray-900 bg-gray-50"
                                : "border-gray-200",
                              active && !isSelected && "border-gray-300 bg-gray-50"
                            )
                          }
                        >
                          <>
                            <div
                              className={clsx(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                                isSelected
                                  ? "bg-gray-900 text-white"
                                  : "bg-gray-100 text-gray-500"
                              )}
                            >
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <RadioGroup.Label
                                className={clsx(
                                  "block text-sm font-medium leading-6",
                                  isSelected ? "text-gray-900" : "text-gray-900"
                                )}
                              >
                                {option.title}
                              </RadioGroup.Label>
                              <RadioGroup.Description className="mt-1 text-sm text-gray-500">
                                {option.description}
                              </RadioGroup.Description>
                            </div>
                            <div
                              className={clsx(
                                "shrink-0 rounded-full border-2 h-5 w-5 flex items-center justify-center",
                                isSelected
                                  ? "border-gray-900 bg-gray-900"
                                  : "border-gray-300"
                              )}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                          </>
                        </RadioGroup.Option>
                      );
                    })}
                  </div>
                </RadioGroup>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={useSaved ? "saved" : "new"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {useSaved && savedAddresses.length > 0 ? (
                    <div className="space-y-4">
                      {isLoading ? (
                        <>
                          <AddressCardSkeleton />
                          <AddressCardSkeleton />
                        </>
                      ) : (
                        savedAddresses.map((addr) => (
                          <AddressCard
                            key={addr.id}
                            direccion={addr as DireccionGuardada}
                            isSelected={addr.id === selectedValue}
                            onClick={() => {
                              setSelectedValue(addr.id);
                              setValue("direccion", (addr as any).direccion ?? addr.address);
                              setValue("ciudad", (addr as any).ciudad ?? addr.city);
                              setValue("codigoPostal", (addr as any).codigoPostal ?? addr.postalCode ?? "");
                              setValue("lat", (addr as any).lat);
                              setValue("lng", (addr as any).lng);
                              setIsValidAddress(true);
                              setSelectedAddress(addr as any);
                            }}
                          />
                        ))
                      )}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      {!isValidAddress ? (
                        <DeliveryAddressInput onValidAddress={handleAddressSelect} />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 border rounded-xl bg-gray-50"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Dirección seleccionada</p>
                              <p className="font-medium text-gray-900">{(selectedAddress as any).direccion}</p>
                              <p className="text-sm text-gray-600">{(selectedAddress as any).ciudad}</p>
                              {watch("codigoPostal") && (
                                <p className="text-sm text-gray-600">CP: {watch("codigoPostal")}</p>
                              )}
                            </div>
                            <CheckCircleIcon className="h-6 w-6 text-green-500" />
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:underline"
                              onClick={() => {
                                setIsValidAddress(false);
                                setSelectedAddress(null);
                                setValue("direccion", "");
                                setValue("ciudad", "");
                                setValue("codigoPostal", "");
                                setValue("lat", null);
                                setValue("lng", null);
                              }}
                            >
                              Cambiar dirección
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </>
      )}

      <div className="fixed z-10 bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={() => {
              if (deliveryType) {
                setDeliveryType(null);
              } else {
                setStep(0);
              }
            }}
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </motion.button>
          {deliveryType && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleNext}
              disabled={isSaving || (deliveryType === "envio" && !isValidAddress) || (deliveryType === "retiro" && !selectedStore)}
              className={clsx(
                "bg-black text-white rounded-full w-full max-w-[200px] h-[48px]",
                "transition-all duration-200 ease-in-out",
                "hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>Continuar</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StepTwo;