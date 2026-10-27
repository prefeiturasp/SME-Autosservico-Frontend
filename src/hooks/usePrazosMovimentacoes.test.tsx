import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePrazosMovimentacoes } from "./usePrazosMovimentacoes";
import {
  GIPE_METRICAS_FIXTURE,
  mockFetchGipe,
} from "./_helpers/gipeMetricas.fixture";

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
  mockFetchGipe();
});

describe("usePrazosMovimentacoes", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePrazosMovimentacoes({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de prazos e movimentações", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePrazosMovimentacoes({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Ocorrências dentro do prazo", value: 903, variant: "neutral" },
      { label: "Ocorrências fora do prazo", value: 98, variant: "danger" },
      {
        label: "Ocorrências sem movimentações há mais de 7 dias",
        value: 47,
        variant: "warning",
      },
      {
        label: "Média de movimentações por ocorrência",
        value: 3.8,
        variant: "neutral",
      },
    ]);
  });
});

describe("usePrazosMovimentacoes com dados reais incompletos", () => {
  it("tira do card os prazos sem fonte (o GIPE não tem SLA)", async () => {
    mockFetchGipe({
      ...GIPE_METRICAS_FIXTURE,
      ocorrencias: {
        ...GIPE_METRICAS_FIXTURE.ocorrencias,
        prazosMovimentacoes: {
          dentroDoPrazo: null,
          foraDoPrazo: null,
          semMovimentacao7Dias: 387,
          mediaMovimentacoesPorOcorrencia: 1.9,
        },
      },
    });
    const { result } = renderHook(
      () => usePrazosMovimentacoes({ systemName: "GIPE" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items.map((i) => [i.label, i.value])).toEqual([
      ["Ocorrências sem movimentações há mais de 7 dias", 387],
      ["Média de movimentações por ocorrência", 1.9],
    ]);
  });
});
