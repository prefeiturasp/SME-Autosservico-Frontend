import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { usePlanoAnualDeAtividades } from "./usePlanoAnualDeAtividades";

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

describe("usePlanoAnualDeAtividades", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        usePlanoAnualDeAtividades({ systemName: "", filtros: BASE_FILTROS }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("cenário baseline (modo período)", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        usePlanoAnualDeAtividades({
          systemName: "SigEscola",
          filtros: BASE_FILTROS,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "PAAs em andamento", value: 318, variant: "neutral" },
      { label: "PAAs finalizados", value: 1204, variant: "success" },
      { label: "PAAs em retificação", value: 42, variant: "warning" },
    ]);
  });

  it("cenário intervalo (todas as DREs/UEs)", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        usePlanoAnualDeAtividades({
          systemName: "SigEscola",
          filtros: { ...BASE_FILTROS, modo: "intervalo" },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0].value).toBe(231);
    expect(result.current.data?.items[2].value).toBe(30);
  });

  it("cenário intervalo + DRE Butantã", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        usePlanoAnualDeAtividades({
          systemName: "SigEscola",
          filtros: { ...BASE_FILTROS, modo: "intervalo", dre: "butanta" },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0].value).toBe(14);
    expect(result.current.data?.items[2].value).toBe(4);
  });

  it("cai no baseline pra uma combinação fora dos 3 cenários conhecidos", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        usePlanoAnualDeAtividades({
          systemName: "SigEscola",
          filtros: { ...BASE_FILTROS, modo: "intervalo", ue: "cemei-morumbi" },
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items[0].value).toBe(318);
  });
});
