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
  resolverPeriodo,
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
      "/api/v1/sgp/metricas/?ano_letivo=2026&bimestre=2",
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

describe("fetchAcompanhamentoFechamento", () => {
  it("mapeia as 4 situações de fechamento", async () => {
    mockBffGet.mockResolvedValue({
      fechamento: {
        nao_iniciados: 8398,
        processado_sucesso: 7530,
        processado_pendencias: 6853,
        processado_erro: 12398,
      },
    });

    const res = await fetchAcompanhamentoFechamento(2026, 2);

    expect(res).toEqual([
      { label: "Não iniciados", value: 8398, variant: "muted" },
      { label: "Processado com sucesso", value: 7530, variant: "success" },
      { label: "Processado com pendências", value: 6853, variant: "warning" },
      { label: "Processado com erro", value: 12398, variant: "danger" },
    ]);
  });

  it("usa 0 para situações null", async () => {
    mockBffGet.mockResolvedValue({ fechamento: null });

    const res = await fetchAcompanhamentoFechamento(2026, 2);

    expect(res.every((i) => i.value === 0)).toBe(true);
  });
});

describe("fetchConselhoDeClasse", () => {
  it("mapeia as 3 situações do conselho", async () => {
    mockBffGet.mockResolvedValue({
      conselho_classe: {
        nao_iniciados: 204,
        em_andamento: 387,
        processado_sucesso: 1889,
      },
    });

    const res = await fetchConselhoDeClasse(2026, 2);

    expect(res).toEqual([
      { label: "Não iniciados", value: 204, variant: "muted" },
      { label: "Em andamento", value: 387, variant: "neutral" },
      { label: "Processado com sucesso", value: 1889, variant: "success" },
    ]);
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
