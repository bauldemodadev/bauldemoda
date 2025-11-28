/**
 * API Route: Checkout
 * POST /api/checkout
 * 
 * Crea una orden en Firestore y maneja el flujo de pago según el método seleccionado.
 * Según FASE 7: sin envíos, solo retiro en sucursal.
 */

import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { createOrder, getOrderById, updateOrder } from '@/lib/firestore/orders';
import { upsertCustomer, updateCustomerStats, enrollCustomerInCourse } from '@/lib/firestore/customers';
import { createPreference } from '@/lib/payments/mercadopago';
import { getProductByIdFromFirestore } from '@/lib/firestore/products';
import { getOnlineCourseByIdFromFirestore } from '@/lib/firestore/onlineCourses';
import { Timestamp } from 'firebase-admin/firestore';
import type { Order, OrderItem, PaymentMethod } from '@/types/firestore/order';
import type { Product } from '@/types/product';

const USE_FIRESTORE = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

interface CheckoutRequest {
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    type: 'product' | 'onlineCourse';
    id: string;
    quantity: number;
  }>;
  paymentMethod: PaymentMethod;
  // Información adicional para cursos presenciales
  orderType?: 'curso_presencial';
  sede?: 'almagro' | 'ciudad-jardin';
}

/**
 * Calcula el precio de un producto según el método de pago
 */
function getProductPriceByMethod(product: Product, method: PaymentMethod): number {
  if (method === 'cash') {
    // Precio en efectivo
    return product.cashPrice ?? product.basePrice ?? product.price ?? 0;
  } else {
    // Precio para otros medios (MP, transferencia, etc.)
    return product.otherMethodsPrice ?? product.basePrice ?? product.price ?? 0;
  }
}

/**
 * Calcula el total de la orden según el método de pago
 */
async function calculateOrderTotal(
  items: CheckoutRequest['items'],
  paymentMethod: PaymentMethod
): Promise<{ items: OrderItem[]; totalAmount: number }> {
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of items) {
    if (item.type === 'product') {
      const product = await getProductByIdFromFirestore(item.id);
      if (!product) {
        console.warn(`Producto ${item.id} no encontrado, saltando...`);
        continue;
      }

      const unitPrice = getProductPriceByMethod(product, paymentMethod);
      const total = unitPrice * item.quantity;

      // Obtener la URL de la imagen del producto
      const imageUrl = product.images?.[0] || product.srcUrl || undefined;

      orderItems.push({
        type: 'product',
        productId: item.id,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        total,
        imageUrl,
      });

      totalAmount += total;
    } else if (item.type === 'onlineCourse') {
      const course = await getOnlineCourseByIdFromFirestore(item.id);
      if (!course) {
        console.warn(`Curso online ${item.id} no encontrado, saltando...`);
        continue;
      }

      // Los cursos online pueden tener un precio asociado o venir de un producto relacionado
      // Por ahora, usar un precio base (se puede extender después)
      const unitPrice = 0; // TODO: Agregar campo de precio a OnlineCourse si es necesario
      const total = unitPrice * item.quantity;

      orderItems.push({
        type: 'onlineCourse',
        courseId: item.id,
        name: course.title,
        quantity: item.quantity,
        unitPrice,
        total,
      });

      totalAmount += total;
    }
  }

  return { items: orderItems, totalAmount };
}

