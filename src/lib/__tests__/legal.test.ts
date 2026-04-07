import { describe, it, expect } from "vitest";
import {
  consentVersionsMatch,
  CURRENT_TERMS_VERSION,
  CURRENT_PRIVACY_VERSION,
} from "../legal";

describe("consentVersionsMatch", () => {
  it("retorna true quando ambos terms e privacy estão na versão correta", () => {
    expect(
      consentVersionsMatch([
        { document_type: "terms", version: CURRENT_TERMS_VERSION },
        { document_type: "privacy", version: CURRENT_PRIVACY_VERSION },
      ])
    ).toBe(true);
  });

  it("retorna false quando só terms está presente", () => {
    expect(
      consentVersionsMatch([
        { document_type: "terms", version: CURRENT_TERMS_VERSION },
      ])
    ).toBe(false);
  });

  it("retorna false quando só privacy está presente", () => {
    expect(
      consentVersionsMatch([
        { document_type: "privacy", version: CURRENT_PRIVACY_VERSION },
      ])
    ).toBe(false);
  });

  it("retorna false para versão desatualizada de terms", () => {
    expect(
      consentVersionsMatch([
        { document_type: "terms", version: "2020-01-01" },
        { document_type: "privacy", version: CURRENT_PRIVACY_VERSION },
      ])
    ).toBe(false);
  });

  it("retorna false para versão desatualizada de privacy", () => {
    expect(
      consentVersionsMatch([
        { document_type: "terms", version: CURRENT_TERMS_VERSION },
        { document_type: "privacy", version: "2020-01-01" },
      ])
    ).toBe(false);
  });

  it("retorna false para array vazio", () => {
    expect(consentVersionsMatch([])).toBe(false);
  });

  it("retorna false para null", () => {
    expect(consentVersionsMatch(null)).toBe(false);
  });

  it("retorna false para undefined", () => {
    expect(consentVersionsMatch(undefined)).toBe(false);
  });

  it("retorna false quando há dois entries de terms (um desatualizado, um atual) mas sem privacy", () => {
    // Array.some() encontra o terms correto mas falta o privacy — deve retornar false
    expect(
      consentVersionsMatch([
        { document_type: "terms", version: "2020-01-01" },
        { document_type: "terms", version: CURRENT_TERMS_VERSION },
      ])
    ).toBe(false);
  });

  it("retorna true quando há entradas extras além das corretas", () => {
    expect(
      consentVersionsMatch([
        { document_type: "terms", version: CURRENT_TERMS_VERSION },
        { document_type: "privacy", version: CURRENT_PRIVACY_VERSION },
        { document_type: "dpa", version: "1.0.0" },
      ])
    ).toBe(true);
  });
});
