import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConvocacoesPorConcurso } from "./useConvocacoesPorConcurso";

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

describe("useConvocacoesPorConcurso", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useConvocacoesPorConcurso({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 7 linhas mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useConvocacoesPorConcurso({ systemName: "Sigla" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "PROF.ED.INF.E.ENS.FUND.I", value: 23 },
      { label: "AUXILIAR TÉCNICO DE EDUCAÇÃO", value: 16 },
      { label: "COORDENADOR PEDAGÓGICO", value: 11 },
      { label: "SUPERVISOR ESCOLAR", value: 5 },
      { label: "DIRETOR ESCOLAR", value: 3 },
    ]);
  });
});
