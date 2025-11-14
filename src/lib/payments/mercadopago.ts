/**
 * Adaptador de Mercado Pago
 * 
 * Centraliza toda la lógica de integración con Mercado Pago.
 * Soporta modo sandbox y producción mediante variables de entorno.
 */

import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

/**
 * Obtiene las credenciales de Mercado Pago según el entorno
 */
function getMercadoPagoConfig() {
  const environment = process.env.MP_ENVIRONMENT || "sandbox";
  const isProduction = environment === "production";

  const publicKey = isProduction
    ? process.env.MP_PUBLIC_KEY_PROD
    : process.env.MP_PUBLIC_KEY_SANDBOX;

  const accessToken = isProduction
    ? process.env.MP_ACCESS_TOKEN_PROD
    : process.env.MP_ACCESS_TOKEN_SANDBOX;

  if (!accessToken) {
    throw new Error(
      `Mercado Pago ${environment} access token no configurado. Verifica las variables de entorno.`
    );
  }

  return {
    accessToken,
    publicKey: publicKey || undefined,
    environment,
    isProduction,
  };
}

/**
 * Inicializa el cliente de Mercado Pago
 */
function getMercadoPagoClient() {
  const config = getMercadoPagoConfig();
  return new MercadoPagoConfig({
    accessToken: config.accessToken,
  });
}

/**
 * Obtiene la URL base del entorno
 */
function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  return "http://localhost:3000";
}

/**
 * Parámetros para crear una preferencia de pago
 */
export interface CreatePreferenceParams {
  items: Array<{
    title: string;
    unit_price: number;
    quantity: number;
  }>;
  payer: {
    email: string;
    name?: string;
    phone?: string;
  };
  orderId: string;
  customerEmail: string;
}

/**
 * Resultado de crear una preferencia
 */
export interface CreatePreferenceResult {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint?: string;
}

/**
 * Crea una preferencia de pago en Mercado Pago
 * 
 * @param params Parámetros de la preferencia
 * @returns ID de la preferencia y URL de pago
 */
export async function createPreference(
  params: CreatePreferenceParams
): Promise<CreatePreferenceResult> {
  try {
    const mp = getMercadoPagoClient();
    const config = getMercadoPagoConfig();
    const baseUrl = getBaseUrl();

    const preference = await new Preference(mp).create({
      body: {
        items: params.items.map((item, index) => ({
          id: `item-${index + 1}`,
          title: item.title,
          unit_price: Number(item.unit_price),
          quantity: Number(item.quantity),
          currency_id: process.env.MP_CURRENCY || "ARS",
        })),
        payer: {
          email: params.payer.email,
          name: params.payer.name,
          phone: params.payer.phone ? { number: params.payer.phone } : undefined,
        },
        back_urls: {
          success: `${baseUrl}/checkout/success`,
          failure: `${baseUrl}/checkout/failure`,
          pending: `${baseUrl}/checkout/pending`,
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        metadata: {
          orderId: params.orderId,
          customerEmail: params.customerEmail,
        },
        statement_descriptor:
          process.env.MP_STATEMENT_DESCRIPTOR || "BAUL DE MODA",
        external_reference: params.orderId,
        auto_return: "approved",
      },
    });

    if (!preference || !preference.id) {
      throw new Error("Error al crear la preferencia de pago");
    }

    // En sandbox, usar sandbox_init_point; en producción, init_point
    const initPoint = config.isProduction
      ? preference.init_point
      : preference.sandbox_init_point || preference.init_point;

    if (!initPoint) {
      throw new Error("No se recibió el punto de inicio del pago");
    }

    return {
      preferenceId: preference.id,
      initPoint,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  } catch (error) {
    console.error("Error creando preferencia de Mercado Pago:", error);
    throw error;
  }
}

/**
 * Obtiene los detalles de un pago por su ID
 * 
 * @param paymentId ID del pago en Mercado Pago
 * @returns Datos del pago
 */
export async function getPaymentById(
  paymentId: string | number
): Promise<any> {
  try {
    const config = getMercadoPagoConfig();
    const mp = getMercadoPagoClient();

    const payment = await new Payment(mp).get({ id: String(paymentId) });

    return payment;
  } catch (error) {
    console.error(`Error obteniendo pago ${paymentId} de Mercado Pago:`, error);
    throw error;
  }
}

/**
 * Obtiene la clave pública de Mercado Pago según el entorno
 * Útil para el frontend si necesita inicializar el SDK de MP
 */
export function getPublicKey(): string | undefined {
  const config = getMercadoPagoConfig();
  return config.publicKey;
}

/**
 * Verifica si estamos en modo producción
 */
export function isProductionMode(): boolean {
  const config = getMercadoPagoConfig();
  return config.isProduction;
}

