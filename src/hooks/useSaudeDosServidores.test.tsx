/* @vitest-environment jsdom */
import React from "react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ProducaoStatus } from "@/actions/saude-dos-servidores";
import { useFetchSaudeDosServidoresFilas } from "./useSaudeDosServidores";

describe("useFetchSaudeDosServidoresFilas", () => {
  let queryClient: QueryClient;

    beforeEach(() => {
    // ✅ QueryClient “de teste”: sem retries (evita ficar pendurado em erro)
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0, // não precisa, mas ajuda a não acumular cache entre execuções
        },
      },
    });

    vi.restoreAllMocks();
    globalThis.fetch = vi.fn();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("não chama fetch quando projectName vazio (enabled=false)", async () => {
    const r = renderHook(
      () => useFetchSaudeDosServidoresFilas(""),
      { wrapper }
    );
    expect(global.fetch).not.toHaveBeenCalled();
    // estado inicial sem erro
    expect(r.result.current.isError).toBeFalsy();
  });

  it("retorna dados de sucesso", async () => {
    const data: ProducaoStatus = {
      available: true,
      incidents_recent: false,
      message: "Sem incidentes recentes",
    };
    (global.fetch as Mock).mockResolvedValue(
      new Response(JSON.stringify(data), { status: 200 })
    );

    const { result } = renderHook(
      () => useFetchSaudeDosServidoresFilas("PRD - RabbitMQ", "Zabbix server"),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/saude-dos-servidores/filas?"),
      { cache: "no-store" }
    );
  });

  it("propaga erro quando response !ok", async () => {
    (global.fetch as Mock).mockResolvedValue(new Response("ERR", { status: 500 }));

    const { result } = renderHook(
      () => useFetchSaudeDosServidoresFilas("PRD - RabbitMQ"),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
