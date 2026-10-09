import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
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

const FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

const BLOCO = {
  items: [
    { label: "PAAs em andamento", value: 83, variant: "neutral" },
    { label: "PAAs finalizados", value: 35, variant: "success" },
    { label: "PAAs em retificação", value: 46, variant: "warning" },
  ],
};

const resposta = (ok: boolean) =>
  ({ ok, json: async () => ({ planoAnual: BLOCO }) }) as unknown as Response;

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("usePlanoAnualDeAtividades", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => usePlanoAnualDeAtividades({ systemName: "", filtros: FILTROS }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("devolve o bloco do PAA vindo da rota do SIG-Escola", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(resposta(true));
    const { result } = renderHook(
      () =>
        usePlanoAnualDeAtividades({ systemName: "SigEscola", filtros: FILTROS }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigescola/metricas");
    expect(result.current.data).toEqual(BLOCO);
  });

  it("expõe erro quando a rota falha", async () => {
    // A rota é retentada por ~30 s (cache frio do BFF): avança o relógio.
    vi.useFakeTimers();
    try {
      vi.spyOn(global, "fetch").mockResolvedValue(resposta(false));
      const { result } = renderHook(
        () =>
          usePlanoAnualDeAtividades({ systemName: "SigEscola", filtros: FILTROS }),
        { wrapper: createWrapper() },
      );

      await act(async () => {
        await vi.advanceTimersByTimeAsync(32_000);
      });

      expect(result.current.isError).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
