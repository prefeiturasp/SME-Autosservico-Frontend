import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAcompanhamentoFechamento } from "./useAcompanhamentoFechamento";
import type { AcompanhamentoFechamentoResponse } from "@/types/sgpMetricas";

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

const RESPOSTA: AcompanhamentoFechamentoResponse = {
  itens: [{ label: "Não iniciados", value: 8398, variant: "muted", percentage: 23.87 }],
  porDre: [],
};

const okFetch = () =>
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => RESPOSTA,
  } as unknown as Response);

describe("useAcompanhamentoFechamento", () => {
  it("não dispara fetch sem systemName ou sem período", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const semSistema = renderHook(
      () =>
        useAcompanhamentoFechamento({
          systemName: "",
          periodo: "fundamental_medio:2026:0:4",
        }),
      { wrapper: createWrapper() },
    );
    const semPeriodo = renderHook(
      () => useAcompanhamentoFechamento({ systemName: "SGP" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(semSistema.result.current.isFetching).toBe(false));
    await waitFor(() => expect(semPeriodo.result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca Fundamental/Médio sem semestre na query", async () => {
    const fetchSpy = okFetch();

    const { result } = renderHook(
      () =>
        useAcompanhamentoFechamento({
          systemName: "SGP",
          periodo: "fundamental_medio:2026:0:4",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sgp/acompanhamento-fechamento?ano_letivo=2026&bimestre=4&segmento=fundamental_medio",
    );
    expect(result.current.data).toEqual(RESPOSTA);
  });

  it("quebra o período da EJA em segmento, semestre e bimestre", async () => {
    const fetchSpy = okFetch();

    const { result } = renderHook(
      () =>
        useAcompanhamentoFechamento({
          systemName: "SGP",
          periodo: "eja:2026:2:1",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sgp/acompanhamento-fechamento?ano_letivo=2026&bimestre=1&segmento=eja&semestre=2",
    );
  });

  it("vira erro quando a rota responde com falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useAcompanhamentoFechamento({
          systemName: "SGP",
          periodo: "fundamental_medio:2026:0:4",
        }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
