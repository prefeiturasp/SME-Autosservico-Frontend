import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSolicitacoesDietasEspeciais } from "./useSolicitacoesDietasEspeciais";

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

describe("useSolicitacoesDietasEspeciais", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useSolicitacoesDietasEspeciais({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados para o período 'dia'", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useSolicitacoesDietasEspeciais({ systemName: "SigPAE", period: "dia" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "Total", value: 12, variant: "neutral" },
      { label: "Autorizadas", value: 8, variant: "success" },
      { label: "Aguardando", value: 2, variant: "warning" },
      { label: "Negadas", value: 1, variant: "danger" },
      { label: "Canceladas", value: 1, variant: "muted" },
    ]);
  });

  it.each(["dia", "quinzena", "mes", "trimestre"] as const)(
    "retorna 5 itens para o período '%s'",
    async (period) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useSolicitacoesDietasEspeciais({ systemName: "SigPAE", period }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(5);
    }
  );
});
