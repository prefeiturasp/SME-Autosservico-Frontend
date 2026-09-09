import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOcorrenciasPorUnidadeEducacional } from "./useOcorrenciasPorUnidadeEducacional";

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

describe("useOcorrenciasPorUnidadeEducacional", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasPorUnidadeEducacional({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 7 UEs mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasPorUnidadeEducacional({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "CEI PARC. PAU BRASIL", value: 34 },
      { label: "CEI PARC. JD. ARPOADOR", value: 29 },
      { label: "CEMEI MORUMBI", value: 26 },
      { label: "CEMEI IRAPARÁ", value: 22 },
      { label: "EMEF ADALGIZA SEGURADO DA SILVEIRA PROFA", value: 19 },
    ]);
  });
});
