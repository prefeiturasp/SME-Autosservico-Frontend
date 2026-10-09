import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import { fetchProvas, fetchUsuariosAcessoAtivo } from "./serapMetricas";

const mockBffGet = vi.mocked(bffGet);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchProvas", () => {
  it("mapeia o bloco provas do BFF nos quatro cards e no percentual", async () => {
    mockBffGet.mockResolvedValue({
      provas: {
        total: 8398,
        iniciadas_hoje: 7530,
        nao_finalizadas: 1853,
        finalizadas: 6398,
        percentual_finalizadas: 76.2,
      },
    });

    const res = await fetchProvas(2026, 2);

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/serap/metricas/?ano=2026&bimestre=2",
    );
    expect(res).toEqual({
      items: [
        { label: "Total de provas", value: 8398, variant: "neutral" },
        { label: "Provas iniciadas hoje", value: 7530, variant: "muted" },
        { label: "Provas não finalizadas", value: 1853, variant: "warning" },
        { label: "Provas finalizadas", value: 6398, variant: "success" },
      ],
      progressPercentage: 76.2,
    });
  });

  it("lança erro quando o bloco vem null (cache frio do BFF)", async () => {
    mockBffGet.mockResolvedValue({ provas: null });

    await expect(fetchProvas(2026, 2)).rejects.toThrow(
      "Métricas de provas do SERAp ainda indisponíveis",
    );
  });
});

describe("fetchUsuariosAcessoAtivo", () => {
  it("mapeia valor/variação e marca tendência de alta", async () => {
    mockBffGet.mockResolvedValue({
      usuarios: {
        com_acesso_ativo: { valor: 387153, variacao_30_dias: 1200 },
      },
    });

    const res = await fetchUsuariosAcessoAtivo(2026, 2);

    expect(res).toEqual({
      activeCount: 387153,
      trend: "above",
      trendLabel: "1200 novos nos últimos 30 dias",
    });
  });

  it("lança erro quando usuários vem null (cache frio do BFF)", async () => {
    mockBffGet.mockResolvedValue({ usuarios: null });

    await expect(fetchUsuariosAcessoAtivo(2026, 2)).rejects.toThrow(
      "Usuários com acesso ativo do SERAp ainda indisponíveis",
    );
  });

  it("lança erro quando com_acesso_ativo vem null", async () => {
    mockBffGet.mockResolvedValue({ usuarios: { com_acesso_ativo: null } });

    await expect(fetchUsuariosAcessoAtivo(2026, 2)).rejects.toThrow(
      "Usuários com acesso ativo do SERAp ainda indisponíveis",
    );
  });
});
