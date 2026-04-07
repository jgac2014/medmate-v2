import { describe, it, expect, vi, afterEach } from "vitest";
import {
  isPublicPage,
  isAuthOnlyPage,
  hasActiveSubscription,
} from "../middleware-helpers";

afterEach(() => {
  vi.useRealTimers();
});

// ─── isPublicPage ───────────────────────────────────────────────────────────────
describe("isPublicPage", () => {
  it("/ é pública", () => {
    expect(isPublicPage("/")).toBe(true);
  });

  it("/login é pública", () => {
    expect(isPublicPage("/login")).toBe(true);
  });

  it("/planos é pública", () => {
    expect(isPublicPage("/planos")).toBe(true);
  });

  it("/consulta NÃO é pública", () => {
    expect(isPublicPage("/consulta")).toBe(false);
  });

  it("/bloqueado NÃO é pública", () => {
    expect(isPublicPage("/bloqueado")).toBe(false);
  });

  it("/conta NÃO é pública", () => {
    expect(isPublicPage("/conta")).toBe(false);
  });

  it("subpath de página pública também é público: /login/callback", () => {
    expect(isPublicPage("/login/callback")).toBe(true);
  });

  it("/auth/callback é pública (rota OAuth de produção)", () => {
    expect(isPublicPage("/auth/callback")).toBe(true);
  });

  it("/faqsomething NÃO é pública (prefixo sem barra final não conta)", () => {
    expect(isPublicPage("/faqsomething")).toBe(false);
  });
});

// ─── isAuthOnlyPage ─────────────────────────────────────────────────────────────
describe("isAuthOnlyPage", () => {
  it("/bloqueado é auth-only", () => {
    expect(isAuthOnlyPage("/bloqueado")).toBe(true);
  });

  it("/conta é auth-only", () => {
    expect(isAuthOnlyPage("/conta")).toBe(true);
  });

  it("/consentimento é auth-only", () => {
    expect(isAuthOnlyPage("/consentimento")).toBe(true);
  });

  it("/consulta NÃO é auth-only", () => {
    expect(isAuthOnlyPage("/consulta")).toBe(false);
  });

  it("/ NÃO é auth-only", () => {
    expect(isAuthOnlyPage("/")).toBe(false);
  });

  it("/planos NÃO é auth-only", () => {
    expect(isAuthOnlyPage("/planos")).toBe(false);
  });
});

// ─── hasActiveSubscription ──────────────────────────────────────────────────────
describe("hasActiveSubscription", () => {
  it("active → true (independente de trialEndsAt)", () => {
    expect(hasActiveSubscription("active", null)).toBe(true);
    expect(hasActiveSubscription("active", "2020-01-01")).toBe(true);
  });

  it("trial com data futura → true", () => {
    const futureDate = new Date(Date.now() + 7 * 86_400_000).toISOString();
    expect(hasActiveSubscription("trial", futureDate)).toBe(true);
  });

  it("trial com data passada → false", () => {
    const pastDate = new Date(Date.now() - 86_400_000).toISOString();
    expect(hasActiveSubscription("trial", pastDate)).toBe(false);
  });

  it("trial sem data → false", () => {
    expect(hasActiveSubscription("trial", null)).toBe(false);
  });

  it("trial expirando exatamente agora → false (comparação estritamente maior que)", () => {
    const now = new Date("2025-01-01T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    // trialEndsAt === now → new Date(trialEndsAt) > new Date() é false
    expect(hasActiveSubscription("trial", now.toISOString())).toBe(false);
  });

  it("expired → false", () => {
    expect(hasActiveSubscription("expired", null)).toBe(false);
  });

  it("cancelled → false", () => {
    expect(hasActiveSubscription("cancelled", null)).toBe(false);
  });

  it("null → false", () => {
    expect(hasActiveSubscription(null, null)).toBe(false);
  });
});
