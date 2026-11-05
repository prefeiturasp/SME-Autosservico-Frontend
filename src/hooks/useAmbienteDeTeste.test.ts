import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { ehAmbienteDeTeste, useAmbienteDeTeste } from "./useAmbienteDeTeste";

describe("ehAmbienteDeTeste", () => {
  it.each([
    "qa-autosservico.sme.prefeitura.sp.gov.br",
    "hom-autosservico.sme.prefeitura.sp.gov.br",
    "localhost",
  ])("é ambiente de teste em %s", (hostname) => {
    expect(ehAmbienteDeTeste(hostname)).toBe(true);
  });

  it.each([
    "autosservico.sme.prefeitura.sp.gov.br",
    "sistema-hom-autosservico.sme.prefeitura.sp.gov.br",
  ])("é produção em %s", (hostname) => {
    expect(ehAmbienteDeTeste(hostname)).toBe(false);
  });
});

describe("useAmbienteDeTeste", () => {
  it("lê o domínio da página (localhost no jsdom)", () => {
    const { result } = renderHook(() => useAmbienteDeTeste());

    expect(result.current).toBe(true);
  });
});
