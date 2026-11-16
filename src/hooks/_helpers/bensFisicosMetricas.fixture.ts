import { vi } from "vitest";
import type { BensFisicosMetricasResponse } from "@/types/bensFisicosMetricas";

// Contrato já convertido pela rota /api/bens-fisicos/metricas, para os
// testes dos hooks simularem o fetch.
export const BENS_FISICOS_METRICAS_FIXTURE: BensFisicosMetricasResponse = {
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
};

export function mockFetchBensFisicos(
  dados: BensFisicosMetricasResponse = BENS_FISICOS_METRICAS_FIXTURE,
) {
  return vi
    .spyOn(globalThis, "fetch")
    .mockImplementation(async () => new Response(JSON.stringify(dados)));
}
