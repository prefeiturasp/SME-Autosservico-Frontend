import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProdutosHomologados } from "./useProdutosHomologados";
import type { StatsCardResponse } from "@/types/metricas";

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

describe("useProdutosHomologados", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useProdutosHomologados({ systemName: "" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca no endpoint e retorna os itens", async () => {
    const mockData: StatsCardResponse = {
      items: [
        { label: "Total de produtos cadastrados", value: 6, variant: "neutral" },
        { label: "Produtos homologados", value: 0, variant: "success" },
        { label: "Solicitações de homologação no mês", value: 0, variant: "neutral" },
        { label: "Solicitações de homologação no ano", value: 0, variant: "neutral" },
      ],
    };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () => useProdutosHomologados({ systemName: "SigPAE" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/produtos-homologados");
    expect(result.current.data?.items).toHaveLength(4);
    expect(result.current.data?.items[0].label).toBe(
      "Total de produtos cadastrados"
    );
  });
});
