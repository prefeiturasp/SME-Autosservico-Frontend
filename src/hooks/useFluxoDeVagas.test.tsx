import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFluxoDeVagas } from "./useFluxoDeVagas";

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

describe("useFluxoDeVagas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useFluxoDeVagas({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de fluxo de vagas", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFluxoDeVagas({ systemName: "Sigla" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Vagas importadas", value: 2150, variant: "neutral" },
      { label: "Vagas disponíveis", value: 1884, variant: "success" },
      { label: "Vagas preenchidas", value: 1640, variant: "success" },
      { label: "Vagas remanescentes", value: 220, variant: "warning" },
    ]);
  });
});
