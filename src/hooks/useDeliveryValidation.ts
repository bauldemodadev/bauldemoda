import { useEffect, useState } from "react"
import { api } from "@/lib/api"

export interface Location {
  nombre: string
  direccion: string
  lat: number
  lng: number
  radio: number // metros
}

export function useDeliveryValidation() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true)
      try {
        const data = await api.get<{ locations?: Location[] }>(`/settings/general`)
        setLocations(data.locations || [])
      } finally {
        setLoading(false)
      }
    }
    fetchLocations()
  }, [])

  // Fórmula de Haversine para calcular distancia en metros
  function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371e3 // metros
    const rad = Math.PI / 180
    const dLat = (lat2 - lat1) * rad
    const dLng = (lng2 - lng1) * rad
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // Valida si la dirección está dentro de algún radio
  function validateAddress(lat: number, lng: number) {
    for (const loc of locations) {
      const dist = getDistance(lat, lng, loc.lat, loc.lng)
      if (dist <= loc.radio) {
        return { disponible: true, sucursal: loc, distancia: dist }
      }
    }
    return { disponible: false }
  }

  return { locations, loading, validateAddress }
} 