import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import {
  sigEscolaQueryString,
  sigEscolaRetryDelay,
  useSigEscolaMetricas,
  useSigEscolaOpcoes,
} from "./sigEscolaMetricasQuery";

const BASE: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

beforeEach(() => {
  vi.restoreAllMocks();
});

const OPCOES = { periodo: "2026.3", periodos: ["2026.3"], unidades: [] };
const PAA = { items: [] };
const DADOS = { planoAnual: PAA, opcoes: OPCOES };

const ok = (dados: unknown) =>
  ({ ok: true, json: async () => dados }) as unknown as Response;
const falha = () => ({ ok: false }) as unknown as Response;

const criarWrapper = () => {
  // Sem retry no client: o que vale é a política da própria consulta.
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return { client, Wrapper };
};

const avancar = (ms: number) =>
  act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });

describe("sigEscolaQueryString", () => {
  it.each([
    ["período corrente", BASE, ""],
    ["período escolhido", { ...BASE, periodo: "2026.2" }, "periodo=2026.2"],
    [
      "intervalo de datas ignora o período",
      { ...BASE, modo: "intervalo" as const, periodo: "2026.2" },
      "data_inicio=2026-01-01&data_fim=2026-09-22",
    ],
    ["DRE", { ...BASE, dre: "108100" }, "dre=108100"],
    [
      "DRE e UE",
      { ...BASE, dre: "108100", ue: "019715" },
      "dre=108100&ue=019715",
    ],
  ])("%s", (_nome, filtros, esperado) => {
    expect(sigEscolaQueryString(filtros)).toBe(esperado);
  });
});

describe("useSigEscolaMetricas", () => {
  it("faz uma só requisição para vários hooks com os mesmos filtros", async () => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });
    const Wrapper = ({ children }: { readonly children: React.ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        planoAnual: { items: [] },
        opcoes: { periodo: "2026.3", periodos: ["2026.3"], unidades: [] },
      }),
    } as unknown as Response);
    const opcoes = { systemName: "SigEscola", filtros: { ...BASE, dre: "108100" } };

    const { result } = renderHook(
      () => ({
        paa: useSigEscolaMetricas(opcoes, (d) => d.planoAnual),
        filtros: useSigEscolaMetricas(opcoes, (d) => d.opcoes),
      }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.filtros.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigescola/metricas?dre=108100");
    expect(result.current.filtros.data?.periodo).toBe("2026.3");
    expect(result.current.paa.data).toEqual({ items: [] });
  });
});

describe("intervalo de datas", () => {
  const consultar = (dataInicio: string, dataFim: string) => {
    const { Wrapper } = criarWrapper();
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(ok(DADOS));
    const filtros = { ...BASE, modo: "intervalo" as const, dataInicio, dataFim };
    const hook = renderHook(
      () =>
        useSigEscolaMetricas({ systemName: "SigEscola", filtros }, (d) => d.opcoes),
      { wrapper: Wrapper },
    );
    return { fetchSpy, ...hook };
  };

  it.each([
    ["sem data inicial", "", "2026-09-22"],
    ["sem data final", "2026-01-01", ""],
    ["invertido", "2026-09-22", "2026-01-01"],
  ])("não consulta o intervalo %s", async (_nome, inicio, fim) => {
    const { fetchSpy, result } = consultar(inicio, fim);

    // Tempo real para a consulta, se estivesse habilitada, chegar ao fetch.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 20));
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.fetchStatus).toBe("idle");
  });

  it.each([
    ["datas distintas", "2026-01-01", "2026-09-22"],
    ["mesmo dia", "2026-09-22", "2026-09-22"],
  ])("consulta o intervalo válido (%s)", async (_nome, inicio, fim) => {
    const { fetchSpy, result } = consultar(inicio, fim);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchSpy).toHaveBeenCalledWith(
      `/api/sigescola/metricas?data_inicio=${inicio}&data_fim=${fim}`,
    );
  });

  it("fora do modo intervalo, datas incompletas não bloqueiam a consulta", async () => {
    const { Wrapper } = criarWrapper();
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(ok(DADOS));
    const filtros = { ...BASE, dataInicio: "", dataFim: "" };

    renderHook(
      () => useSigEscolaMetricas({ systemName: "SigEscola", filtros }, (d) => d.opcoes),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1));
  });
});

