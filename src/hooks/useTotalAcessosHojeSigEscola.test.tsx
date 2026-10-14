import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { TodayAccessResponse } from "@/types/metricas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { useTotalAcessosHojeSigEscola } from "./useTotalAcessosHojeSigEscola";

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

const FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

const KPI: TodayAccessResponse = {
  accessCount: 9,
  trend: "above",
  trendLabel: "113% acima da média dos últimos 30 dias",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useTotalAcessosHojeSigEscola", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useTotalAcessosHojeSigEscola({ systemName: "", filtros: FILTROS }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("devolve o KPI da rota de métricas do SIG-Escola", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ acessosHoje: KPI }),
    } as unknown as Response);
    const { result } = renderHook(
      () => useTotalAcessosHojeSigEscola({ systemName: "SigEscola", filtros: FILTROS }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigescola/metricas");
    expect(result.current.data).toEqual(KPI);
  });
});
