import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import {
  fetchMetricasSigEscola,
  fetchUsuariosAcessoAtivo,
  filtrosDoBff,
} from "./sigEscolaMetricas";

const mockBffGet = vi.mocked(bffGet);

const CONTRATO = {
  atualizado_em: "2026-10-09T10:00:00-03:00",
  filtros: {
    periodo: "2026.3",
    data_inicio: "2026-09-02",
    data_fim: "2026-10-09",
    dre: null,
    ue: null,
  },
  opcoes: {
    periodos: ["2026.3", "2026.2"],
    unidades: [
      {
        codigo_eol: "019715",
        nome: "EMEF ADALGIZA SEGURADO DA SILVEIRA, PROFA.",
      },
    ],
  },
  usuarios: {
    com_acesso_ativo: { valor: 28, variacao_30_dias: 2 },
    unicos_por_dia: { valor: 2, variacao_percentual_30_dias: -23.1 },
    acessos_hoje: { valor: 9, variacao_percentual_30_dias: 112.6 },
  },
  plano_anual_de_atividades: {
    em_andamento: 83,
    finalizados: 35,
    em_retificacao: 46,
  },
  prestacao_de_contas: {
    ues_aptas: 1650,
    enviadas_ou_em_andamento: 2,
    creditos_disponiveis: 118502864.0,
    despesas_registradas: 578497.91,
    demonstrativos_gerados: 7,
    devolucao_ao_tesouro: 0,
  },
  situacao_patrimonial: {
    quantidade_bens_produzidos: 7,
    valor_bens_produzidos: 20199.9,
  },
};

// Fallback do BFF com o cache frio: a task acabou de ser disparada.
const PENDENTE = {
  ...CONTRATO,
  atualizado_em: null,
  opcoes: null,
  usuarios: null,
  plano_anual_de_atividades: null,
  prestacao_de_contas: null,
  situacao_patrimonial: null,
};

const comUsuarios = (usuarios: Record<string, unknown>) => ({
  ...CONTRATO,
  usuarios: { ...CONTRATO.usuarios, ...usuarios },
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("filtrosDoBff", () => {
  it("repassa só os filtros conhecidos e preenchidos", () => {
    const params = filtrosDoBff(
      new URLSearchParams(
        "periodo=&data_inicio=2026-01-01&data_fim=2026-09-22&dre=108100&x=1",
      ),
    );

    expect(params.toString()).toBe(
      "data_inicio=2026-01-01&data_fim=2026-09-22&dre=108100",
    );
  });
});

describe("fetchMetricasSigEscola", () => {
  it("chama o BFF com os filtros e mapeia os cards e as opções", async () => {
    mockBffGet.mockResolvedValue(CONTRATO);

    const res = await fetchMetricasSigEscola(new URLSearchParams("dre=108100"));

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/sigescola/metricas/?dre=108100",
    );
    expect(res.opcoes).toEqual({
      periodo: "2026.3",
      periodos: ["2026.3", "2026.2"],
      unidades: [
        {
          value: "019715",
          label: "EMEF ADALGIZA SEGURADO DA SILVEIRA, PROFA.",
        },
      ],
    });
    expect(res.planoAnual.items.map((i) => i.value)).toEqual([83, 35, 46]);
    expect(res.prestacaoDeContas.destaque.map((i) => i.value)).toEqual([
      1650, 0,
    ]);
    expect(res.prestacaoDeContas.items.map((i) => i.value)).toEqual([
      2, 118502864, 578497.91, 7,
    ]);
    // Figma: a devolução ao Tesouro aparece em vermelho.
    expect(
      res.prestacaoDeContas.destaque.find(
        (i) => i.label === "Devolução ao Tesouro",
      )?.variant,
    ).toBe("danger");
    expect(res.situacaoPatrimonial.items.map((i) => i.value)).toEqual([
      7, 20199.9,
    ]);
  });

  it("mapeia os três KPIs com os textos do Figma", async () => {
    mockBffGet.mockResolvedValue(CONTRATO);

    const res = await fetchMetricasSigEscola(new URLSearchParams());

    expect(res.acessoAtivo).toEqual({
      activeCount: 28,
      trend: "above",
      trendLabel: "2 novos nos últimos 30 dias",
    });
    expect(res.usuariosUnicos).toEqual({
      uniqueCount: 2,
      trend: "below",
      trendLabel: "23% abaixo da média dos últimos 30 dias",
    });
    expect(res.acessosHoje).toEqual({
      accessCount: 9,
      trend: "above",
      trendLabel: "113% acima da média dos últimos 30 dias",
    });
  });

  it("variação que arredonda para zero fica na média", async () => {
    mockBffGet.mockResolvedValue(
      comUsuarios({
        unicos_por_dia: { valor: 3, variacao_percentual_30_dias: 0.4 },
      }),
    );

    const res = await fetchMetricasSigEscola(new URLSearchParams());

    expect(res.usuariosUnicos).toEqual({
      uniqueCount: 3,
      trend: "on-average",
      trendLabel: "Na média dos últimos 30 dias",
    });
  });

  it("lança quando o BFF devolve com_acesso_ativo nulo", async () => {
    mockBffGet.mockResolvedValue(comUsuarios({ com_acesso_ativo: null }));

    await expect(
      fetchMetricasSigEscola(new URLSearchParams()),
    ).rejects.toThrow(
      "Usuários com acesso ativo do SIG-Escola ainda indisponíveis",
    );
  });

  it("sem filtros chama o BFF sem query string", async () => {
    mockBffGet.mockResolvedValue(CONTRATO);

    await fetchMetricasSigEscola(new URLSearchParams());

    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/sigescola/metricas/");
  });

  it("lança com o cache frio, para a rota responder 500", async () => {
    mockBffGet.mockResolvedValue(PENDENTE);

    await expect(
      fetchMetricasSigEscola(new URLSearchParams()),
    ).rejects.toThrow("ainda indisponíveis");
    expect(mockBffGet).toHaveBeenCalledTimes(1);
  });
});

describe("fetchUsuariosAcessoAtivo", () => {
  it("usa o cenário padrão e mapeia valor e novos em 30 dias", async () => {
    mockBffGet.mockResolvedValue(CONTRATO);

    const res = await fetchUsuariosAcessoAtivo();

    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/sigescola/metricas/");
    expect(res).toEqual({
      activeCount: 28,
      trend: "above",
      trendLabel: "2 novos nos últimos 30 dias",
    });
  });

  it("sem cadastros novos, a tendência é on-average", async () => {
    mockBffGet.mockResolvedValue(
      comUsuarios({ com_acesso_ativo: { valor: 28, variacao_30_dias: 0 } }),
    );

    const res = await fetchUsuariosAcessoAtivo();

    expect(res).toEqual({
      activeCount: 28,
      trend: "on-average",
      trendLabel: "0 novos nos últimos 30 dias",
    });
  });

  it("lança com o cache frio, para o card não mostrar zero", async () => {
    mockBffGet.mockResolvedValue(PENDENTE);

    await expect(fetchUsuariosAcessoAtivo()).rejects.toThrow(
      "ainda indisponíveis",
    );
  });

  it("lança quando o BFF devolve com_acesso_ativo nulo", async () => {
    mockBffGet.mockResolvedValue(comUsuarios({ com_acesso_ativo: null }));

    await expect(fetchUsuariosAcessoAtivo()).rejects.toThrow(
      "Usuários com acesso ativo do SIG-Escola ainda indisponíveis",
    );
  });
});
