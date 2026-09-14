import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOcorrenciasPorPeriodoLetivo } from "./useOcorrenciasPorPeriodoLetivo";

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

describe("useOcorrenciasPorPeriodoLetivo", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasPorPeriodoLetivo({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 5 linhas mockadas por período letivo", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciasPorPeriodoLetivo({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "1º Bimestre", value: 298 },
      { label: "2º Bimestre", value: 342 },
      { label: "3º Bimestre", value: 386 },
      { label: "4º Bimestre", value: 258 },
      { label: "Geral", value: 1284 },
    ]);
  });
});
