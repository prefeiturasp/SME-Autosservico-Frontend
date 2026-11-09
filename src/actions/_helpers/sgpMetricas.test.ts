import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import {
  fetchFrequencias,
  fetchSondagens,
  fetchAcompanhamentoFechamento,
  fetchConselhoDeClasse,
  fetchUsuariosAcessoAtivo,
  fetchPeriodosSgp,
  resolverPeriodo,
  resolverFiltrosSgp,
  periodoCorrente,
} from "./sgpMetricas";

const mockBffGet = vi.mocked(bffGet);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchFrequencias", () => {
  it("mapeia lançadas/esperadas e o percentual do BFF", async () => {
    mockBffGet.mockResolvedValue({
      frequencias: { lancadas: 18432, esperadas: 21760, percentual: 84.7 },
    });

    const res = await fetchFrequencias(2026, 2);

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/sgp/metricas/?ano_letivo=2026&bimestre=2&segmento=fundamental_medio",
    );
    expect(res).toEqual({
      items: [
        { label: "Lançadas", value: 18432, variant: "neutral" },
        { label: "Esperadas", value: 21760, variant: "muted" },
      ],
      progressPercentage: 84.7,
    });
  });

  it("cai para 0 quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ frequencias: null });

    const res = await fetchFrequencias(2026, 2);

    expect(res.items.map((i) => i.value)).toEqual([0, 0]);
    expect(res.progressPercentage).toBe(0);
  });
});

describe("fetchSondagens", () => {
  it("deriva o percentual de realizadas/esperadas", async () => {
    mockBffGet.mockResolvedValue({
      sondagens: { realizadas: 1243, esperadas: 2683 },
    });

    const res = await fetchSondagens(2026, 2);

    expect(res.items[0]).toEqual({
      label: "Sondagens realizadas",
      value: 1243,
      variant: "neutral",
    });
    expect(res.progressPercentage).toBe(46.3);
  });

  it("percentual 0 quando não há esperadas", async () => {
    mockBffGet.mockResolvedValue({
      sondagens: { realizadas: 0, esperadas: 0 },
    });

    const res = await fetchSondagens(2026, 2);

    expect(res.progressPercentage).toBe(0);
  });
});

const FUND_MEDIO = {
  anoLetivo: 2026,
  bimestre: 2,
  segmento: "fundamental_medio",
  semestre: null,
} as const;
const EJA = { anoLetivo: 2026, bimestre: 1, segmento: "eja", semestre: 2 } as const;

describe("fetchAcompanhamentoFechamento", () => {
  it("mapeia esperado, situações com percentual e a quebra por DRE", async () => {
    mockBffGet.mockResolvedValue({
      fechamento: {
        esperado: 35179,
        nao_iniciados: 8398,
        processado_sucesso: 12398,
        processado_pendencias: 7530,
        processado_erro: 6853,
        por_dre: [
          {
            dre: "BT",
            previsto: 3156,
            nao_iniciados: 1736,
            processado_sucesso: 980,
            processado_pendencias: 240,
            processado_erro: 200,
          },
        ],
      },
    });

    const res = await fetchAcompanhamentoFechamento(EJA);

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/sgp/metricas/?ano_letivo=2026&bimestre=1&segmento=eja&semestre=2",
    );
    expect(res.itens).toEqual([
      { label: "Esperado para o período", value: 35179, variant: "neutral", percentage: 76.13 },
      { label: "Não iniciados", value: 8398, variant: "muted", percentage: 23.87 },
      { label: "Processado com sucesso", value: 12398, variant: "success", percentage: 35.24 },
      { label: "Processado com pendências", value: 7530, variant: "warning", percentage: 21.4 },
      { label: "Processado com erro", value: 6853, variant: "danger", percentage: 19.48 },
    ]);
    expect(res.porDre).toEqual([
      {
        dre: "BT",
        previsto: 3156,
        naoIniciados: 1736,
        processadoSucesso: 980,
        processadoPendencias: 240,
        processadoErro: 200,
      },
    ]);
  });

  it("usa 0 (e 0%) quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ fechamento: null });

    const res = await fetchAcompanhamentoFechamento(FUND_MEDIO);

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/sgp/metricas/?ano_letivo=2026&bimestre=2&segmento=fundamental_medio",
    );
    expect(res.itens.every((i) => i.value === 0 && i.percentage === 0)).toBe(true);
    expect(res.porDre).toEqual([]);
  });
});

describe("fetchConselhoDeClasse", () => {
  it("mapeia esperado e as 3 situações com percentual", async () => {
    mockBffGet.mockResolvedValue({
      conselho_classe: {
        esperado: 2480,
        nao_iniciados: 204,
        em_andamento: 387,
        processado_sucesso: 1889,
      },
    });

    const res = await fetchConselhoDeClasse(FUND_MEDIO);

    expect(res).toEqual([
      { label: "Esperados para o período", value: 2480, variant: "neutral", percentage: 91.77 },
      { label: "Não iniciados", value: 204, variant: "muted", percentage: 8.23 },
      { label: "Em andamento", value: 387, variant: "neutral", percentage: 15.6 },
      { label: "Processado com sucesso", value: 1889, variant: "success", percentage: 76.17 },
    ]);
  });
});

