"use client";

import { useCallback, useEffect, useState } from "react";
import { auth } from "@/lib/firebase/client";
import { api } from "@/lib/api";

export interface PerfilCliente {
	uid: string;
	email: string;
	nombre: string;
	telefono: string;
	dni: string;
	cuit?: string;
	direccion?: string;
	localidad?: string;
	partido?: string;
	codigoPostal?: string;
	barrio?: string;
	area?: string;
	lote?: string;
	lat?: number | null;
	lng?: number | null;
	esClienteViejo?: boolean;
	origen?: string;
	creadoEn?: string;
	actualizadoEn?: string;
}

export async function obtenerPerfilCliente(): Promise<PerfilCliente | null> {
	if (!auth || !auth.currentUser) return null;
	const token = await auth.currentUser.getIdToken();
	const email = auth.currentUser.email;
	if (!email) return null;
	
	console.log("🔍 Hook: Iniciando obtención de perfil del cliente...");
	console.log("📧 Email del usuario:", email);
	
	try {
		const response = await api.get<{success: boolean, data: PerfilCliente}>(`/users/${encodeURIComponent(email)}/profiles`, { withAuthToken: token });
		
		console.log("📡 Hook: Respuesta completa de la API:", response);
		console.log("📊 Hook: Tipo de respuesta:", typeof response);
		console.log("🔑 Hook: Propiedades de la respuesta:", Object.keys(response || {}));
		
		// La API devuelve { success: true, data: {...} }
		if (response && response.success && response.data) {
			console.log("✅ Hook: Respuesta exitosa con datos:", response.data);
			// Mapear Customer de Firestore a PerfilCliente
			const customer = response.data as any;
			return {
				uid: customer.uid || customer.id || '',
				email: customer.email || email,
				nombre: customer.name || customer.nombre || '',
				telefono: customer.phone || customer.telefono || '',
				dni: customer.dni || customer.dni || '',
				cuit: customer.cuit,
				direccion: customer.direccion,
				localidad: customer.localidad,
				partido: customer.partido,
				codigoPostal: customer.codigoPostal,
				barrio: customer.barrio,
				area: customer.area,
				lote: customer.lote,
				lat: customer.lat,
				lng: customer.lng,
				esClienteViejo: customer.esClienteViejo,
				origen: customer.origen,
				creadoEn: customer.createdAt,
				actualizadoEn: customer.updatedAt,
			} as PerfilCliente;
		}
		
		console.log("❌ Hook: Respuesta sin datos o fallida:", response);
		return null;
	} catch (error) {
		console.error('❌ Hook: Error obteniendo perfil del cliente:', error);
		return null;
	}
}

export function useObtenerPerfilCliente() {
	const [perfil, setPerfil] = useState<PerfilCliente | null>(null);
	const [cargando, setCargando] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const refetch = useCallback(async () => {
		try {
			setCargando(true);
			setError(null);
			const p = await obtenerPerfilCliente();
			setPerfil(p);
		} catch (err) {
			console.error('Error en useObtenerPerfilCliente:', err);
			setError(err as Error);
			setPerfil(null);
		} finally {
			setCargando(false);
		}
	}, []);

	useEffect(() => {
		void refetch();
	}, [refetch]);

	return { perfil, cargando, error, refetch } as const;
}


