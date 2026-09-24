import { describe, it, expect, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import {
  fetchMedicoesIniciais,
  fetchProdutosHomologados,
  fetchEmpresasTerceirizadas,
  fetchSolicitacoesDietasEspeciais,
  fetchSolicitacoesAlimentacoes,
  fetchCronogramasEntregas,
  fetchFichasTecnicasProdutos,
  fetchFornecedoresDistribuidores,
  fetchLayoutsEmbalagens,
  fetchComparativoAcessos,
  fetchUsuariosAcessoAtivo,
  fetchUsuariosPorTipoPerfil,
} from "./sigpaeMetricas";

const mockBffGet = vi.mocked(bffGet);

describe("fetchMedicoesIniciais", () => {
  it("mapeia as medições do BFF para os 5 itens do card", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: {
        medicoes_iniciais: {
          aguardando_envio_ue: 16,
          enviadas_pelas_unidades: 4,
          aprovadas_pelas_dres: 3,
          aguardando_codae: 2,
          aprovadas_codae: 1,
        },
      },
    });

    const res = await fetchMedicoesIniciais();

    expect(res.items).toHaveLength(5);
    expect(res.items[0]).toEqual({
      label: "Aguardando envio pelas UEs",
      value: 16,
      variant: "warning",
    });
    expect(res.items[4]).toEqual({
      label: "Aprovadas por CODAE",
      value: 1,
      variant: "success",
    });
  });

  it("usa 0 quando o valor vem null", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: {
        medicoes_iniciais: {
          aguardando_envio_ue: null,
          enviadas_pelas_unidades: null,
          aprovadas_pelas_dres: null,
          aguardando_codae: null,
          aprovadas_codae: null,
        },
      },
    });

    const res = await fetchMedicoesIniciais();

    expect(res.items.every((i) => i.value === 0)).toBe(true);
  });
});

describe("fetchProdutosHomologados", () => {
  it("mapeia os 4 indicadores de produtos", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: {
        produtos_homologados: {
          total_cadastrados: 6,
          homologados: 2,
          solicitacoes_no_mes: 1,
          solicitacoes_no_ano: 5,
        },
      },
    });

    const res = await fetchProdutosHomologados();

    expect(res.items).toHaveLength(4);
    expect(res.items[0]).toEqual({
      label: "Total de produtos cadastrados",
      value: 6,
      variant: "neutral",
    });
    expect(res.items[1].value).toBe(2);
  });

  it("usa 0 quando o bloco vem nulo", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: { produtos_homologados: null },
    });

    const res = await fetchProdutosHomologados();

    expect(res.items.every((i) => i.value === 0)).toBe(true);
  });
});

describe("fetchEmpresasTerceirizadas", () => {
  it("mapeia cadastradas e ativas nos 2 itens", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: {
        empresas_terceirizadas: { cadastradas: 7, ativas: 5 },
      },
    });

    const res = await fetchEmpresasTerceirizadas();

    expect(res.items).toEqual([
      {
        label: "Total de empresas terceirizadas cadastradas",
        value: 7,
        variant: "neutral",
      },
      {
        label: "Total de empresas terceirizadas ativas",
        value: 5,
        variant: "success",
      },
    ]);
  });

  it("usa 0 quando o bloco vem nulo", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: { empresas_terceirizadas: null },
    });

    const res = await fetchEmpresasTerceirizadas();

    expect(res.items.every((i) => i.value === 0)).toBe(true);
  });
});

describe("fetchSolicitacoesDietasEspeciais", () => {
  it("normaliza os 4 períodos com números do contrato", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: {
        solicitacoes_dietas_especiais: {
          dia: {
            total: 12,
            autorizadas: 8,
            aguardando: 2,
            negadas: 1,
            canceladas: 1,
          },
          quinzena: {
            total: 5,
            autorizadas: 2,
            aguardando: 3,
            negadas: null,
            canceladas: null,
          },
          mes: null,
          trimestre: null,
        },
      },
    });

    const res = await fetchSolicitacoesDietasEspeciais();

    expect(res.dia.total).toBe(12);
    expect(res.quinzena.negadas).toBe(0);
    expect(res.mes).toEqual({
      total: 0,
      autorizadas: 0,
      aguardando: 0,
      negadas: 0,
      canceladas: 0,
    });
  });

  it("zera todos os períodos quando o bloco vem nulo", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: { solicitacoes_dietas_especiais: null },
    });

    const res = await fetchSolicitacoesDietasEspeciais();

    expect(Object.values(res).every((p) => p.total === 0)).toBe(true);
    expect(Object.keys(res)).toEqual([
      "dia",
      "quinzena",
      "mes",
      "trimestre",
    ]);
  });
});

describe("fetchSolicitacoesAlimentacoes", () => {
  it("normaliza os 4 períodos e zera valores nulos", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: {
        solicitacoes_alimentacoes: {
          dia: {
            total: 19,
            autorizadas: 10,
            aguardando: null,
            negadas: 9,
            canceladas: null,
          },
          quinzena: null,
          mes: null,
          trimestre: null,
        },
      },
    });

    const res = await fetchSolicitacoesAlimentacoes();

    expect(res.dia).toEqual({
      total: 19,
      autorizadas: 10,
      aguardando: 0,
      negadas: 9,
      canceladas: 0,
    });
    expect(res.quinzena.total).toBe(0);
  });

  it("zera tudo quando o bloco vem nulo", async () => {
    mockBffGet.mockResolvedValue({
      alimentacao_terceirizada: { solicitacoes_alimentacoes: null },
    });

    const res = await fetchSolicitacoesAlimentacoes();

    expect(Object.values(res).every((p) => p.total === 0)).toBe(true);
  });
});

