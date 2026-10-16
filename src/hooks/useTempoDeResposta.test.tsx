import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTempoDeResposta } from "./useTempoDeResposta";

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

describe("useTempoDeResposta", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useTempoDeResposta({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de tempo de resposta, com tendência e formato em dias", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useTempoDeResposta({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      {
        label: "Tempo médio de resolução",
        value: 6.4,
        variant: "neutral",
        format: "days",
        trend: "above",
        trendLabel: "14% mais rápido nos últimos 30 dias",
      },
      {
        label: "Tempo médio até a primeira tratativa",
        value: 1.2,
        variant: "neutral",
        format: "days",
        trend: "below",
        trendLabel: "2% mais lento nos últimos 30 dias",
      },
    ]);
  });
});
