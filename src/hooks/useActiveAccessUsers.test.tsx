import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useActiveAccessUsers } from "./useActiveAccessUsers";
import type { ActiveAccessUsersResponse } from "@/types/metricas";

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

describe("useActiveAccessUsers", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useActiveAccessUsers({ systemName: "" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca no endpoint e retorna a resposta", async () => {
    const mockData: ActiveAccessUsersResponse = {
      activeCount: 12,
      trend: "on-average",
      trendLabel: "0 novos nos últimos 30 dias",
    };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () => useActiveAccessUsers({ systemName: "SigPAE" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/usuarios/acesso-ativo");
    expect(result.current.data).toEqual(mockData);
  });

  it("usa mock e não busca para sistemas não integrados", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useActiveAccessUsers({ systemName: "SigEscola" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data?.activeCount).toBe(8398);
  });
});