describe("política de retry", () => {
  it("espera 1, 2, 4, 8, 8 e 8 s entre as tentativas", () => {
    expect([0, 1, 2, 3, 4, 5].map(sigEscolaRetryDelay)).toEqual([
      1000, 2000, 4000, 8000, 8000, 8000,
    ]);
  });

  it("refaz a chamada enquanto a rota responde 500 (cobre ~30 s) e depois desiste", async () => {
    vi.useFakeTimers();
    try {
      const { Wrapper } = criarWrapper();
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(falha());
      const filtros = { systemName: "SigEscola", filtros: BASE };

      const { result } = renderHook(
        () => useSigEscolaMetricas(filtros, (d) => d.opcoes),
        { wrapper: Wrapper },
      );

      await avancar(30_000);
      expect(fetchSpy).toHaveBeenCalledTimes(6);
      expect(result.current.isError).toBe(false);

      await avancar(1_100);
      expect(fetchSpy).toHaveBeenCalledTimes(7);
      expect(result.current.isError).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("devolve os dados quando uma retentativa dá certo", async () => {
    vi.useFakeTimers();
    try {
      const { Wrapper } = criarWrapper();
      const fetchSpy = vi
        .spyOn(global, "fetch")
        .mockResolvedValueOnce(falha())
        .mockResolvedValueOnce(falha())
        .mockResolvedValue(ok(DADOS));

      const { result } = renderHook(
        () =>
          useSigEscolaMetricas(
            { systemName: "SigEscola", filtros: BASE },
            (d) => d.opcoes,
          ),
        { wrapper: Wrapper },
      );

      await avancar(3_000);

      expect(fetchSpy).toHaveBeenCalledTimes(3);
      expect(result.current.data).toEqual(OPCOES);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("combinação nova de filtros", () => {
  const ATUAL = { systemName: "SigEscola", filtros: BASE };
  const OUTRA = { systemName: "SigEscola", filtros: { ...BASE, dre: "108100" } };

  it("mantém os dados anteriores enquanto a nova combinação carrega", async () => {
    const { Wrapper } = criarWrapper();
    vi.spyOn(global, "fetch").mockResolvedValueOnce(ok(DADOS));
    const { result, rerender } = renderHook(
      ({ opcoes }) => useSigEscolaMetricas(opcoes, (d) => d.planoAnual),
      { wrapper: Wrapper, initialProps: { opcoes: ATUAL } },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // A nova combinação nunca resolve: fica carregando.
    vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));
    rerender({ opcoes: OUTRA });

    await waitFor(() => expect(result.current.isFetching).toBe(true));
    expect(result.current.isPlaceholderData).toBe(true);
    expect(result.current.data).toEqual(PAA);
  });

  it("as opções continuam visíveis enquanto a nova combinação carrega", async () => {
    const { Wrapper } = criarWrapper();
    vi.spyOn(global, "fetch").mockResolvedValueOnce(ok(DADOS));
    const { result, rerender } = renderHook(
      ({ opcoes }) => useSigEscolaOpcoes(opcoes),
      { wrapper: Wrapper, initialProps: { opcoes: ATUAL } },
    );
    await waitFor(() => expect(result.current.data).toEqual(OPCOES));

    vi.spyOn(global, "fetch").mockReturnValue(new Promise(() => {}));
    rerender({ opcoes: OUTRA });

    expect(result.current.data).toEqual(OPCOES);
  });

  it("as opções continuam visíveis depois que a nova combinação falha", async () => {
    vi.useFakeTimers();
    try {
      const { client, Wrapper } = criarWrapper();
      vi.spyOn(global, "fetch").mockResolvedValueOnce(ok(DADOS));
      const { result, rerender } = renderHook(
        ({ opcoes }) => useSigEscolaOpcoes(opcoes),
        { wrapper: Wrapper, initialProps: { opcoes: ATUAL } },
      );
      await avancar(0);
      expect(result.current.data).toEqual(OPCOES);

      vi.spyOn(global, "fetch").mockResolvedValue(falha());
      rerender({ opcoes: OUTRA });
      await avancar(32_000);

      const consulta = client
        .getQueryCache()
        .find({ queryKey: ["sigescola-metricas", "SigEscola", "dre=108100"] });
      expect(consulta?.state.status).toBe("error");
      expect(result.current.data).toEqual(OPCOES);
    } finally {
      vi.useRealTimers();
    }
  });
});
