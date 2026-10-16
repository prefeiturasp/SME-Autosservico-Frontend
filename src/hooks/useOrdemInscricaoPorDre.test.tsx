import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrdemInscricaoPorDre } from "./useOrdemInscricaoPorDre";
import type { TableRow } from "@/types/metricas";

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

const mockFetchOk = (body: unknown) =>
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => body,
  } as unknown as Response);

beforeEach(() => {
  vi.restoreAllMocks();
});

const RESPOSTA: TableRow[] = [
  { label: "Servidores", value: 39 },
  { label: "Estagiários", value: 27 },
];

describe("useOrdemInscricaoPorDre", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(() => useOrdemInscricaoPorDre({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("entra em erro quando a rota responde com falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
    } as unknown as Response);
    const { result } = renderHook(() => useOrdemInscricaoPorDre({ systemName: "Intranet" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("usa o mês padrão '2026-07' na query", async () => {
    const fetchSpy = mockFetchOk(RESPOSTA);
    const { result } = renderHook(
      () => useOrdemInscricaoPorDre({ systemName: "Intranet" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/intranet/ordem-inscricao/por-dre?mes=2026-07",
    );
    expect(result.current.data).toEqual(RESPOSTA);
  });

  it("repassa o mês selecionado na query", async () => {
    const fetchSpy = mockFetchOk(RESPOSTA);
    const { result } = renderHook(
      () => useOrdemInscricaoPorDre({ systemName: "Intranet", month: "2026-03" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/intranet/ordem-inscricao/por-dre?mes=2026-03",
    );
  });
});
