import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { useAcessoAtivoSigEscola } from "./useAcessoAtivoSigEscola";

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

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useAcessoAtivoSigEscola", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useAcessoAtivoSigEscola({ systemName: "", filtros: BASE_FILTROS }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("cenário baseline (modo período)", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useAcessoAtivoSigEscola({
          systemName: "SigEscola",
          filtros: BASE_FILTROS,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      activeCount: 4645,
      trend: "on-average",
      trendLabel: "Média dos últimos 30 dias",
    });
  });

  it("cenário intervalo (todas as DREs/UEs)", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useAcessoAtivoSigEscola({
          systemName: "SigEscola",
          filtros: { ...BASE_FILTROS, modo: "intervalo" },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.activeCount).toBe(3372);
  });

  it("cenário intervalo + DRE Butantã", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useAcessoAtivoSigEscola({
          systemName: "SigEscola",
          filtros: { ...BASE_FILTROS, modo: "intervalo", dre: "butanta" },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.activeCount).toBe(209);
  });

  it("cai no baseline pra uma combinação fora dos 3 cenários conhecidos", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useAcessoAtivoSigEscola({
          systemName: "SigEscola",
          filtros: { ...BASE_FILTROS, modo: "intervalo", ue: "cemei-morumbi" },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.activeCount).toBe(4645);
  });
});
