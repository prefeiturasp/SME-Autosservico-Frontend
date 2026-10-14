import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrdemInscricaoPorTipo } from "./useOrdemInscricaoPorTipo";
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

describe("useOrdemInscricaoPorTipo", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(() => useOrdemInscricaoPorTipo({ systemName: "" }), {
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
    const { result } = renderHook(() => useOrdemInscricaoPorTipo({ systemName: "Intranet" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("usa 'dia' como período padrão", async () => {
    const fetchSpy = mockFetchOk(RESPOSTA);
    const { result } = renderHook(() => useOrdemInscricaoPorTipo({ systemName: "Intranet" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/intranet/ordem-inscricao/por-tipo?periodo=dia");
    expect(result.current.data).toEqual(RESPOSTA);
  });

  it.each(["quinzena", "mes", "trimestre"] as const)(
    "repassa o período '%s' na query",
    async (period) => {
      const fetchSpy = mockFetchOk(RESPOSTA);
      const { result } = renderHook(
        () => useOrdemInscricaoPorTipo({ systemName: "Intranet", period }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(fetchSpy).toHaveBeenCalledWith(`/api/intranet/ordem-inscricao/por-tipo?periodo=${period}`);
    },
  );
});
