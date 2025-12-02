# Integración de PayPal para Pagos Internacionales

## Resumen

Se ha implementado la detección automática de usuarios internacionales y la conversión de precios a USD. Para completar la integración de PayPal, sigue los pasos a continuación.

## Archivos Creados

1. **`src/lib/utils/countryDetection.ts`** - Detecta si el usuario está fuera de Argentina
2. **`src/lib/utils/currencyConverter.ts`** - Convierte ARS a USD
3. **`src/app/api/exchange-rate/route.ts`** - API para obtener el tipo de cambio
4. **`src/components/checkout/CurrencySelector.tsx`** - Componente UI para selector de moneda

## Configuración Necesaria

### 1. Configurar Variables de Entorno

Agregar a `.env.local`:

```env
# Tipo de cambio USD/ARS (actualizar periódicamente)
USD_EXCHANGE_RATE=1000

# Credenciales de PayPal (obtener de https://developer.paypal.com)
PAYPAL_CLIENT_ID=tu_client_id_aqui
PAYPAL_CLIENT_SECRET=tu_client_secret_aqui
PAYPAL_MODE=sandbox  # cambiar a 'live' en producción
```

### 2. Instalar SDK de PayPal

```bash
npm install @paypal/checkout-server-sdk
```

### 3. Crear Servicio de PayPal

Crear archivo `src/lib/payments/paypal.ts`:

```typescript
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

// Configuración del cliente PayPal
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  if (process.env.PAYPAL_MODE === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  }
  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

export async function createPayPalOrder(amount: number, currency: string, orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: currency,
        value: amount.toFixed(2)
      },
      reference_id: orderId,
      description: `Orden ${orderId} - Baúl de Moda`
    }],
    application_context: {
      brand_name: 'Baúl de Moda',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`
    }
  });

  try {
    const response = await client().execute(request);
    return {
      id: response.result.id,
      status: response.result.status,
      links: response.result.links
    };
  } catch (error) {
    console.error('Error creando orden PayPal:', error);
    throw error;
  }
}

export async function capturePayPalOrder(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client().execute(request);
    return response.result;
  } catch (error) {
    console.error('Error capturando pago PayPal:', error);
    throw error;
  }
}
```

### 4. Crear API Route para PayPal

Crear `src/app/api/paypal/create-order/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/payments/paypal';

export async function POST(request: Request) {
  try {
    const { amount, currency, orderId } = await request.json();

    const paypalOrder = await createPayPalOrder(amount, currency, orderId);

    return NextResponse.json({
      success: true,
      orderId: paypalOrder.id,
      approvalUrl: paypalOrder.links.find((link: any) => link.rel === 'approve')?.href
    });
  } catch (error) {
    console.error('Error creando orden PayPal:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear orden de PayPal' },
      { status: 500 }
    );
  }
}
```

### 5. Modificar el Checkout (StepTwo.tsx)

Agregar PayPal como método de pago cuando el usuario es internacional:

```typescript
// En paymentMethods array, agregar:
{
  id: 'paypal',
  name: 'PayPal',
  description: 'Paga con PayPal (tarjetas internacionales)',
  icon: CreditCardIcon,
  color: 'blue',
}

// Filtrar métodos según país:
const availablePaymentMethods = paymentMethods.filter(method => {
  // Si hay productos digitales, excluir efectivo y transferencia
  if (hasDigital && (method.id === 'cash' || method.id === 'transfer')) {
    return false;
  }
  
  // Si es internacional, solo mostrar PayPal
  if (isInternational && method.id !== 'paypal') {
    return false;
  }
  
  // Si NO es internacional, no mostrar PayPal
  if (!isInternational && method.id === 'paypal') {
    return false;
  }
  
  return true;
});
```

### 6. Webhook de PayPal

Crear `src/app/api/webhooks/paypal/route.ts` para recibir notificaciones de pago.

## Uso del Componente CurrencySelector

En el checkout (`StepTwo.tsx` o donde muestres el total):

```typescript
import CurrencySelector from '@/components/checkout/CurrencySelector';

// En el componente:
const [selectedCurrency, setSelectedCurrency] = useState<'ARS' | 'USD'>('ARS');
const [finalAmount, setFinalAmount] = useState(totalAmount);

<CurrencySelector
  amountARS={totalAmount}
  onCurrencyChange={(currency, amount) => {
    setSelectedCurrency(currency);
    setFinalAmount(amount);
  }}
/>
```

## Flujo Completo

1. **Usuario internacional accede al checkout** → Se detecta automáticamente su país
2. **Se muestra el selector de moneda** → Puede elegir ARS o USD
3. **Selecciona USD** → El precio se convierte automáticamente
4. **Elige PayPal como método de pago** → Es la única opción disponible
5. **Se crea orden en Firestore** → Con currency: 'USD' y amount convertido
6. **Se redirige a PayPal** → Para completar el pago
7. **Webhook confirma el pago** → Se actualiza la orden
8. **Usuario regresa al sitio** → Página de éxito

## Notas Importantes

### Tipo de Cambio

- El tipo de cambio se configura manualmente en `.env.local`
- Se puede integrar con APIs de tipo de cambio real (ej: Dolar Blue API)
- El caché se mantiene por 1 hora para evitar múltiples llamadas

### Testing

- Usar cuenta sandbox de PayPal para pruebas
- PayPal proporciona tarjetas de prueba en https://developer.paypal.com/tools/sandbox/card-testing/

### Seguridad

- Las credenciales de PayPal NUNCA deben exponerse en el cliente
- Todas las operaciones de PayPal deben hacerse desde el servidor (API routes)
- Validar siempre el webhook signature de PayPal

### Alternativa Simple (Sin SDK)

Si prefieres una integración más simple sin instalar el SDK, puedes usar un enlace directo de PayPal:

```typescript
// En lugar de crear una orden completa, redirigir a:
const paypalUrl = `https://www.paypal.com/paypalme/tuusuario/${amountUSD}`;
window.location.href = paypalUrl;
```

**Ventajas:** Muy simple, sin configuración
**Desventajas:** No se integra con tu sistema de órdenes, el usuario debe ingresar el ID manualmente

## Estado Actual

✅ Detección de país implementada
✅ Conversión de moneda implementada
✅ UI para selector de moneda creada
✅ API de tipo de cambio creada
⏳ Integración completa con PayPal (requiere cuenta y credenciales)
⏳ Webhooks de PayPal
⏳ Testing en sandbox

## Recursos

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Node SDK](https://github.com/paypal/Checkout-NodeJS-SDK)
- [PayPal Sandbox Testing](https://developer.paypal.com/tools/sandbox/)

