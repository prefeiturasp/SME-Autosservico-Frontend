import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { usePrestacaoDeContas } from "./usePrestacaoDeContas";

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
  modo: "intervalo",
  periodo: "",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "108100",
  ue: "all",
};

const BLOCO = {
  destaque: [
    { label: "UEs aptas a prestar contas pelo sistema", value: 102, variant: "neutral" },
    { label: "Devolução ao Tesouro", value: 0, variant: "danger", format: "currency" },
  ],
  items: [
    { label: "PCs enviadas ou em andamento com as DREs", value: 2, variant: "neutral" },
    { label: "Créditos disponíveis para as UEs", value: 12598048, variant: "success", format: "currency" },
    { label: "Despesas registradas pelas UEs", value: 121769.62, variant: "danger", format: "currency" },
    { label: "Demonstrativos financeiros gerados pelas UEs", value: 4, variant: "neutral" },
  ],
};

const resposta = (ok: boolean) =>
  ({ ok, json: async () => ({ prestacaoDeContas: BLOCO }) }) as unknown as Response;

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("usePrestacaoDeContas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => usePrestacaoDeContas({ systemName: "", filtros: FILTROS }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("manda o intervalo e a DRE e devolve o bloco de prestação de contas", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(resposta(true));
    const { result } = renderHook(
      () => usePrestacaoDeContas({ systemName: "SigEscola", filtros: FILTROS }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sigescola/metricas?data_inicio=2026-01-01&data_fim=2026-09-22&dre=108100",
    );
    expect(result.current.data).toEqual(BLOCO);
  });

  it("expõe erro quando a rota falha", async () => {
    // A rota é retentada por ~30 s (cache frio do BFF): avança o relógio.
    vi.useFakeTimers();
    try {
      vi.spyOn(global, "fetch").mockResolvedValue(resposta(false));
      const { result } = renderHook(
        () => usePrestacaoDeContas({ systemName: "SigEscola", filtros: FILTROS }),
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