export async function POST(request: Request) {
  try {
    if (!USE_FIRESTORE) {
      return NextResponse.json(
        { error: 'Firestore no está habilitado. Configura NEXT_PUBLIC_USE_FIRESTORE=true' },
        { status: 400 }
      );
    }

    const body: CheckoutRequest = await request.json();

    // Validar datos requeridos
    if (!body.customer || !body.items || !body.paymentMethod) {
      return NextResponse.json(
        { error: 'Datos incompletos: se requiere customer, items y paymentMethod' },
        { status: 400 }
      );
    }

    if (!body.items.length) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Validar método de pago
    const validPaymentMethods: PaymentMethod[] = ['mp', 'cash', 'transfer', 'other'];
    if (!validPaymentMethods.includes(body.paymentMethod)) {
      return NextResponse.json(
        { error: `Método de pago inválido. Debe ser uno de: ${validPaymentMethods.join(', ')}` },
        { status: 400 }
      );
    }

    // 1. Crear o actualizar cliente
    const customer = await upsertCustomer({
      email: body.customer.email,
      name: body.customer.name,
      phone: body.customer.phone,
    });

    // 2. Calcular total según método de pago
    const { items: orderItems, totalAmount } = await calculateOrderTotal(
      body.items,
      body.paymentMethod
    );

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: 'No se pudieron procesar los items del carrito' },
        { status: 400 }
      );
    }

    // 3. Determinar orderType y sede basándose en los productos REALES del carrito
    // NO confiar solo en body.orderType y body.sede que pueden venir incorrectos
    let determinedOrderType: 'curso_presencial' | undefined = undefined;
    let determinedSede: 'almagro' | 'ciudad-jardin' | undefined = undefined;
    
    // Verificar cada item para determinar si todos son cursos presenciales
    const allItemsArePresential = orderItems.every(item => {
      if (item.type === 'onlineCourse') {
        return false; // Los cursos online nunca son presenciales
      }
      
      // Para productos, necesitamos obtener el producto completo para verificar su sede
      // Por ahora, verificamos si hay algún item que sea online
      return true; // Asumimos que es producto, lo verificaremos después
    });

    // Si hay items de tipo onlineCourse, definitivamente NO es presencial
    const hasOnlineCourses = orderItems.some(item => item.type === 'onlineCourse');
    
    if (!hasOnlineCourses && allItemsArePresential) {
      // Verificar los productos reales para determinar sede
      const presentialSedes = new Set<'almagro' | 'ciudad-jardin'>();
      
      for (const item of orderItems) {
        if (item.type === 'product' && item.productId) {
          try {
            const product = await getProductByIdFromFirestore(item.productId);
            if (product) {
              const productSede = product.sede;
              // Solo considerar presencial si la sede es almagro o ciudad-jardin
              // NO considerar online, mixto o null como presencial
              if (productSede === 'almagro' || productSede === 'ciudad-jardin') {
                presentialSedes.add(productSede);
              } else {
                // Si algún producto NO es presencial, no es una orden presencial
                determinedOrderType = undefined;
                determinedSede = undefined;
                break;
              }
            }
          } catch (error) {
            console.warn(`Error obteniendo producto ${item.productId} para verificar sede:`, error);
          }
        }
      }
      
      // Solo establecer como presencial si TODOS los productos son presenciales
      // y tienen la misma sede (o al menos una sede válida)
      if (presentialSedes.size > 0 && presentialSedes.size <= 1) {
        determinedOrderType = 'curso_presencial';
        determinedSede = Array.from(presentialSedes)[0];
      } else if (presentialSedes.size > 1) {
        // Si hay múltiples sedes, usar la primera o la que vino en el body como fallback
        determinedOrderType = 'curso_presencial';
        determinedSede = body.sede || Array.from(presentialSedes)[0];
      }
    }

    // 4. Crear orden en Firestore
    const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: body.paymentMethod,
      customerId: customer.id,
      customerSnapshot: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
      },
      items: orderItems,
      totalAmount,
      currency: 'ARS',
      // Guardar información de sede SOLO si realmente es un curso presencial
      // (determinado por los productos reales, no por el body)
      ...(determinedOrderType === 'curso_presencial' && determinedSede ? {
        metadata: {
          orderType: 'curso_presencial',
          sede: determinedSede,
        },
      } : {}),
    };

    const orderId = await createOrder(orderData);

    // 5. Manejar según método de pago
    if (body.paymentMethod === 'mp') {
      // Crear preferencia de Mercado Pago
      // IMPORTANTE: Si es un curso presencial, usar la cuenta de MP según la sede
      try {
        const preference = await createPreference({
          items: orderItems.map((item) => ({
            title: item.name,
            unit_price: item.unitPrice,
            quantity: item.quantity,
          })),
          payer: {
            email: body.customer.email,
            name: body.customer.name,
            phone: body.customer.phone,
          },
          orderId,
          customerEmail: body.customer.email,
          // Pasar la sede para usar la cuenta de MP correcta
          // Usar la sede determinada de los productos reales, no la del body
          sede: determinedSede || null,
        });

        // Actualizar orden con datos de MP
        await updateOrder(orderId, {
          mpPreferenceId: preference.preferenceId,
          externalReference: orderId,
        });

        return NextResponse.json({
          success: true,
          orderId,
          paymentUrl: preference.initPoint,
          preferenceId: preference.preferenceId,
        });
      } catch (error) {
        console.error('Error creando preferencia de Mercado Pago:', error);
        return NextResponse.json(
          {
            error: 'Error al crear la preferencia de pago',
            details: error instanceof Error ? error.message : String(error),
          },
          { status: 500 }
        );
      }
    } else {
      // Efectivo o transferencia: no crear preferencia MP
      // Retornar datos de la orden e instrucciones de retiro
      return NextResponse.json({
        success: true,
        orderId,
        order: {
          id: orderId,
          totalAmount,
          paymentMethod: body.paymentMethod,
          instructions: {
            type: body.paymentMethod === 'cash' ? 'retiro_efectivo' : 'retiro_transferencia',
            message: body.paymentMethod === 'cash'
              ? 'Debes pagar en efectivo al retirar en la sucursal. La orden quedará reservada por 48 horas.'
              : 'Debes realizar la transferencia y luego retirar en la sucursal. La orden quedará reservada por 48 horas.',
            pickupLocation: 'Sede Ciudad Jardín o Almagro (según corresponda)',
          },
        },
      });
    }
  } catch (error) {
    console.error('Error en checkout:', error);
    return NextResponse.json(
      {
        error: 'Error al procesar el checkout',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

