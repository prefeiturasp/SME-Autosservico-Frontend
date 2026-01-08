import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAzureDevOpsBacklog } from "./useAzureDevOpsBacklog";
import type { BacklogResponse } from "@/types/backlog";

// Utilitário para montar um QueryClient limpo por teste
const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,     // evita re-tentativas nos testes
          gcTime: Infinity, // evita coleta entre asserts
        },
      },
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

describe("useAzureDevOpsBacklog", () => {
  it("não faz fetch quando projectName é vazio (enabled = false)", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch");

    const { result } = renderHook(
      () =>
        useAzureDevOpsBacklog({
          endpoint: "/api/azure-devops/backlog",
          keyPrefix: "azure-devops-backlog",
          projectName: "", // <- vazio desabilita
        }),
      { wrapper }
    );

    // Aguarda um microtask para garantir estabilidade
    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    expect(result.current.isFetching).toBe(false);
  });

  it("faz fetch com sucesso com projectName", async () => {
    const wrapper = createWrapper();
    const mockData: BacklogResponse = {
      total_items: 2,
      parents: [
        {
          id: 123,
          title: "Feature: Adicionar funcionalidade X",
          state: "Active",
          work_item_type: "Feature",
          assigned_to: "João Silva",
        },
      ],
      children: [
        {
          id: 124,
          title: "Task: Implementar X",
          state: "New",
          work_item_type: "Task",
          assigned_to: "Maria Santos",
        },
      ],
      metadata: {},
    };

    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

    const { result } = renderHook(
      () =>
        useAzureDevOpsBacklog({
          endpoint: "/api/azure-devops/backlog",
          keyPrefix: "azure-devops-backlog",
          projectName: "SME-Teste",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verifica chamada
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = (fetchSpy.mock.calls[0][0] as string) || "";
    const calledInit = (fetchSpy.mock.calls[0][1] as RequestInit) || {};
    expect(calledUrl).toBe(
      "/api/azure-devops/backlog?project_name=SME-Teste"
    );
    expect(calledInit.cache).toBe("no-store");

    // Verifica dados retornados
    expect(result.current.data).toEqual(mockData);
  });

  it('retorna erro quando res.ok === false (Error("Falha ao buscar backlog"))', async () => {
    const wrapper = createWrapper();

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useAzureDevOpsBacklog({
          endpoint: "/api/azure-devops/backlog",
          keyPrefix: "azure-devops-backlog",
          projectName: "SME-Teste",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Falha ao buscar backlog"
    );
  });

  it("retorna backlog vazio quando não há itens", async () => {
    const wrapper = createWrapper();
    const mockData: BacklogResponse = {
      total_items: 0,
      parents: [],
      children: [],
      metadata: {},
    };

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useAzureDevOpsBacklog({
          endpoint: "/api/azure-devops/backlog",
          keyPrefix: "azure-devops-backlog",
          projectName: "SME-Teste",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(result.current.data?.total_items).toBe(0);
  });
});

