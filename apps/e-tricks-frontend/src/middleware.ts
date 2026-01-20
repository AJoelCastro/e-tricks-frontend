import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const privateRoutes = [
  '/favoritos(.*)',
  '/carrito(.*)',
  '/direcciones(.*)',
];

const adminRoutes = [
  '/admin(.*)',
];

const isProtectedRoute = createRouteMatcher(privateRoutes);
const isAdminRoute = createRouteMatcher(adminRoutes);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();

  // Proteger rutas privadas (requieren autenticación)
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Proteger rutas de admin con verificación manual
  if (isAdminRoute(req)) {
    if (!userId) {
      // Redirigir a login si no está autenticado
      return redirectToSignIn();
    }

    // Verificar rol admin manualmente
    const userRoles = (sessionClaims?.metadata as { role?: string | string[] })?.role || [];
    const hasAdminRole = Array.isArray(userRoles) 
      ? userRoles.includes('admin')
      : userRoles === 'admin';

    if (!hasAdminRole) {
      // Redirigir a página de acceso denegado
      return NextResponse.redirect(new URL(`/${userRoles}`, req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};