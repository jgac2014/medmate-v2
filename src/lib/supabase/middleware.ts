import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { consentVersionsMatch } from "@/lib/legal";
import { isPublicPage, isAuthOnlyPage, hasActiveSubscription } from "./middleware-helpers";

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

  // 2. Logged in on login/signup → redirect to /consulta
  if (user && (pathname.startsWith("/login") || pathname.startsWith("/signup"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/consulta";
    return NextResponse.redirect(url);
  }

  // 3. Logged in on auth-only pages (bloqueado, conta, etc.) → allow through
  if (user && isAuthOnlyPage(pathname)) {
    if (pathname === "/consentimento") {
      const { data: consents } = await supabase
        .from("user_consents")
        .select("document_type, version")
        .eq("user_id", user.id)
        .in("document_type", ["terms", "privacy"]);

      if (consentVersionsMatch(consents)) {
        const url = request.nextUrl.clone();
        url.pathname = "/consulta";
        return NextResponse.redirect(url);
      }
    }

    return supabaseResponse;
  }

  // 4. Logged in on protected pages → run consent + subscription checks concurrently
  if (user && !isPublicPage(pathname) && !isAuthOnlyPage(pathname)) {
    const [{ data: consents }, { data: profile }] = await Promise.all([
      supabase
        .from("user_consents")
        .select("document_type, version")
        .eq("user_id", user.id)
        .in("document_type", ["terms", "privacy"]),
      supabase
        .from("users")
        .select("subscription_status, trial_ends_at")
        .eq("id", user.id)
        .single(),
    ]);

    if (!consentVersionsMatch(consents)) {
      const url = request.nextUrl.clone();
      url.pathname = "/consentimento";
      return NextResponse.redirect(url);
    }

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
