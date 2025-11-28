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

// Ya no necesitamos AvailabilitySlot, solo mostramos información de turnos

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [parsedTurnos, setParsedTurnos] = useState<{
    days: number[];
    times: string[];
    dayTimePairs: Array<{ day: number; time: string }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [noTurnosFound, setNoTurnosFound] = useState(false); // Indica si hay detailsHtml pero no se encontraron turnos

  useEffect(() => {
    if (isOpen && product) {
      fetchAvailability();
    } else {
      // Reset cuando se cierra el modal
      setParsedTurnos(null);
      setError(null);
      setNoTurnosFound(false);
    }
  }, [isOpen, product]);

  // Función para parsear detailsHtml y extraer turnos y horarios REALES
  const parseDetailsHtml = (detailsHtml?: string) => {
    if (!detailsHtml) return null;

    // Crear un parser DOM para analizar el HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(detailsHtml, 'text/html');
    
    // Mapeo de días de la semana en español a números (0 = domingo, 1 = lunes, etc.)
    const dayMap: Record<string, number> = {
      'domingo': 0,
      'lunes': 1,
      'martes': 2,
      'miércoles': 3,
      'miercoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sábado': 6,
      'sabado': 6
    };

    // Buscar específicamente secciones con "Turnos" o "TURNO"
    const turnosSections: string[] = [];
    
    // Buscar en h3, h4, h5, h6, strong, b que contengan "Turnos" o "TURNO"
    const headings = doc.querySelectorAll('h3, h4, h5, h6, strong, b');
    headings.forEach(heading => {
      const text = heading.textContent || '';
      if (/turnos?/i.test(text)) {
        // Obtener el contenido siguiente (puede estar en el mismo elemento, siguiente hermano, o en listas)
        let nextContent = '';
        
        // Buscar en el siguiente elemento hermano
        let nextSibling = heading.nextElementSibling;
        if (nextSibling) {
          nextContent = nextSibling.textContent || '';
        }
        
        // Buscar en listas (ul, ol) que sigan al heading
        let current = heading.nextElementSibling;
        while (current) {
          if (current.tagName === 'UL' || current.tagName === 'OL') {
            nextContent += ' ' + (current.textContent || '');
            break;
          }
          current = current.nextElementSibling;
        }
        
        // También buscar en el texto del mismo elemento si contiene más información
        const fullText = (heading.textContent || '') + ' ' + nextContent;
        if (fullText.trim()) {
          turnosSections.push(fullText);
        }
      }
    });

    // También buscar en el texto completo del documento por patrones de turnos
    const fullText = doc.body.textContent || detailsHtml;
    
    // Buscar patrones como "Martes 10hs", "Sábado 15.30hs", "Jueves 18hs", etc.
    const foundDays: Set<number> = new Set();
    const foundTimes: Set<string> = new Set();
    const foundDayTimePairs: Array<{ day: number; time: string }> = [];

    // Buscar en las secciones de turnos encontradas
    const allTurnosText = turnosSections.join(' ') + ' ' + fullText;
    
    // Patrón 1: "Día HHhs" o "Día HH.HHhs" o "Día HH:HHhs"
    const dayTimeMatches = Array.from(allTurnosText.matchAll(/\b(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\s+(\d{1,2})(?:\.(\d{1,2}))?(?:hs|:(\d{2})hs?)?/gi));
    for (const match of dayTimeMatches) {
      const dayName = match[1].toLowerCase();
      const dayNum = dayMap[dayName];
      if (dayNum !== undefined) {
        const hours = parseInt(match[2], 10);
        let minutes = 0;
        
        // Manejar formato "10.3hs" (10:30) o "10:30hs"
        if (match[3]) {
          // Formato decimal: 10.3 = 10:30
          const decimalPart = parseFloat('0.' + match[3]);
          minutes = Math.round(decimalPart * 60);
        } else if (match[4]) {
          // Formato normal: 10:30
          minutes = parseInt(match[4], 10);
        }
        
        if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
          const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          foundDays.add(dayNum);
          foundTimes.add(timeStr);
          foundDayTimePairs.push({ day: dayNum, time: timeStr });
        }
      }
    }

    // Patrón 2: Buscar horarios sueltos en formato "HH.HHhs" o "HH:HHhs" (sin día específico)
    const timeOnlyMatches = Array.from(allTurnosText.matchAll(/\b(\d{1,2})(?:\.(\d{1,2})|:(\d{2}))hs?:/gi));
    for (const match of timeOnlyMatches) {
      const hours = parseInt(match[1], 10);
      let minutes = 0;
      
      if (match[2]) {
        // Formato decimal: 14.30 = 14:30
        const decimalPart = parseFloat('0.' + match[2]);
        minutes = Math.round(decimalPart * 60);
      } else if (match[3]) {
        // Formato normal: 14:30
        minutes = parseInt(match[3], 10);
      }
      
      if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        foundTimes.add(timeStr);
      }
    }

    // Buscar también en formato separado por comas o pipes: "Martes 10hs, Martes 18hs, Miércoles 10hs"
    const commaSeparated = allTurnosText.match(/(?:turnos?|TURNO)[:\s]*(.+?)(?:\n|$|<h|<\/)/i);
    if (commaSeparated && commaSeparated[1]) {
      const turnosList = commaSeparated[1]
        .split(/[,|]/)
        .map(t => t.trim())
        .filter(t => t.length > 0);
      
      turnosList.forEach(turno => {
        const dayTimeMatch = turno.match(/\b(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\s+(\d{1,2})(?:\.(\d{1,2}))?(?:hs|:(\d{2})hs?)?/i);
        if (dayTimeMatch) {
          const dayName = dayTimeMatch[1].toLowerCase();
          const dayNum = dayMap[dayName];
          if (dayNum !== undefined) {
            const hours = parseInt(dayTimeMatch[2], 10);
            let minutes = 0;
            
            if (dayTimeMatch[3]) {
              const decimalPart = parseFloat('0.' + dayTimeMatch[3]);
              minutes = Math.round(decimalPart * 60);
            } else if (dayTimeMatch[4]) {
              minutes = parseInt(dayTimeMatch[4], 10);
            }
            
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
              const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
              foundDays.add(dayNum);
              foundTimes.add(timeStr);
              foundDayTimePairs.push({ day: dayNum, time: timeStr });
            }
          }
        }
      });
    }

    // Eliminar duplicados de dayTimePairs (mismo día y hora)
    const uniqueDayTimePairs = foundDayTimePairs.filter((pair, index, self) => 
      index === self.findIndex(p => p.day === pair.day && p.time === pair.time)
    );

    // Convertir Sets a Arrays y ordenar
    const daysArray = Array.from(foundDays).sort((a, b) => a - b);
    const timesArray = Array.from(foundTimes).sort();

    // NO usar valores por defecto - solo retornar datos reales encontrados
    if (daysArray.length === 0 && timesArray.length === 0) {
      return null; // No se encontraron datos reales
    }

    return {
      days: daysArray,
      times: timesArray,
      dayTimePairs: uniqueDayTimePairs, // Pares día-hora específicos únicos (sin duplicados)
      raw: fullText
    };
  };

  // Ya no necesitamos generar slots de disponibilidad, solo parsear la información

  const fetchAvailability = async () => {
    if (!product) return;

    setLoading(true);
    setError(null);

    try {
      // Simular carga
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Parsear turnos desde detailsHtml
      const parsed = parseDetailsHtml(product.detailsHtml);
      
      if (!parsed) {
        // No se encontraron turnos
        if (product.detailsHtml) {
          // Hay detailsHtml pero no se encontraron turnos - permitir continuar sin turno
          setNoTurnosFound(true);
          setError(null);
        } else {
          // No hay detailsHtml - mostrar error
          setNoTurnosFound(false);
          setError("No hay información de turnos disponible. Por favor, contacta con nosotros.");
        }
      } else {
        // Se encontraron turnos - guardar información parseada
        setParsedTurnos(parsed);
        setNoTurnosFound(false);
      }
    } catch (err) {
      console.error("Error al obtener disponibilidad:", err);
      setError("No se pudo cargar la disponibilidad. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    // Siempre permitir continuar sin necesidad de seleccionar fecha/hora
    // Solo mostrar información de turnos disponibles
    onConfirm(undefined, undefined);
    onClose();
  };

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
            {parsedTurnos && (parsedTurnos.days.length > 0 || parsedTurnos.times.length > 0) && (() => {
              const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
              
              // Si tenemos pares día-hora específicos, mostrarlos de forma más clara y sin duplicados
              if (parsedTurnos.dayTimePairs && parsedTurnos.dayTimePairs.length > 0) {
                // Eliminar duplicados y ordenar
                const uniquePairs = parsedTurnos.dayTimePairs
                  .filter((pair, index, self) => 
                    index === self.findIndex(p => p.day === pair.day && p.time === pair.time)
                  )
                  .sort((a, b) => {
                    if (a.day !== b.day) return a.day - b.day;
                    return a.time.localeCompare(b.time);
                  });
                
                const turnosText = uniquePairs
                  .map(({ day, time }) => `${dayNames[day]} ${time}`)
                  .join(', ');
                return (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Turnos disponibles:</p>
                      <p className="text-gray-700">{turnosText}</p>
                    </div>
                  </div>
                );
              } else {
                // Mostrar días y horarios por separado
                const daysText = parsedTurnos.days.map(d => dayNames[d]).join(', ');
                return (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900">Turnos disponibles:</p>
                      <p className="text-gray-700">
                        {daysText} {parsedTurnos.times.length > 0 && `- ${parsedTurnos.times.join(', ')}`}
                      </p>
                    </div>
                  </div>
                );
              }
            })()}
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
          ) : noTurnosFound ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 mb-2">
                <strong>No se encontraron turnos específicos en los detalles del curso.</strong>
              </p>
              <p className="text-blue-700 text-sm">
                Puedes continuar con la compra y coordinaremos el turno contigo después de la inscripción.
              </p>
            </div>
          ) : parsedTurnos ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Información de turnos:</strong> Los turnos mostrados arriba son los disponibles para este curso. 
                Después de la compra, nos pondremos en contacto contigo para coordinar la fecha y horario final según tu disponibilidad.
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-pink-600 hover:bg-pink-700 text-white"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Continuar al Checkout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvailabilityModal;

