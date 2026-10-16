import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProvas } from "./useProvas";
import type { ProvasResponse } from "@/types/metricas";

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

const RESPOSTA: ProvasResponse = {
  items: [
    { label: "Total de provas", value: 8398, variant: "neutral" },
    { label: "Provas iniciadas hoje", value: 7530, variant: "muted" },
    { label: "Provas não finalizadas", value: 1853, variant: "warning" },
    { label: "Provas finalizadas", value: 6398, variant: "success" },
  ],
  progressPercentage: 76.2,
};

describe("useProvas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(() => useProvas({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("usa o bimestre padrão '2026-2' e busca na rota do SERAp", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => RESPOSTA,
    } as unknown as Response);

    const { result } = renderHook(() => useProvas({ systemName: "Serap" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/serap/provas?ano_letivo=2026&bimestre=2",
    );
    expect(result.current.data).toEqual(RESPOSTA);
  });

  it("quebra o bimestre selecionado nos parâmetros da rota", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => RESPOSTA,
    } as unknown as Response);

    const { result } = renderHook(
      () => useProvas({ systemName: "Serap", bimestre: "2025-3" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/serap/provas?ano_letivo=2025&bimestre=3",
    );
  });

  it("expõe erro quando a rota falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const { result } = renderHook(() => useProvas({ systemName: "Serap" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
