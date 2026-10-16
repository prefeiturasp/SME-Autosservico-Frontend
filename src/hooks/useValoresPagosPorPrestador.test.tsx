import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useValoresPagosPorPrestador } from "./useValoresPagosPorPrestador";

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

describe("useValoresPagosPorPrestador", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useValoresPagosPorPrestador({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 7 linhas mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useValoresPagosPorPrestador({ systemName: "Limpeza" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "Prestador 1", value: 4350 },
      { label: "Prestador 2", value: 3350 },
      { label: "Prestador 3", value: 3000 },
      { label: "Prestador 4", value: 2890 },
      { label: "Prestador 5", value: 1000 },
    ]);
  });
});
