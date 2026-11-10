import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import { fetchMetricasBensFisicos } from "./bensFisicosMetricas";

const mockBffGet = vi.mocked(bffGet);

// Recorte do contrato real de homologação (10/11/2026).
const CONTRATO = {
  atualizado_em: "2026-11-10T09:55:48.255403+00:00",
  usuarios: {
    com_acesso_ativo: { valor: 4 },
    unicos_por_dia: { valor: 3, variacao_percentual_30_dias: 8.4 },
  },
  cadastro_de_bens: {
    bens_cadastrados: 6094,
    aguardando_aprovacao: 53,
    por_unidade_administrativa: [
      { sigla: "SMECOTIC", nome: "COORDENADORIA DE TECNOLOGIA", bens: 493 },
      { sigla: "SPDM", nome: "ED ESPECIAL PARCERIA", bens: 339 },
    ],
  },
  baixas_fisicas: { aprovadas: 47, aguardando_aprovacao: 0 },
  movimentacoes: { realizadas: 1463, pendentes: 77, transferencias_realizadas: 9 },
};

const comVariacao = (variacao: number | null) => ({
  ...CONTRATO,
  usuarios: {
    ...CONTRATO.usuarios,
    unicos_por_dia: { valor: 3, variacao_percentual_30_dias: variacao },
  },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchMetricasBensFisicos", () => {
  it("converte o contrato do BFF para o formato dos cards", async () => {
    mockBffGet.mockResolvedValueOnce(CONTRATO);

    const r = await fetchMetricasBensFisicos();

    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/bens-fisicos/metricas/");
    expect(r).toEqual({
      acessoAtivo: {
        activeCount: 4,
        trend: "on-average",
        trendLabel: "Últimos 30 dias",
      },
      usuariosUnicos: {
        uniqueCount: 3,
        trend: "above",
        trendLabel: "8% acima da média dos últimos 30 dias",
      },
      cadastroDeBens: {
        items: [
          { label: "Número de bens cadastrados", value: 6094, variant: "neutral" },
          {
            label: "Bens aguardando aprovação de cadastro",
            value: 53,
            variant: "warning",
          },
        ],
      },
      bensPorUnidade: [
        { label: "SMECOTIC", value: 493 },
        { label: "SPDM", value: 339 },
      ],
      baixasFisicas: {
        items: [
          { label: "Aprovadas", value: 47, variant: "success" },
          { label: "Aguardando aprovação", value: 0, variant: "warning" },
        ],
      },
      movimentacoes: {
        items: [
          { label: "Movimentações realizadas", value: 1463, variant: "neutral" },
          { label: "Movimentações pendentes", value: 77, variant: "warning" },
          { label: "Transferências realizadas", value: 9, variant: "neutral" },
        ],
      },
    });
  });

  it.each([
    [-66.7, "below", "67% abaixo da média dos últimos 30 dias"],
    [0, "on-average", "Na média dos últimos 30 dias"],
    [0.4, "on-average", "Na média dos últimos 30 dias"],
    [null, "on-average", "Na média dos últimos 30 dias"],
  ])(
    "variação %s vira o selo %s",
    async (variacao, trend, trendLabel) => {
      mockBffGet.mockResolvedValueOnce(comVariacao(variacao));

      const r = await fetchMetricasBensFisicos();

      expect(r.usuariosUnicos).toEqual({ uniqueCount: 3, trend, trendLabel });
    },
  );

  it("lança com o cache frio do BFF, para a rota responder 500", async () => {
    mockBffGet.mockResolvedValueOnce({
      atualizado_em: null,
      usuarios: null,
      cadastro_de_bens: null,
      baixas_fisicas: null,
      movimentacoes: null,
    });

    await expect(fetchMetricasBensFisicos()).rejects.toThrow(
      "Métricas do Bens Físicos ainda indisponíveis",
    );
  });
});
