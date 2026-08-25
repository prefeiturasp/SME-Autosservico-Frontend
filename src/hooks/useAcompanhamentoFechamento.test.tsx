import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAcompanhamentoFechamento } from "./useAcompanhamentoFechamento";

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

describe("useAcompanhamentoFechamento", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useAcompanhamentoFechamento({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa '2026-2' (2º Bimestre de 2026) como bimestre padrão", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useAcompanhamentoFechamento({ systemName: "SGP" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "Não iniciados", value: 8398, variant: "muted" },
      { label: "Processado com sucesso", value: 7530, variant: "success" },
      { label: "Processado com pendências", value: 6853, variant: "warning" },
      { label: "Processado com erro", value: 12398, variant: "danger" },
    ]);
  });

  it.each(["2025-3", "2025-4", "2026-1", "2026-2"])(
    "retorna 4 itens para o bimestre '%s'",
    async (bimestre) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useAcompanhamentoFechamento({ systemName: "SGP", bimestre }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(4);
    },
  );
});