describe("logística", () => {
  it("mapeia cronogramas de entregas nos 3 itens", async () => {
    mockBffGet.mockResolvedValue({
      logistica: {
        cronogramas_entregas: {
          aguardando: 2,
          enviadas: 3,
          aprovadas: 1,
        },
      },
    });

    const res = await fetchCronogramasEntregas();

    expect(res.items).toEqual([
      { label: "Aguardando", value: 2, variant: "warning" },
      { label: "Enviadas", value: 3, variant: "success" },
      { label: "Aprovadas", value: 1, variant: "success" },
    ]);
  });

  it("mapeia fichas técnicas e zera nulos", async () => {
    mockBffGet.mockResolvedValue({
      logistica: {
        fichas_tecnicas_produtos: {
          cadastradas: 10,
          aprovadas: null,
          em_analise: 3,
          pendentes_correcao: null,
        },
      },
    });

    const res = await fetchFichasTecnicasProdutos();

    expect(res.items).toHaveLength(4);
    expect(res.items[0].value).toBe(10);
    expect(res.items[1]).toEqual({
      label: "Aprovadas",
      value: 0,
      variant: "success",
    });
  });

  it("mapeia layouts de embalagens", async () => {
    mockBffGet.mockResolvedValue({
      logistica: {
        layouts_embalagens: {
          cadastrados: 7,
          aprovados: 4,
          aguardando_codae: 2,
          pendentes_correcao: 1,
        },
      },
    });

    const res = await fetchLayoutsEmbalagens();

    expect(res.items[2]).toEqual({
      label: "Aguardando CODAE",
      value: 2,
      variant: "warning",
    });
  });

  it("zera fornecedores quando o bloco vem nulo", async () => {
    mockBffGet.mockResolvedValue({
      logistica: { fornecedores_distribuidores: null },
    });

    const res = await fetchFornecedoresDistribuidores();

    expect(res.items).toEqual([
      {
        label: "Total de empresas fornecedoras cadastradas",
        value: 0,
        variant: "neutral",
      },
      {
        label: "Total de empresas fornecedoras ativas",
        value: 0,
        variant: "success",
      },
    ]);
  });
});

describe("fetchComparativoAcessos", () => {
  it("repassa os 4 períodos vindos do contrato", async () => {
    const buckets = [
      { label: "Dia 1", value: 1, isPeak: false },
      { label: "Dia 2", value: 9, isPeak: true },
      { label: "Dia 3", value: 3, isPeak: false },
    ];
    mockBffGet.mockResolvedValue({
      usuarios: {
        comparativo_acessos: {
          dia: { buckets },
          quinzena: { buckets: [] },
          mes: { buckets: [] },
          trimestre: { buckets: [] },
        },
      },
    });

    const res = await fetchComparativoAcessos();

    expect(res.dia.buckets).toEqual(buckets);
  });

  it("devolve baldes zerados e rotulados quando o bloco vem nulo", async () => {
    mockBffGet.mockResolvedValue({
      usuarios: { comparativo_acessos: null },
    });

    const res = await fetchComparativoAcessos();

    expect(res.mes.buckets).toEqual([
      { label: "Semana 1", value: 0, isPeak: false },
      { label: "Semana 2", value: 0, isPeak: false },
      { label: "Semana 3", value: 0, isPeak: false },
    ]);
    expect(res.trimestre.buckets[0].label).toBe("Mês 1");
  });
});

describe("fetchUsuariosAcessoAtivo", () => {
  it("usa o total e monta o rótulo de novos em 30 dias", async () => {
    mockBffGet.mockResolvedValue({
      usuarios: {
        com_acesso_ativo: {
          total: 12,
          ativos_30_dias: 4,
          novos_30_dias: 2,
        },
      },
    });

    const res = await fetchUsuariosAcessoAtivo();

    expect(res.activeCount).toBe(12);
    expect(res.trend).toBe("above");
    expect(res.trendLabel).toBe("2 novos nos últimos 30 dias");
  });
});

describe("fetchUsuariosPorTipoPerfil", () => {
  it("converte as contagens em porcentagens sobre CODAE+DRE+UE", async () => {
    mockBffGet.mockResolvedValue({
      usuarios: {
        por_tipo_perfil: { codae: 8, dre: 1, ue: 1, empresa: 5 },
      },
    });

    const res = await fetchUsuariosPorTipoPerfil();

    expect(res).toEqual({ codae: 80, dre: 10, ue: 10 });
  });

  it("devolve zeros quando não há usuários", async () => {
    mockBffGet.mockResolvedValue({
      usuarios: {
        por_tipo_perfil: { codae: 0, dre: 0, ue: 0, empresa: 0 },
      },
    });

    const res = await fetchUsuariosPorTipoPerfil();

    expect(res).toEqual({ codae: 0, dre: 0, ue: 0 });
  });
});
