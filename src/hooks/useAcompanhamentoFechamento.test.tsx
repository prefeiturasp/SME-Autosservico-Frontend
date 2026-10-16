import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAcompanhamentoFechamento } from "./useAcompanhamentoFechamento";
import type { StatItem } from "@/types/metricas";

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

const RESPOSTA: StatItem[] = [
  { label: "Não iniciados", value: 8398, variant: "muted" },
  { label: "Processado com sucesso", value: 7530, variant: "success" },
  { label: "Processado com pendências", value: 6853, variant: "warning" },
  { label: "Processado com erro", value: 12398, variant: "danger" },
];

describe("useAcompanhamentoFechamento", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useAcompanhamentoFechamento({ systemName: "" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("usa o bimestre padrão '2026-2' e busca com ano/bimestre na query", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => RESPOSTA,
    } as unknown as Response);

    const { result } = renderHook(
      () => useAcompanhamentoFechamento({ systemName: "SGP" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sgp/acompanhamento-fechamento?ano_letivo=2026&bimestre=2",
    );
    expect(result.current.data).toEqual(RESPOSTA);
  });

  it("quebra o bimestre selecionado nos parâmetros da rota", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => RESPOSTA,
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useAcompanhamentoFechamento({ systemName: "SGP", bimestre: "2026-1" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sgp/acompanhamento-fechamento?ano_letivo=2026&bimestre=1",
    );
  });
});
