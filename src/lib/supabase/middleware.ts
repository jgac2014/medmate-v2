import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pages that don't require authentication
const PUBLIC_PAGES = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/auth", "/politica-de-privacidade"];

// Pages that require auth but NOT an active subscription
const AUTH_ONLY_PAGES = ["/bloqueado", "/conta", "/sucesso", "/cancelado"];

function isPublicPage(pathname: string) {
  return PUBLIC_PAGES.some((page) =>
    page === "/" ? pathname === "/" : pathname === page || pathname.startsWith(`${page}/`)
  );
}

function isAuthOnlyPage(pathname: string) {
  return AUTH_ONLY_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
}

function hasActiveSubscription(
  status: string | null,
  trialEndsAt: string | null
): boolean {
  if (status === "active") return true;
  if (status === "trial") {
    if (!trialEndsAt) return false;
    return new Date(trialEndsAt) > new Date();
  }
  return false;
}

export async function updateSession(request: NextRequest) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;

  // 1. Not logged in → redirect to /login (except public pages)
  if (!user && !isPublicPage(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Logged in on login/signup → redirect to /consulta (landing stays public for all)
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/consulta";
    return NextResponse.redirect(url);
  }

  // 3. Logged in, on auth-only pages (bloqueado, conta, etc.) → allow through
  if (user && isAuthOnlyPage(pathname)) {
    return supabaseResponse;
  }

  // 4. Logged in, on protected pages → check subscription
  if (user && !isPublicPage(pathname) && !isAuthOnlyPage(pathname)) {
    const { data: profile } = await supabase
      .from("users")
      .select("subscription_status, trial_ends_at")
      .eq("id", user.id)
      .single();

    const status = profile?.subscription_status ?? null;
    const trialEndsAt = profile?.trial_ends_at ?? null;

    if (!hasActiveSubscription(status, trialEndsAt)) {
      const url = request.nextUrl.clone();
      url.pathname = "/bloqueado";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
