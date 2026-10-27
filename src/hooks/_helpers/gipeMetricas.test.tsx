import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGipeFiltros } from "@/states/gipe";
import { gipeRetryDelay, useGipeMetricasQuery } from "./gipeMetricas";
import { mockFetchGipe } from "./gipeMetricas.fixture";

const createWrapper = () => {
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: { queries: { gcTime: Infinity } },
    });
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

const produtividade = (
  dados: Parameters<Parameters<typeof useGipeMetricasQuery>[1]>[0],
) => dados.produtividade;

beforeEach(() => {
  vi.restoreAllMocks();
  useGipeFiltros.setState({ anoLetivo: 2026 });
});

describe("useGipeMetricasQuery", () => {
  it("busca a rota do GIPE com o ano do filtro", async () => {
    const fetchSpy = mockFetchGipe();
    const { result } = renderHook(
      () => useGipeMetricasQuery("GIPE", produtividade),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/gipe/metricas?ano_letivo=2026");

    act(() => useGipeFiltros.getState().setAnoLetivo(2025));

    await waitFor(() =>
      expect(fetchSpy).toHaveBeenLastCalledWith(
        "/api/gipe/metricas?ano_letivo=2025",
      ),
    );
  });

  it("não entrega o ano anterior enquanto o novo ano carrega", async () => {
    const fetchSpy = mockFetchGipe();
    const { result } = renderHook(
      () => useGipeMetricasQuery("GIPE", produtividade),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    fetchSpy.mockImplementation(() => new Promise<Response>(() => {}));
    act(() => useGipeFiltros.getState().setAnoLetivo(2025));

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    expect(result.current.data).toBeUndefined();
  });

  it("não entrega dado quando a rota falha (cache frio no BFF)", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(
      async () => new Response("{}", { status: 500 }),
    );
    const { result } = renderHook(
      () => useGipeMetricasQuery("GIPE", produtividade),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.failureCount).toBeGreaterThan(0));
    expect(result.current.data).toBeUndefined();
    expect(result.current.isSuccess).toBe(false);
  });

  it("espera 1, 2, 4, 8, 8 e 8 s entre as tentativas", () => {
    expect([0, 1, 2, 3, 4, 5].map(gipeRetryDelay)).toEqual([
      1000, 2000, 4000, 8000, 8000, 8000,
    ]);
  });
});

describe("useGipeFiltros", () => {
  it("começa no ano corrente", () => {
    expect(useGipeFiltros.getInitialState().anoLetivo).toBe(
      new Date().getFullYear(),
    );
  });
});
