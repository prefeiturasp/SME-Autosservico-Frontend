import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOcorrenciasPorPrestador } from "./useOcorrenciasPorPrestador";

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

describe("useOcorrenciasPorPrestador", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasPorPrestador({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 7 linhas mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasPorPrestador({ systemName: "Limpeza" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "Prestador 1", value: 42 },
      { label: "Prestador 2", value: 32 },
      { label: "Prestador 3", value: 28 },
      { label: "Prestador 4", value: 25 },
      { label: "Prestador 5", value: 19 },
    ]);
  });
});
