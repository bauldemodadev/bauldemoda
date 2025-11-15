import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Aplicar no-cache a todas las rutas de productos
  if (pathname.startsWith('/shop/product/')) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Agregar header con pathname para uso en layouts y desactivar caché para rutas admin
  if (pathname.startsWith('/admin')) {
    response.headers.set('x-pathname', pathname);
    // Desactivar caché para rutas admin para evitar problemas de autenticación
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Verificar autenticación básica: si no es la página de login y no hay cookie de autenticación, redirigir
    // Esta verificación es solo para evitar la página en blanco, la verificación real del token se hace en el layout
    if (pathname !== '/admin/login' && !pathname.startsWith('/admin/login')) {
      const authToken = request.cookies.get('firebase-auth-token');
      
      // Si no hay cookie, redirigir inmediatamente a login (esto evita la página en blanco)
      if (!authToken || !authToken.value) {
        const loginUrl = new URL('/admin/login', request.url);
        // Preservar el parámetro de redirección si se necesita
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/shop/product/:path*',
    '/admin/:path*',
  ],
};

