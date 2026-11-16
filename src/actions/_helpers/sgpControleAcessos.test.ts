vi.mock("server-only", () => ({}));
vi.mock("@/lib/bff.server", () => ({ bffGet: vi.fn() }));

import { bffGet } from "@/lib/bff.server";
import {
  fetchControleAcessos,
  fetchSerieAcessos,
  resolverGranularidade,
} from "./sgpControleAcessos";

const mockBffGet = vi.mocked(bffGet);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchControleAcessos", () => {
  it("mapeia o estado atual do BFF", async () => {
    mockBffGet.mockResolvedValue({
      atualizado_em: "2026-11-10T09:30:00-03:00",
      limite_conexoes: 5000,
      conectados: { total: 6467, sgp: 6400, sondagem: 67 },
      em_fila: 1467,
      fila_iniciada_em: "2026-11-10T07:41:00-03:00",
      tempo_espera_estimado: {
        media_s: 350,
        posicao_media: 8,
        testes: 2,
        atingiu_limite_teste: true,
      },
    });

    const res = await fetchControleAcessos();

    expect(mockBffGet).toHaveBeenCalledWith("/api/v1/zabbix/sgp/controle-acessos/");
    expect(res).toEqual({
      atualizadoEm: "2026-11-10T09:30:00-03:00",
      limiteConexoes: 5000,
      conectados: 6467,
      emFila: 1467,
      filaIniciadaEm: "2026-11-10T07:41:00-03:00",
      tempoEspera: {
        mediaSegundos: 350,
        posicaoMedia: 8,
        testes: 2,
        atingiuLimiteTeste: true,
      },
    });
  });

  it("preserva os nulos do cache frio", async () => {
    mockBffGet.mockResolvedValue({
      atualizado_em: null,
      limite_conexoes: null,
      conectados: null,
      em_fila: null,
      fila_iniciada_em: null,
      tempo_espera_estimado: null,
    });

    const res = await fetchControleAcessos();

    expect(res.conectados).toBeNull();
    expect(res.tempoEspera).toBeNull();
  });
});

describe("fetchSerieAcessos", () => {
  it.each([
    ["hora", "2026-11-10T08:00:00-03:00", "08:00"],
    ["dia", "2026-11-03T00:00:00-03:00", "03/11"],
    ["mes", "2026-06-01T00:00:00-03:00", "jun"],
    ["ano", "2026-01-01T00:00:00-03:00", "2026"],
  ] as const)("rotula os pontos por %s", async (granularidade, inicio, label) => {
    mockBffGet.mockResolvedValue({
      granularidade,
      atualizado_em: null,
      pontos: [{ inicio, total: 5100, em_fila_max: 100, fila_ativa: true }],
    });

    const res = await fetchSerieAcessos(granularidade);

    expect(mockBffGet).toHaveBeenCalledWith(
      `/api/v1/zabbix/sgp/controle-acessos/serie/?granularidade=${granularidade}`,
    );
    expect(res).toEqual({
      granularidade,
      pontos: [{ label, total: 5100, emFilaMax: 100, filaAtiva: true }],
    });
  });
});

describe("resolverGranularidade", () => {
  it("aceita as granularidades conhecidas e cai em hora", () => {
    expect(resolverGranularidade(new URLSearchParams("granularidade=mes"))).toBe("mes");
    expect(resolverGranularidade(new URLSearchParams("granularidade=semana"))).toBe("hora");
    expect(resolverGranularidade(new URLSearchParams())).toBe("hora");
  });
});
