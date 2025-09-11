import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useZabbixStatus } from "./useZabbixStatus";

// Tipo de dado retornado (ajuste se seu type mudou de lugar/nome)
type ZabbixStatus = {
  available: boolean;
  incidents_recent: boolean;
  message: string;
  lastIncidentAt?: string;
};

// Utilitário para montar um QueryClient limpo por teste
const createWrapper =
  () => {
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

describe("useZabbixStatus", () => {
  it("não faz fetch quando projectName é vazio (enabled = false)", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch");

    const { result } = renderHook(
      () =>
        useZabbixStatus({
          endpoint: "/api/zabbix/status/producao",
          keyPrefix: "zabbix-status-producao",
          projectName: "", // <- vazio desabilita
        }),
      { wrapper }
    );

    // Aguarda um microtask para garantir estabilidade
    await waitFor(() => {
      // apenas verificamos que NÃO houve chamada a fetch
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    // O hook está "pendente" sem disparar requisição; importante é não ter chamado fetch.
    expect(result.current.isFetching).toBe(false);
  });

  it("faz fetch com sucesso sem host (querystring só com project)", async () => {
    const wrapper = createWrapper();
    const mockData: ZabbixStatus = {
      available: true,
      incidents_recent: false,
      message: "Sem incidentes recentes",
    };

    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

    const { result } = renderHook(
      () =>
        useZabbixStatus({
          endpoint: "/api/zabbix/status/producao",
          keyPrefix: "zabbix-status-producao",
          projectName: "SIG Escola - Frontend",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verifica chamada
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = (fetchSpy.mock.calls[0][0] as string) || "";
    const calledInit = (fetchSpy.mock.calls[0][1] as RequestInit) || {};
    expect(calledUrl).toBe(
      "/api/zabbix/status/producao?project=SIG+Escola+-+Frontend"
    );
    expect(calledInit.cache).toBe("no-store");

    // Verifica dados retornados
    expect(result.current.data).toEqual(mockData);
  });

  it("faz fetch com sucesso com host (querystring com project e host)", async () => {
    const wrapper = createWrapper();
    const mockData: ZabbixStatus = {
      available: true,
      incidents_recent: true,
      message: "Houve incidentes recentes",
      lastIncidentAt: "04/09/2025 10:37",
    };

    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

    const { result } = renderHook(
      () =>
        useZabbixStatus({
          endpoint: "/api/zabbix/status/filas",
          keyPrefix: "zabbix-status-filas",
          projectName: "Projeto Y",
          host: "Zabbix server",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verifica chamada
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = (fetchSpy.mock.calls[0][0] as string) || "";
    expect(calledUrl).toBe(
      "/api/zabbix/status/filas?project=Projeto+Y&host=Zabbix+server"
    );

    // Verifica dados
    expect(result.current.data).toEqual(mockData);
  });

  it('retorna erro quando res.ok === false (Error("Falha ao buscar status"))', async () => {
    const wrapper = createWrapper();

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useZabbixStatus({
          endpoint: "/api/zabbix/status/producao",
          keyPrefix: "zabbix-status-producao",
          projectName: "Projeto Z",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Falha ao buscar status"
    );
  });
});
