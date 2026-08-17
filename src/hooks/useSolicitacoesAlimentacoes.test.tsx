import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSolicitacoesAlimentacoes } from "./useSolicitacoesAlimentacoes";

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

describe("useSolicitacoesAlimentacoes", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useSolicitacoesAlimentacoes({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa 'trimestre' como período padrão", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useSolicitacoesAlimentacoes({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "Total", value: 360, variant: "neutral" },
      { label: "Autorizadas", value: 285, variant: "success" },
      { label: "Aguardando", value: 32, variant: "warning" },
      { label: "Negadas", value: 14, variant: "danger" },
      { label: "Canceladas", value: 8, variant: "muted" },
    ]);
  });

  it.each(["dia", "quinzena", "mes", "trimestre"] as const)(
    "retorna 5 itens para o período '%s'",
    async (period) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useSolicitacoesAlimentacoes({ systemName: "SigPAE", period }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(5);
    }
  );
});
