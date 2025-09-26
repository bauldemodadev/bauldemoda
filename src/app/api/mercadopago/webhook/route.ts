import { NextResponse } from "next/server";
import { api } from "@/lib/api";

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN!;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { type, data: notificationData } = data;
    if (!type || !notificationData?.id) {
      return NextResponse.json(
        { error: "Notificación inválida" },
        { status: 400 }
      );
    }

    if (type !== "payment") {
      return NextResponse.json(
        { message: "Tipo de notificación no manejado" },
        { status: 200 }
      );
    }

    const paymentId = notificationData.id;
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener datos del pago de Mercado Pago");
    }

    const paymentData = await response.json();

    const orderId = paymentData.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "ID de pedido no encontrado en metadata" },
        { status: 400 }
      );
    }

    let orderStatus = "pending";
    if (paymentData.status === "approved") {
      orderStatus = "success";
    } else if (paymentData.status === "rejected") {
      orderStatus = "failed";
    }

    // Actualizar pedido y registrar transacción en API externa
    await api.post(`/orders/${encodeURIComponent(orderId)}/payment-webhook`, {
      paymentId: paymentData.id,
      paymentStatus: paymentData.status,
      status: orderStatus,
      metadata: paymentData.metadata ?? {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en webhook Mercado Pago:", error);
    return NextResponse.json(
      { error: "Error procesando la notificación" },
      { status: 500 }
    );
  }
}
