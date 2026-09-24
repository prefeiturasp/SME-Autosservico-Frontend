import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCronogramasEntregas } from "./useCronogramasEntregas";
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

describe("useCronogramasEntregas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useCronogramasEntregas({ systemName: "" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca no endpoint e retorna os itens", async () => {
    const mockData: StatsCardResponse = {
      items: [
        { label: "Aguardando", value: 2, variant: "warning" },
        { label: "Enviadas", value: 3, variant: "success" },
        { label: "Aprovadas", value: 1, variant: "success" },
      ],
    };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () => useCronogramasEntregas({ systemName: "SigPAE" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/cronogramas-entregas");
    expect(result.current.data?.items).toHaveLength(3);
  });
});
