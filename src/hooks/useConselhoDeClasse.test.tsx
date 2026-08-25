import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConselhoDeClasse } from "./useConselhoDeClasse";

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

describe("useConselhoDeClasse", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useConselhoDeClasse({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa '2026-2' (2º Bimestre de 2026) como bimestre padrão", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useConselhoDeClasse({ systemName: "SGP" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "Não iniciados", value: 204, variant: "muted" },
      { label: "Em andamento", value: 387, variant: "neutral" },
      { label: "Processado com sucesso", value: 1889, variant: "success" },
    ]);
  });

  it.each(["2025-3", "2025-4", "2026-1", "2026-2"])(
    "retorna 3 itens para o bimestre '%s'",
    async (bimestre) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useConselhoDeClasse({ systemName: "SGP", bimestre }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(3);
    },
  );
});
