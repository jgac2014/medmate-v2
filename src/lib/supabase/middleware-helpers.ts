// Pure helper functions extracted from middleware.ts for testability.
// These have no dependencies on Next.js or Supabase.

// Pages that don't require authentication
const PUBLIC_PAGES = [
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/auth",
  "/politica-de-privacidade",
  "/termos-de-uso",
  "/faq",
  "/funcionalidades",
  "/planos",
  "/seguranca",
];

// Pages that require auth but NOT an active subscription
const AUTH_ONLY_PAGES = ["/bloqueado", "/conta", "/sucesso", "/cancelado", "/consentimento"];

export function isPublicPage(pathname: string): boolean {
  return PUBLIC_PAGES.some((page) =>
    page === "/" ? pathname === "/" : pathname === page || pathname.startsWith(`${page}/`)
  );
}

export function isAuthOnlyPage(pathname: string): boolean {
  return AUTH_ONLY_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );
}

export function hasActiveSubscription(
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
