import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrdemInscricaoPorDre } from "./useOrdemInscricaoPorDre";

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

describe("useOrdemInscricaoPorDre", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useOrdemInscricaoPorDre({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa 'Julho/2026' (2026-07) como mês padrão e retorna as 13 DREs", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOrdemInscricaoPorDre({ systemName: "Intranet" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(13);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "Capela do Socorro", value: 15 },
      { label: "Freguesia/Brasilândia", value: 11 },
      { label: "Ipiranga", value: 12 },
      { label: "Butantã", value: 9 },
      { label: "Guaianases", value: 8 },
    ]);
  });

  it("retorna dados para outro mês selecionado", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOrdemInscricaoPorDre({ systemName: "Intranet", month: "2026-03" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(13);
  });

  it("retorna lista vazia para um mês sem dados mockados", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOrdemInscricaoPorDre({ systemName: "Intranet", month: "2099-01" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});
