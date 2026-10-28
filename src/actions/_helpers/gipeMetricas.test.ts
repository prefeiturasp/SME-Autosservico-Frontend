import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import {
  fetchMetricasGipe,
  fetchUsuariosAcessoAtivoGipe,
} from "./gipeMetricas";

const mockBffGet = vi.mocked(bffGet);

// Recorte do contrato real de homologação (2026), com os nulos que o
// Backend manda quando não há fonte: prazos, tendências e KPIs sem login.
const CONTRATO = {
  atualizado_em: "2026-10-27T15:21:25.017341+00:00",
  ano_letivo: 2026,
  kpis: {
    acesso_ativo: {
      valor: 8,
      tendencia: "above",
      tendencia_label: "1 novo nos últimos 30 dias",
    },
    usuarios_unicos: { valor: 0, tendencia: null, tendencia_label: null },
    acessos_hoje: { valor: 0, tendencia: null, tendencia_label: null },
  },
  ocorrencias: {
    status_geral: {
      cadastrados: 424,
      abertas: 86,
      em_andamento: 308,
      finalizadas: 30,
    },
    tempo_resposta: {
      tempo_medio_resolucao_dias: 2.872,
      tendencia_resolucao: null,
      tendencia_resolucao_label: null,
      tempo_medio_primeira_tratativa_dias: 0.318,
      tendencia_primeira_tratativa: "below",
      tendencia_primeira_tratativa_label: "3% mais rápido",
    },
    prazos_movimentacoes: {
      dentro_do_prazo: null,
      fora_do_prazo: null,
      sem_movimentacao_7_dias: 387,
      media_movimentacoes_por_ocorrencia: 1.9,
    },
    por_dre: [{ label: "Ipiranga", value: 120 }],
    por_unidade_educacional: [{ label: "EMEF EXEMPLO", value: 9 }],
    por_categoria: { patrimoniais: 223, interpessoais: 201 },
    por_tipo_patrimonial: [{ label: "Furto", value: 40 }],
    por_tipo_interpessoal: [{ label: "Bullying", value: 35 }],
    por_mes: [{ label: "Janeiro/26", valor: 1, pico: false }],
    por_periodo_letivo: [{ label: "1º Bimestre", value: 80 }],
    tratadas_por_analista: [
      {
        analista: "Analista Exemplo",
        ocorrencias_tratadas: 17,
        tempo_medio: "5,0 dias",
      },
    ],
    tratadas_por_dre: [{ label: "Ipiranga", value: 12 }],
  },
  usuarios: {
    cadastrados: 18,
    por_tipo_de_perfil: [{ label: "Diretor de Escola", percentage: 39 }],
    perfis_mais_utilizados: [{ label: "Diretor de Escola", value: 7 }],
    por_dre: [{ label: "Ipiranga", value: 5 }],
    por_unidade_educacional: [{ label: "EMEF EXEMPLO", value: 2 }],
  },
  produtividade: {
    encaminhamentos_realizados: 402,
    anexos_enviados: 25,
    atualizacoes_nas_ocorrencias: 826,
  },
};

