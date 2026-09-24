import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFornecedoresDistribuidores } from "./useFornecedoresDistribuidores";
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

describe("useFornecedoresDistribuidores", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useFornecedoresDistribuidores({ systemName: "" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca no endpoint e retorna os itens", async () => {
    const mockData: StatsCardResponse = {
      items: [
        {
          label: "Total de empresas fornecedoras cadastradas",
          value: 8,
          variant: "neutral",
        },
        {
          label: "Total de empresas fornecedoras ativas",
          value: 5,
          variant: "success",
        },
      ],
    };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () => useFornecedoresDistribuidores({ systemName: "SigPAE" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sigpae/fornecedores-distribuidores"
    );
    expect(result.current.data?.items).toHaveLength(2);
  });
});
