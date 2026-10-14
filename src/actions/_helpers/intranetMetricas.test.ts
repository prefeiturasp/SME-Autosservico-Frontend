vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import {
  fetchOportunidades,
  fetchOrdemInscricaoPorDre,
  fetchOrdemInscricaoPorGanhador,
  fetchOrdemInscricaoPorTipo,
  fetchOrdemInscricaoStatusGeral,
  fetchSorteiosPorDre,
  fetchSorteiosPorGanhador,
  fetchSorteiosPorTipo,
  fetchSorteiosStatusGeral,
  resolverParametros,
} from "./intranetMetricas";

const mockBffGet = vi.mocked(bffGet);

const CAMINHO_GERAL = "/api/v1/intranet/metricas/?periodo=geral";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("resolverParametros", () => {
  it("lê periodo e mes válidos da query", () => {
    expect(
      resolverParametros(new URLSearchParams("periodo=quinzena&mes=2026-03")),
    ).toEqual({ periodo: "quinzena", mes: "2026-03" });
  });

  it("cai em 'geral' e sem mês quando ausentes", () => {
    expect(resolverParametros(new URLSearchParams())).toEqual({
      periodo: "geral",
      mes: null,
    });
  });

  it("descarta valores que o BFF recusaria", () => {
    expect(
      resolverParametros(new URLSearchParams("periodo=semana&mes=2026-13")),
    ).toEqual({ periodo: "geral", mes: null });
  });
});

describe("fetchSorteiosStatusGeral", () => {
  it("mapeia o status geral no período geral", async () => {
    mockBffGet.mockResolvedValue({
      sorteios: {
        status_geral: { cadastrados: 30, realizados: 15, ativos: 0, encerrados: 15 },
      },
    });

    const res = await fetchSorteiosStatusGeral();

    expect(mockBffGet).toHaveBeenCalledWith(CAMINHO_GERAL);
    expect(res.items).toEqual([
      { label: "Cadastrados", value: 30, variant: "neutral" },
      { label: "Realizados", value: 15, variant: "success" },
      { label: "Ativos", value: 0, variant: "warning" },
      { label: "Encerrados", value: 15, variant: "danger" },
    ]);
  });

  it("cai para 0 quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ sorteios: null });

    const res = await fetchSorteiosStatusGeral();

    expect(res.items.map((i) => i.value)).toEqual([0, 0, 0, 0]);
  });
});

describe("fetchOrdemInscricaoStatusGeral", () => {
  it("mapeia o status geral sem o item 'Realizados'", async () => {
    mockBffGet.mockResolvedValue({
      ordem_inscricao: {
        status_geral: { cadastrados: 6, ativos: 0, encerrados: 6 },
      },
    });

    const res = await fetchOrdemInscricaoStatusGeral();

    expect(mockBffGet).toHaveBeenCalledWith(CAMINHO_GERAL);
    expect(res.items).toEqual([
      { label: "Cadastrados", value: 6, variant: "neutral" },
      { label: "Ativos", value: 0, variant: "warning" },
      { label: "Encerrados", value: 6, variant: "danger" },
    ]);
  });

  it("cai para 0 quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ ordem_inscricao: null });

    const res = await fetchOrdemInscricaoStatusGeral();

    expect(res.items.map((i) => i.value)).toEqual([0, 0, 0]);
  });
});

describe("fetchOportunidades", () => {
  it("mapeia oportunidades, CVs, inscrições e contratações", async () => {
    mockBffGet.mockResolvedValue({
      oportunidades: {
        cadastradas: 2,
        cvs_cadastrados: 3,
        inscricoes_realizadas: 3,
        contratacoes_efetivadas: 0,
      },
    });

    const res = await fetchOportunidades();

    expect(mockBffGet).toHaveBeenCalledWith(CAMINHO_GERAL);
    expect(res.items).toEqual([
      { label: "Oportunidades cadastradas", value: 2, variant: "neutral" },
      { label: "CVs cadastrados", value: 3, variant: "neutral" },
      { label: "Inscrições realizadas", value: 3, variant: "warning" },
      { label: "Contratações efetivadas", value: 0, variant: "success" },
    ]);
  });

  it("cai para 0 quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ oportunidades: null });

    const res = await fetchOportunidades();

    expect(res.items.map((i) => i.value)).toEqual([0, 0, 0, 0]);
  });
});