describe("fetchPeriodosSgp", () => {
  it("monta as opções do seletor com valor e rótulo", async () => {
    mockBffGet.mockResolvedValue({
      periodos: [
        { ano_letivo: 2026, segmento: "fundamental_medio", semestre: null, bimestre: 4, inicio: "2026-10-05", fim: "2026-12-18" },
        { ano_letivo: 2026, segmento: "eja", semestre: 2, bimestre: 1, inicio: "2026-07-27", fim: "2026-09-30" },
      ],
    });

    const res = await fetchPeriodosSgp();

    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/sgp/periodos/");
    expect(res).toEqual([
      { value: "fundamental_medio:2026:0:4", label: "4º Bimestre de 2026", segmento: "fundamental_medio" },
      { value: "eja:2026:2:1", label: "EJA - 1º Bim. do 2º Sem. 2026", segmento: "eja" },
    ]);
  });

  it("devolve lista vazia com o cache do BFF frio", async () => {
    mockBffGet.mockResolvedValue({ periodos: null });

    expect(await fetchPeriodosSgp()).toEqual([]);
  });
});

describe("resolverFiltrosSgp", () => {
  const filtros = (query: string) =>
    resolverFiltrosSgp(new URLSearchParams(query));

  it("lê a EJA com semestre e bimestre válidos", () => {
    expect(filtros("ano_letivo=2026&bimestre=1&segmento=eja&semestre=2")).toEqual(EJA);
  });

  it("ignora o semestre fora da EJA", () => {
    expect(filtros("ano_letivo=2026&bimestre=2&semestre=1")).toEqual(FUND_MEDIO);
  });

  it.each([
    "ano_letivo=2026&bimestre=2&segmento=eja",
    "ano_letivo=2026&bimestre=3&segmento=eja&semestre=1",
    "ano_letivo=2026&bimestre=2&segmento=infantil",
  ])("EJA inválida cai em Fundamental/Médio (%s)", (query) => {
    expect(filtros(query).segmento).toBe("fundamental_medio");
    expect(filtros(query).semestre).toBeNull();
  });
});

describe("fetchUsuariosAcessoAtivo", () => {
  it("mapeia valor/variação e marca tendência de alta", async () => {
    mockBffGet.mockResolvedValue({
      usuarios: {
        com_acesso_ativo: { valor: 8398, variacao_30_dias: 453 },
      },
    });

    const res = await fetchUsuariosAcessoAtivo(2026, 2);

    expect(res).toEqual({
      activeCount: 8398,
      trend: "above",
      trendLabel: "453 novos nos últimos 30 dias",
    });
  });

  it("cai para 0/on-average quando usuários vem null", async () => {
    mockBffGet.mockResolvedValue({ usuarios: null });

    const res = await fetchUsuariosAcessoAtivo(2026, 2);

    expect(res).toEqual({
      activeCount: 0,
      trend: "on-average",
      trendLabel: "0 novos nos últimos 30 dias",
    });
  });
});

describe("resolverPeriodo", () => {
  it("usa ano_letivo/bimestre da query quando presentes", () => {
    const params = new URLSearchParams("ano_letivo=2025&bimestre=3");

    expect(resolverPeriodo(params)).toEqual({ anoLetivo: 2025, bimestre: 3 });
  });

  it("cai no período corrente quando a query está vazia", () => {
    expect(resolverPeriodo(new URLSearchParams())).toEqual(periodoCorrente());
  });

  it("descarta bimestre fora de 1..4 e usa o bimestre corrente", () => {
    const { bimestre } = periodoCorrente();

    for (const invalido of ["9", "0", "-1", "2.5", "abc"]) {
      const params = new URLSearchParams(`ano_letivo=2025&bimestre=${invalido}`);

      expect(resolverPeriodo(params)).toEqual({ anoLetivo: 2025, bimestre });
    }
  });

  it("descarta ano_letivo fora de 2020..ano corrente + 1 e usa o ano corrente", () => {
    const { anoLetivo } = periodoCorrente();

    for (const invalido of ["1999", "2019", String(anoLetivo + 2), "2025.5", "abc"]) {
      const params = new URLSearchParams(`ano_letivo=${invalido}&bimestre=3`);

      expect(resolverPeriodo(params)).toEqual({ anoLetivo, bimestre: 3 });
    }
  });

  it("aceita os limites válidos de ano_letivo e bimestre", () => {
    const { anoLetivo } = periodoCorrente();

    expect(
      resolverPeriodo(new URLSearchParams("ano_letivo=2020&bimestre=1")),
    ).toEqual({ anoLetivo: 2020, bimestre: 1 });
    expect(
      resolverPeriodo(
        new URLSearchParams(`ano_letivo=${anoLetivo + 1}&bimestre=4`),
      ),
    ).toEqual({ anoLetivo: anoLetivo + 1, bimestre: 4 });
  });
});

describe("periodoCorrente", () => {
  it("resolve o ano atual e um bimestre entre 1 e 4", () => {
    const { anoLetivo, bimestre } = periodoCorrente();

    expect(anoLetivo).toBe(new Date().getFullYear());
    expect(bimestre).toBeGreaterThanOrEqual(1);
    expect(bimestre).toBeLessThanOrEqual(4);
  });
});
