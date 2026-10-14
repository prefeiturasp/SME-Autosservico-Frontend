import React from "react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMedicoesIniciais } from "./useMedicoesIniciais";
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useMedicoesIniciais", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch");

    const { result } = renderHook(() => useMedicoesIniciais({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("busca as medições no endpoint e retorna os itens", async () => {
    const mockData: StatsCardResponse = {
      items: [
        { label: "Aguardando envio pelas UEs", value: 16, variant: "warning" },
        { label: "Enviadas pelas unidades", value: 0, variant: "success" },
        { label: "Aprovadas pelas DREs", value: 0, variant: "success" },
        { label: "Aguardando CODAE", value: 0, variant: "warning" },
        { label: "Aprovadas por CODAE", value: 0, variant: "success" },
      ],
    };

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useMedicoesIniciais({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/medicoes-iniciais");
    expect(result.current.data?.items).toHaveLength(5);
    expect(result.current.data?.items[0]).toEqual({
      label: "Aguardando envio pelas UEs",
      value: 16,
      variant: "warning",
    });
  });

  it("lança erro quando a resposta não é ok", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useMedicoesIniciais({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe(
      "Falha ao buscar as medições iniciais"
    );
  });
});
