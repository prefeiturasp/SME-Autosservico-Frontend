import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOcorrenciasTratadasPorAnalista } from "./useOcorrenciasTratadasPorAnalista";

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

describe("useOcorrenciasTratadasPorAnalista", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasTratadasPorAnalista({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 7 linhas mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasTratadasPorAnalista({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { analista: "Ana Luzia Souza", ocorrenciasTratadas: 180, tempoMedio: "4,8 dias" },
      { analista: "Juliana Prado", ocorrenciasTratadas: 144, tempoMedio: "5,6 dias" },
      { analista: "Vitor Barbosa", ocorrenciasTratadas: 138, tempoMedio: "6,2 dias" },
      { analista: "Tamires Serra", ocorrenciasTratadas: 128, tempoMedio: "7,1 dias" },
      {
        analista: "Pedro Henrique Costa",
        ocorrenciasTratadas: 95,
        tempoMedio: "7,9 dias",
      },
    ]);
  });
});
