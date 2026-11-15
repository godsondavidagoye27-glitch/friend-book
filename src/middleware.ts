import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedPaths = ['/bookings', '/chat', '/profile', '/become-host', '/host-dashboard', '/admin'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const isSuspendedRoute = pathname === '/account/suspended';

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isProtectedRoute && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_suspended, role')
      .eq('id', user.id)
      .maybeSingle();

    if (profile?.is_suspended && !isSuspendedRoute) {
      return NextResponse.redirect(new URL('/account/suspended', request.url));
    }

    if (isAdminRoute && profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/explore', request.url));
    }
  }

  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
