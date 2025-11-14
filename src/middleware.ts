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

  // Agregar header con pathname para uso en layouts
  if (pathname.startsWith('/admin')) {
    response.headers.set('x-pathname', pathname);
  }

  return response;
}

export const config = {
  matcher: [
    '/shop/product/:path*',
    '/admin/:path*',
  ],
};

