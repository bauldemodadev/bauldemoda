import { NextResponse } from "next/server";
import { api } from "@/lib/api";

interface VentaData {
  success: boolean;
  data: Array<{
    id: string;
    numeroPedido: string;
    estado: string;
    total: number;
    fecha: string;
    fechaEntrega: string;
    medioPago: string;
    productos: Array<{
      id: string;
      nombre: string;
      cantidad: number;
      precio: number;
      unidad: string;
      categoria: string;
      imagen: string;
      alto?: number;
      ancho?: number;
      largo?: number;
      cepilladoAplicado?: boolean;
    }>;
    envio: {
      estado: string;
      direccion: string;
      ciudad: string;
      codigoPostal: string;
      transportista: string;
      fechaEntrega: string;
    };
    cliente: {
      nombre: string;
      telefono: string;
      email: string;
      dni: string;
    };
  }>;
  total: number;
  usuario: {
    email: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { externalReference, orderData, userEmail } = body;

    console.log('📥 Datos recibidos en save-venta:', {
      externalReference,
      userEmail,
      orderData: {
        customerInfo: orderData.customerInfo,
        deliveryInfo: orderData.deliveryInfo,
        items: orderData.items,
        total: orderData.total,
        id: orderData.id
      }
    });

    // Validar datos requeridos
    if (!externalReference || !orderData || !userEmail) {
      return NextResponse.json(
        { error: "Datos requeridos faltantes" },
        { status: 400 }
      );
    }

    // Generar número de pedido único
    const numeroPedido = `VENTA-${Date.now().toString().slice(-6)}`;

    // Obtener items de la orden
    let itemsArray = orderData.items || orderData.data?.items || [];
    
    if (!Array.isArray(itemsArray) || itemsArray.length === 0) {
      return NextResponse.json(
        { error: "Items de la orden no válidos" },
        { status: 400 }
      );
    }
    
    const productos = itemsArray.map((item: any) => ({
      id: item.id || item.productId || "",
      nombre: item.name || item.nombreProducto || "",
      cantidad: item.quantity || item.cantidad || 1,
      precio: item.price || item.precioUnitario || 0,
      unidad: item.subcategory || item.unidad || "Unidad",
      categoria: item.category || item.categoria || "General",
      imagen: item.image || item.srcUrl || item.imagenUrl || "",
      alto: item.alto || 0,
      ancho: item.ancho || 0,
      largo: item.largo || 0,
      cepilladoAplicado: item.cepilladoAplicado || false
    }));

    // Calcular fecha de entrega (1 día después)
    const fechaEntrega = new Date();
    fechaEntrega.setDate(fechaEntrega.getDate() + 1);

    // Preparar datos de la venta completa
    const ventaData: VentaData = {
      success: true,
      data: [
        {
          id: externalReference,
          numeroPedido,
          estado: "confirmado",
          total: orderData.total || itemsArray.reduce((sum, item) => sum + ((item.price || item.precioUnitario || 0) * (item.quantity || item.cantidad || 1)), 0),
          fecha: new Date().toISOString().split('T')[0],
          fechaEntrega: fechaEntrega.toISOString().split('T')[0],
          medioPago: "mercadopago",
          productos,
          envio: {
            estado: "pendiente",
            direccion: orderData.deliveryInfo?.direccion || orderData.deliveryInfo?.address || "",
            ciudad: orderData.deliveryInfo?.ciudad || orderData.deliveryInfo?.city || "",
            codigoPostal: orderData.deliveryInfo?.codigoPostal || orderData.deliveryInfo?.postalCode || "",
            transportista: orderData.deliveryInfo?.metodoEntrega || orderData.deliveryInfo?.deliveryMethod || "camion",
            fechaEntrega: fechaEntrega.toISOString().split('T')[0]
          },
          cliente: {
            nombre: orderData.customerInfo?.nombre || orderData.customerInfo?.fullName || userEmail || "Cliente",
            telefono: orderData.customerInfo?.telefono || orderData.customerInfo?.phone || "",
            email: userEmail,
            dni: orderData.customerInfo?.dni || ""
          }
        }
      ],
      total: 1,
      usuario: {
        email: userEmail
      }
    };

        // Enviar a la API externa
        const externalApiUrl = process.env.NEXT_PUBLIC_API_BASE || 'https://bauldemoda.vercel.app';
        const fullUrl = `${externalApiUrl.replace(/\/+$/, '')}/api/ventas`;
        
        console.log('📤 Enviando a API externa:', {
          url: fullUrl,
          ventaData: {
            cliente: ventaData.data[0].cliente,
            envio: ventaData.data[0].envio,
            productos: ventaData.data[0].productos,
            total: ventaData.data[0].total
          }
        });
        
        const response = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ventaData),
        });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API externa respondió con ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();

    return NextResponse.json({
      success: true,
      message: "Venta guardada correctamente",
      numeroPedido,
      data: responseData
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: "Error al guardar la venta",
        details: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}
