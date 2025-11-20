"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Calendar, Clock, MapPin, Loader2 } from "lucide-react";

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (selectedDate?: string, selectedTime?: string) => void;
}

interface AvailabilitySlot {
  date: string;
  time: string;
  available: boolean;
  capacity?: number;
  enrolled?: number;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchAvailability();
    } else {
      // Reset cuando se cierra el modal
      setSelectedDate("");
      setSelectedTime("");
      setAvailability([]);
      setError(null);
    }
  }, [isOpen, product]);

  // Función para parsear durationText y extraer información
  const parseDurationText = (durationText?: string) => {
    if (!durationText) return null;

    // Buscar patrones como "1 mes", "4 clases", "2hs"
    const durationMatch = durationText.match(/(\d+)\s*(mes|meses)/i);
    const classesMatch = durationText.match(/(\d+)\s*(clase|clases)/i);
    const hoursMatch = durationText.match(/(\d+)\s*(hs|h|horas|hora)/i);

    return {
      months: durationMatch ? parseInt(durationMatch[1], 10) : null,
      classes: classesMatch ? parseInt(classesMatch[1], 10) : null,
      hoursPerClass: hoursMatch ? parseInt(hoursMatch[1], 10) : null,
      raw: durationText
    };
  };

  // Función para generar disponibilidad basada en durationText
  const generateAvailabilityFromDuration = (durationText?: string): AvailabilitySlot[] => {
    if (!durationText) return [];

    const parsed = parseDurationText(durationText);
    if (!parsed) return [];

    const slots: AvailabilitySlot[] = [];
    const today = new Date();
    const startDate = new Date(today);
    
    // Empezar desde la próxima semana (lunes)
    const daysUntilMonday = (8 - startDate.getDay()) % 7 || 7;
    startDate.setDate(startDate.getDate() + daysUntilMonday);
    startDate.setHours(0, 0, 0, 0);

    // Generar fechas para las próximas 8 semanas
    const weeksToShow = 8;
    const times = ["10:00", "14:00", "18:00"]; // Turnos comunes

    for (let week = 0; week < weeksToShow; week++) {
      const weekDate = new Date(startDate);
      weekDate.setDate(weekDate.getDate() + (week * 7));

      // Solo mostrar lunes, miércoles y viernes
      const daysOfWeek = [1, 3, 5]; // Lunes, Miércoles, Viernes
      
      daysOfWeek.forEach(dayOfWeek => {
        const classDate = new Date(weekDate);
        const dayOffset = (dayOfWeek - weekDate.getDay() + 7) % 7;
        classDate.setDate(weekDate.getDate() + dayOffset);

        // Solo agregar fechas futuras
        if (classDate >= today) {
          times.forEach(time => {
            // Simular disponibilidad (en producción esto vendría de una API)
            const isAvailable = Math.random() > 0.2; // 80% de disponibilidad
            const capacity = 15;
            const enrolled = isAvailable ? Math.floor(Math.random() * capacity) : capacity;

            slots.push({
              date: classDate.toISOString().split('T')[0],
              time,
              available: isAvailable && enrolled < capacity,
              capacity,
              enrolled
            });
          });
        }
      });
    }

    // Ordenar por fecha y hora
    return slots.sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.time.localeCompare(b.time);
    });
  };

  const fetchAvailability = async () => {
    if (!product) return;

    setLoading(true);
    setError(null);

    try {
      // Simular carga
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generar disponibilidad basada en durationText
      const generatedAvailability = generateAvailabilityFromDuration(product.durationText);
      
      if (generatedAvailability.length === 0) {
        setError("No se pudo generar disponibilidad. Por favor, contacta con nosotros.");
      } else {
        setAvailability(generatedAvailability);
      }
    } catch (err) {
      console.error("Error al obtener disponibilidad:", err);
      setError("No se pudo cargar la disponibilidad. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    // Solo confirmar si se seleccionó fecha y hora
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedByDate = availability.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  const sede = product?.sede === "ciudad-jardin" 
    ? "Ciudad Jardín (El Palomar, zona oeste)"
    : product?.sede === "almagro"
    ? "Almagro, Capital Federal"
    : "Presencial";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Consultar Disponibilidad
          </DialogTitle>
          <DialogDescription className="text-base">
            {product?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del curso */}
          <div className="bg-pink-50 p-4 rounded-lg space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-pink-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Sede:</p>
                <p className="text-gray-700">{sede}</p>
              </div>
            </div>
            {product?.durationText && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-pink-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900">Duración:</p>
                  <p className="text-gray-700">{product.durationText}</p>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-pink-600 mb-4" />
              <p className="text-gray-600">Cargando disponibilidad...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          ) : availability.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                No hay fechas disponibles en este momento. Por favor, contacta con nosotros para más información.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-600" />
                  Fechas y Horarios Disponibles
                </h3>

                <div className="space-y-4">
                  {Object.entries(groupedByDate).map(([date, slots]) => (
                    <div key={date} className="border rounded-lg p-4">
                      <div className="font-semibold text-gray-900 mb-3">
                        {formatDate(date)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {slots.map((slot, index) => (
                          <button
                            key={`${date}-${slot.time}-${index}`}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedDate(date);
                                setSelectedTime(slot.time);
                              }
                            }}
                            disabled={!slot.available}
                            className={`
                              p-3 rounded-lg border-2 transition-all
                              ${
                                selectedDate === date && selectedTime === slot.time
                                  ? "border-pink-600 bg-pink-50"
                                  : slot.available
                                  ? "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                                  : "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="font-medium">{slot.time}</span>
                            </div>
                            {slot.available ? (
                              <div className="text-xs text-gray-600">
                                {slot.enrolled !== undefined && slot.capacity !== undefined
                                  ? `${slot.capacity - slot.enrolled} cupos disponibles`
                                  : "Disponible"}
                              </div>
                            ) : (
                              <div className="text-xs text-red-600">Sin cupos</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedDate && selectedTime && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">
                    ✓ Seleccionado: {formatDate(selectedDate)} a las {selectedTime}
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> La disponibilidad puede cambiar. Después de la compra, 
                  nos pondremos en contacto contigo para confirmar la fecha y horario final.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-pink-600 hover:bg-pink-700 text-white"
            disabled={loading || !selectedDate || !selectedTime}
          >
            {selectedDate && selectedTime ? "Agregar al Carrito" : "Selecciona fecha y horario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;

