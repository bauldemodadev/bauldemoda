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
import { getProductByIdFromFirestore, getProductsByIdsFromFirestore } from '@/lib/firestore/products';
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
 * OPTIMIZADO: Batch read de productos para evitar N+1 queries
 */
async function calculateOrderTotal(
  items: CheckoutRequest['items'],
  paymentMethod: PaymentMethod,
  productsMap?: Map<string, Product>,
  coursesMap?: Map<string, any>
): Promise<{ items: OrderItem[]; totalAmount: number }> {
  const orderItems: OrderItem[] = [];
  let totalAmount = 0;

  for (const item of items) {
    if (item.type === 'product') {
      // Usar productos del map si están disponibles (batch read)
      const product = productsMap?.get(item.id) || await getProductByIdFromFirestore(item.id);
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
      // Usar cursos del map si están disponibles
      const course = coursesMap?.get(item.id) || await getOnlineCourseByIdFromFirestore(item.id);
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

    // 2. OPTIMIZADO: Batch read de todos los productos y cursos necesarios (eliminar N+1)
    const productIds = body.items
      .filter(item => item.type === 'product')
      .map(item => item.id);
    
    const courseIds = body.items
      .filter(item => item.type === 'onlineCourse')
      .map(item => item.id);

    // Batch read de productos (una sola query)
    const products = productIds.length > 0 
      ? await getProductsByIdsFromFirestore(productIds)
      : [];
    const productsMap = new Map(products.map(p => [p.id, p]));

    // Batch read de cursos online (si hay)
    const coursesMap = new Map<any, any>();
    if (courseIds.length > 0) {
      const { getOnlineCourseByIdFromFirestore } = await import('@/lib/firestore/onlineCourses');
      for (const courseId of courseIds) {
        try {
          const course = await getOnlineCourseByIdFromFirestore(courseId);
          if (course) {
            coursesMap.set(courseId, course);
          }
        } catch (error) {
          console.warn(`Error obteniendo curso ${courseId}:`, error);
        }
      }
    }

    // 3. Calcular total usando productos ya cargados
    const { items: orderItems, totalAmount } = await calculateOrderTotal(
      body.items,
      body.paymentMethod,
      productsMap,
      coursesMap
    );

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: 'No se pudieron procesar los items del carrito' },
        { status: 400 }
      );
    }

    // 4. Determinar orderType, sede y lugar de retiro usando productos ya cargados (sin nuevas lecturas)
    let determinedOrderType: 'curso_presencial' | undefined = undefined;
    let determinedSede: 'almagro' | 'ciudad-jardin' | undefined = undefined;
    const pickupSedes = new Set<'almagro' | 'ciudad-jardin'>();
    const pickupLocationTexts = new Set<string>();
    let hasGifts = false;
    let hasPresentialCourses = false;
    let hasProductsWithPickup = false;

    // Si hay items de tipo onlineCourse, definitivamente NO es presencial
    const hasOnlineCourses = orderItems.some(item => item.type === 'onlineCourse');
    
    if (!hasOnlineCourses) {
      // Verificar cada producto usando el map (sin nuevas lecturas)
      for (const item of orderItems) {
        if (item.type === 'product' && item.productId) {
          const product = productsMap.get(item.productId);
          if (product) {
            const productSede = product.sede;
            const productLocationText = product.locationText;
            const productName = product.name?.toLowerCase() || '';
            
            // Verificar si es un gift
            if (productName.includes('gift') || productName.includes('gift card') || productName.includes('gift baulera')) {
              hasGifts = true;
            }
            
            // Verificar si es curso presencial (sede: almagro o ciudad-jardin)
            if (productSede === 'almagro' || productSede === 'ciudad-jardin') {
              hasPresentialCourses = true;
              pickupSedes.add(productSede);
              
              // Si tiene locationText, agregarlo también
              if (productLocationText && productLocationText.trim()) {
                pickupLocationTexts.add(productLocationText.trim());
              }
            }
            
            // Verificar si tiene locationText (lugar de retiro) aunque no sea presencial
            if (productLocationText && productLocationText.trim()) {
              hasProductsWithPickup = true;
              pickupLocationTexts.add(productLocationText.trim());
              
              // Intentar extraer sede del locationText si no tiene sede definida
              const locationLower = productLocationText.toLowerCase();
              if (locationLower.includes('almagro')) {
                pickupSedes.add('almagro');
              } else if (locationLower.includes('ciudad jardín') || locationLower.includes('ciudad jardin')) {
                pickupSedes.add('ciudad-jardin');
              }
            }
          }
        }
      }
      
      // Determinar orderType y sede
      // Si hay cursos presenciales, es una orden de curso presencial
      if (hasPresentialCourses) {
        determinedOrderType = 'curso_presencial';
        // Si hay una sola sede, usarla; si hay múltiples, usar la primera o la del body
        if (pickupSedes.size === 1) {
          determinedSede = Array.from(pickupSedes)[0];
        } else if (pickupSedes.size > 1) {
          determinedSede = body.sede || Array.from(pickupSedes)[0];
        } else if (body.sede) {
          determinedSede = body.sede;
        }
      } else if (hasProductsWithPickup || hasGifts) {
        // Si hay productos con lugar de retiro o gifts, no es curso presencial
        // pero sí necesita retiro, así que guardamos las sedes encontradas
        if (pickupSedes.size === 1) {
          determinedSede = Array.from(pickupSedes)[0];
        } else if (pickupSedes.size > 1) {
          determinedSede = Array.from(pickupSedes)[0]; // Usar la primera encontrada
        }
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
      // Guardar información de retiro en metadata
      // Incluir: orderType (si es curso presencial), sede, y lugares de retiro
      ...(determinedOrderType || determinedSede || pickupLocationTexts.size > 0 || hasGifts || hasProductsWithPickup ? {
        metadata: {
          ...(determinedOrderType === 'curso_presencial' ? { orderType: 'curso_presencial' } : {}),
          ...(determinedSede ? { sede: determinedSede } : {}),
          ...(pickupLocationTexts.size > 0 ? { 
            pickupLocations: Array.from(pickupLocationTexts),
          } : {}),
          ...(hasGifts ? { hasGifts: true } : {}),
          ...(hasProductsWithPickup ? { hasProductsWithPickup: true } : {}),
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