// Fallback do BFF com o cache frio: a task acabou de ser disparada.
const PENDENTE = {
  ...CONTRATO,
  atualizado_em: null,
  kpis: null,
  ocorrencias: null,
  usuarios: null,
  produtividade: null,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchMetricasGipe", () => {
  it("converte o contrato do BFF para o formato dos cards", async () => {
    mockBffGet.mockResolvedValueOnce(CONTRATO);

    const r = await fetchMetricasGipe(new URLSearchParams());

    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/gipe/metricas/");
    expect(r.kpis.acessoAtivo).toEqual({
      valor: 8,
      tendencia: "above",
      tendenciaLabel: "1 novo nos últimos 30 dias",
    });
    expect(r.ocorrencias.statusGeral).toEqual({
      cadastrados: 424,
      abertas: 86,
      emAndamento: 308,
      finalizadas: 30,
    });
    expect(r.ocorrencias.tempoResposta).toEqual({
      tempoMedioResolucaoDias: 2.872,
      tendenciaResolucao: undefined,
      tendenciaResolucaoLabel: undefined,
      tempoMedioPrimeiraTratativaDias: 0.318,
      tendenciaPrimeiraTratativa: "above",
      tendenciaPrimeiraTratativaLabel: "3% mais rápido",
    });
    expect(r.ocorrencias.prazosMovimentacoes).toEqual({
      dentroDoPrazo: null,
      foraDoPrazo: null,
      semMovimentacao7Dias: 387,
      mediaMovimentacoesPorOcorrencia: 1.9,
    });
    expect(r.ocorrencias.porDre).toEqual([{ label: "Ipiranga", value: 120 }]);
    expect(r.ocorrencias.porUnidadeEducacional).toEqual([
      { label: "EMEF EXEMPLO", value: 9 },
    ]);
    expect(r.ocorrencias.porCategoria).toEqual({
      patrimoniais: 223,
      interpessoais: 201,
    });
    expect(r.ocorrencias.porTipoPatrimonial).toEqual([
      { label: "Furto", value: 40 },
    ]);
    expect(r.ocorrencias.porTipoInterpessoal).toEqual([
      { label: "Bullying", value: 35 },
    ]);
    expect(r.ocorrencias.porMes).toEqual([
      { label: "Janeiro/26", valor: 1, pico: false },
    ]);
    expect(r.ocorrencias.porPeriodoLetivo).toEqual([
      { label: "1º Bimestre", value: 80 },
    ]);
    expect(r.ocorrencias.tratadasPorAnalista).toEqual([
      {
        analista: "Analista Exemplo",
        ocorrenciasTratadas: 17,
        tempoMedio: "5,0 dias",
      },
    ]);
    expect(r.ocorrencias.tratadasPorDre).toEqual([
      { label: "Ipiranga", value: 12 },
    ]);
    expect(r.usuarios).toEqual({
      cadastrados: 18,
      porTipoDePerfil: [{ label: "Diretor de Escola", percentage: 39 }],
      perfisMaisUtilizados: [{ label: "Diretor de Escola", value: 7 }],
      porDre: [{ label: "Ipiranga", value: 5 }],
      porUnidadeEducacional: [{ label: "EMEF EXEMPLO", value: 2 }],
    });
    expect(r.produtividade).toEqual({
      encaminhamentosRealizados: 402,
      anexosEnviados: 25,
      atualizacoesNasOcorrencias: 826,
    });
  });

  it("no tempo de resposta, mais rápido é selo verde e mais lento é vermelho", async () => {
    // No Backend, below = mais rápido; no selo, above (verde, ↑) é o bom.
    mockBffGet.mockResolvedValueOnce({
      ...CONTRATO,
      ocorrencias: {
        ...CONTRATO.ocorrencias,
        tempo_resposta: {
          ...CONTRATO.ocorrencias.tempo_resposta,
          tendencia_resolucao: "below",
          tendencia_resolucao_label: "14% mais rápido",
          tendencia_primeira_tratativa: "above",
          tendencia_primeira_tratativa_label: "2% mais lento",
        },
      },
    });

    const { tempoResposta } = (await fetchMetricasGipe(new URLSearchParams()))
      .ocorrencias;

    expect(tempoResposta.tendenciaResolucao).toBe("above");
    expect(tempoResposta.tendenciaPrimeiraTratativa).toBe("below");
  });

  it("repassa ao BFF só o ano letivo", async () => {
    mockBffGet.mockResolvedValueOnce(CONTRATO);

    await fetchMetricasGipe(new URLSearchParams("ano_letivo=2025&dre=108100"));

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/gipe/metricas/?ano_letivo=2025",
    );
  });

  it("lança com o cache frio do BFF, em vez de mostrar zeros", async () => {
    mockBffGet.mockResolvedValueOnce(PENDENTE);

    await expect(fetchMetricasGipe(new URLSearchParams())).rejects.toThrow(
      "Métricas do GIPE ainda indisponíveis",
    );
  });

  it("deixa sem selo os KPIs sem tendência", async () => {
    mockBffGet.mockResolvedValueOnce(CONTRATO);

    const r = await fetchMetricasGipe(new URLSearchParams());

    expect(r.kpis.usuariosUnicos).toEqual({
      valor: 0,
      tendencia: "on-average",
      tendenciaLabel: "",
    });
    expect(r.kpis.acessosHoje).toEqual({
      valor: 0,
      tendencia: "on-average",
      tendenciaLabel: "",
    });
  });
});

describe("fetchUsuariosAcessoAtivoGipe", () => {
  it("lê o acesso ativo do ano corrente", async () => {
    mockBffGet.mockResolvedValueOnce(CONTRATO);

    expect(await fetchUsuariosAcessoAtivoGipe()).toEqual({
      activeCount: 8,
      trend: "above",
      trendLabel: "1 novo nos últimos 30 dias",
    });
    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/gipe/metricas/");
  });

  it("acesso ativo sem novos fica sem selo de tendência", async () => {
    mockBffGet.mockResolvedValueOnce({
      ...CONTRATO,
      kpis: {
        ...CONTRATO.kpis,
        acesso_ativo: { valor: 8, tendencia: null, tendencia_label: null },
      },
    });

    expect(await fetchUsuariosAcessoAtivoGipe()).toEqual({
      activeCount: 8,
      trend: "on-average",
      trendLabel: "",
    });
  });

  it("lança com o cache frio do BFF", async () => {
    mockBffGet.mockResolvedValueOnce(PENDENTE);

    await expect(fetchUsuariosAcessoAtivoGipe()).rejects.toThrow(
      "Métricas do GIPE ainda indisponíveis",
    );
  });
});
