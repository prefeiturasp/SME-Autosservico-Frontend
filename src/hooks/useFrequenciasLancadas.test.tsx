import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFrequenciasLancadas } from "./useFrequenciasLancadas";

const createWrapper = () => {
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useFrequenciasLancadas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFrequenciasLancadas({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa '2026-2' (2º Bimestre de 2026) como bimestre padrão", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFrequenciasLancadas({ systemName: "SGP" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      items: [
        { label: "Lançadas", value: 18432, variant: "neutral" },
        { label: "Esperadas", value: 21760, variant: "muted" },
      ],
      progressPercentage: 122.3,
    });
  });

  it.each(["2025-3", "2025-4", "2026-1", "2026-2"])(
    "retorna dados para o bimestre '%s'",
    async (bimestre) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useFrequenciasLancadas({ systemName: "SGP", bimestre }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.items).toHaveLength(2);
      expect(result.current.data?.progressPercentage).toBeGreaterThan(0);
    },
  );
});
