export const CURRENT_TERMS_VERSION = "2026-04-07";
export const CURRENT_PRIVACY_VERSION = "2026-04-07";

export const LEGAL_DOCUMENTS = {
  terms: {
    version: CURRENT_TERMS_VERSION,
    path: "/termos-de-uso",
    label: "Termos de Uso",
  },
  privacy: {
    version: CURRENT_PRIVACY_VERSION,
    path: "/politica-de-privacidade",
    label: "Política de Privacidade",
  },
} as const;

/**
 * Pure isomorphic helper used by both client-side consents.ts and server-side middleware.ts.
 * Centralising here ensures both locations agree on what constitutes "accepted" whenever
 * CURRENT_TERMS_VERSION or CURRENT_PRIVACY_VERSION are bumped.
 */
export function consentVersionsMatch(
  consents: Array<{ document_type: string; version: string }> | null | undefined
): boolean {
  if (!consents || consents.length === 0) return false;

  const hasTerms = consents.some(
    (c) => c.document_type === "terms" && c.version === CURRENT_TERMS_VERSION
  );
  const hasPrivacy = consents.some(
    (c) => c.document_type === "privacy" && c.version === CURRENT_PRIVACY_VERSION
  );

  return hasTerms && hasPrivacy;
}