describe.each([
  { nome: "fetchSorteiosPorDre", fetcher: fetchSorteiosPorDre, bloco: "sorteios" },
  { nome: "fetchOrdemInscricaoPorDre", fetcher: fetchOrdemInscricaoPorDre, bloco: "ordem_inscricao" },
])("$nome", ({ fetcher, bloco }) => {
  it("lista as 13 DREs, com 0 nas que não tiveram inscrição", async () => {
    mockBffGet.mockResolvedValue({
      [bloco]: {
        por_dre: [
          { label: "DRE Itaquera", value: 1 },
          { label: "SME", value: 1 },
        ],
      },
    });

    const res = await fetcher({ periodo: "mes", mes: "2026-07" });

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/intranet/metricas/?periodo=mes&mes=2026-07",
    );
    expect(res.slice(0, 2)).toEqual([
      { label: "DRE Itaquera", value: 1 },
      { label: "SME", value: 1 },
    ]);
    expect(res).toHaveLength(14);
    expect(res).toContainEqual({ label: "DRE Butantã", value: 0 });
    expect(res.filter((l) => l.label === "DRE Itaquera")).toHaveLength(1);
  });

  it("não duplica DRE com grafia diferente da lista padrão", async () => {
    mockBffGet.mockResolvedValue({
      [bloco]: {
        por_dre: [{ label: "DRE Freguesia/Brasilândia", value: 3 }],
      },
    });

    const res = await fetcher({ periodo: "geral", mes: null });

    expect(res).toHaveLength(13);
    expect(res.filter((l) => l.label.includes("Freguesia"))).toEqual([
      { label: "DRE Freguesia/Brasilândia", value: 3 },
    ]);
  });

  it("lista as 13 DREs zeradas quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ [bloco]: null });

    const res = await fetcher({ periodo: "geral", mes: null });

    expect(res).toHaveLength(13);
    expect(res.every((l) => l.value === 0)).toBe(true);
  });
});

const LINHAS = [
  { label: "DRE Pirituba", value: 8 },
  { label: "DRE Penha", value: 3 },
];

describe.each([
  { nome: "fetchSorteiosPorTipo", fetcher: fetchSorteiosPorTipo, bloco: "sorteios", campo: "por_tipo" },
  { nome: "fetchSorteiosPorGanhador", fetcher: fetchSorteiosPorGanhador, bloco: "sorteios", campo: "por_ganhador" },
  { nome: "fetchOrdemInscricaoPorTipo", fetcher: fetchOrdemInscricaoPorTipo, bloco: "ordem_inscricao", campo: "por_tipo" },
  { nome: "fetchOrdemInscricaoPorGanhador", fetcher: fetchOrdemInscricaoPorGanhador, bloco: "ordem_inscricao", campo: "por_ganhador" },
])("$nome", ({ fetcher, bloco, campo }) => {
  it("busca com o período informado e devolve as linhas", async () => {
    mockBffGet.mockResolvedValue({ [bloco]: { [campo]: LINHAS } });

    const res = await fetcher({ periodo: "mes", mes: null });

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/intranet/metricas/?periodo=mes",
    );
    expect(res).toEqual(LINHAS);
  });

  it("repassa o mês quando informado", async () => {
    mockBffGet.mockResolvedValue({ [bloco]: { [campo]: LINHAS } });

    await fetcher({ periodo: "geral", mes: "2026-03" });

    expect(mockBffGet).toHaveBeenCalledWith(
      "/api/v1/intranet/metricas/?periodo=geral&mes=2026-03",
    );
  });

  it("devolve lista vazia quando o bloco vem null", async () => {
    mockBffGet.mockResolvedValue({ [bloco]: null });

    expect(await fetcher({ periodo: "geral", mes: null })).toEqual([]);
  });
});
