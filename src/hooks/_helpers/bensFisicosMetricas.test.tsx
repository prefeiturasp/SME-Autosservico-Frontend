import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBensFisicosMetricasQuery } from "./bensFisicosMetricas";
import { mockFetchBensFisicos } from "./bensFisicosMetricas.fixture";
import type { BensFisicosMetricasResponse } from "@/types/bensFisicosMetricas";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

const acessoAtivo = (data: BensFisicosMetricasResponse) => data.acessoAtivo;
const baixas = (data: BensFisicosMetricasResponse) => data.baixasFisicas;

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useBensFisicosMetricasQuery", () => {
  it("faz uma só requisição para os cards da seção", async () => {
    const fetchSpy = mockFetchBensFisicos();
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => ({
        acesso: useBensFisicosMetricasQuery("Bens Físicos", acessoAtivo),
        baixas: useBensFisicosMetricasQuery("Bens Físicos", baixas),
      }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.baixas.isSuccess).toBe(true));
    expect(result.current.acesso.data?.activeCount).toBe(4);
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("/api/bens-fisicos/metricas");
  });

  it("não entrega dado quando a rota falha (cache frio no BFF)", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response("{}", { status: 500 }),
    );
    const { result } = renderHook(
      () => useBensFisicosMetricasQuery("Bens Físicos", baixas),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.failureCount).toBeGreaterThan(0));
    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
  });
});
