import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({
  searchComponents: vi.fn(),
}));

import {
  resolveProjectKey,
  clearResolveProjectKeyCache,
  __test__,
} from "./resolveProjectKey";
import { searchComponents } from "./client";

const mockedSearch = vi.mocked(searchComponents);

function withComponents(components: Array<{ key: string; name: string }>) {
  return {
    paging: { pageIndex: 1, pageSize: 20, total: components.length },
    components: components.map((c) => ({ ...c, qualifier: "TRK" })),
  };
}

describe("__test__.pickBestMatch", () => {
  it("retorna null quando lista vazia", () => {
    expect(__test__.pickBestMatch([], "X")).toBeNull();
  });

  it("retorna o único componente quando há apenas um", () => {
    const only = [{ key: "k1", name: "n1", qualifier: "TRK" }];
    expect(__test__.pickBestMatch(only, "X")).toBe("k1");
  });

  it("prioriza chave que começa com a base derivada", () => {
    const components = [
      { key: "outro-projeto", name: "Outro", qualifier: "TRK" },
      { key: "SME-SIGPAE-Backend", name: "Backend", qualifier: "TRK" },
      { key: "SME-SIGPAE-FrontEnd", name: "Frontend", qualifier: "TRK" },
    ];
    expect(__test__.pickBestMatch(components, "SME-SIGPAE")).toBe("SME-SIGPAE-FrontEnd");
  });

  it("prefere match Frontend quando há múltiplos com mesma base", () => {
    const components = [
      { key: "SME-X-Backend", name: "X Back", qualifier: "TRK" },
      { key: "SME-X-FrontEnd", name: "X Front", qualifier: "TRK" },
    ];
    expect(__test__.pickBestMatch(components, "SME-X")).toBe("SME-X-FrontEnd");
  });

  it("retorna primeiro item quando nenhum tem 'front' no nome", () => {
    const components = [
      { key: "SME-Y-Backend", name: "Y Back", qualifier: "TRK" },
      { key: "SME-Y-Worker", name: "Y Worker", qualifier: "TRK" },
    ];
    expect(__test__.pickBestMatch(components, "SME-Y")).toBe("SME-Y-Backend");
  });
});

describe("resolveProjectKey", () => {
  beforeEach(() => {
    clearResolveProjectKeyCache();
    mockedSearch.mockReset();
  });

  it("usa sonarProjectKey quando exato e encontrado", async () => {
    mockedSearch.mockResolvedValueOnce(
      withComponents([{ key: "custom-key", name: "X" }]),
    );

    const result = await resolveProjectKey({
      projectName: "Plateia",
      sonarProjectKey: "custom-key",
    });

    expect(result).toBe("custom-key");
    expect(mockedSearch).toHaveBeenCalledWith("custom-key");
  });

  it("deriva do zabbixQueryJenkinsJob e encontra match exato (SME-Plateia)", async () => {
    mockedSearch.mockResolvedValueOnce(
      withComponents([{ key: "SME-Plateia", name: "Plateia" }]),
    );

    const result = await resolveProjectKey({
      projectName: "Plateia",
      zabbixQueryJenkinsJob: "SME-Plateia/master",
    });

    expect(result).toBe("SME-Plateia");
  });

  it("escolhe melhor match (Frontend) quando chave derivada é prefixo", async () => {
    mockedSearch.mockResolvedValueOnce(
      withComponents([
        { key: "SME-SIGPAE-Backend", name: "Backend" },
        { key: "SME-SIGPAE-FrontEnd", name: "FrontEnd" },
      ]),
    );

    const result = await resolveProjectKey({
      projectName: "SigPAE",
      zabbixQueryJenkinsJob: "SME-SIGPAE/master",
    });

    expect(result).toBe("SME-SIGPAE-FrontEnd");
  });

  it("fallback para busca por nome do projeto quando Jenkins não encontra", async () => {
    mockedSearch
      .mockResolvedValueOnce(withComponents([]))
      .mockResolvedValueOnce(withComponents([{ key: "found-by-name", name: "Plateia" }]));

    const result = await resolveProjectKey({
      projectName: "Plateia",
      zabbixQueryJenkinsJob: "SME-Inexistente/master",
    });

    expect(result).toBe("found-by-name");
    expect(mockedSearch).toHaveBeenCalledTimes(2);
    expect(mockedSearch).toHaveBeenNthCalledWith(1, "SME-Inexistente");
    expect(mockedSearch).toHaveBeenNthCalledWith(2, "Plateia");
  });

  it("retorna null quando nada é encontrado", async () => {
    mockedSearch.mockResolvedValue(withComponents([]));

    const result = await resolveProjectKey({
      projectName: "Inexistente",
      zabbixQueryJenkinsJob: "SME-Inexistente/master",
    });

    expect(result).toBeNull();
  });

  it("cacheia resultado entre chamadas idênticas", async () => {
    mockedSearch.mockResolvedValueOnce(
      withComponents([{ key: "SME-Plateia", name: "Plateia" }]),
    );

    const a = await resolveProjectKey({
      projectName: "Plateia",
      zabbixQueryJenkinsJob: "SME-Plateia/master",
    });
    const b = await resolveProjectKey({
      projectName: "Plateia",
      zabbixQueryJenkinsJob: "SME-Plateia/master",
    });

    expect(a).toBe("SME-Plateia");
    expect(b).toBe("SME-Plateia");
    expect(mockedSearch).toHaveBeenCalledTimes(1);
  });

  it("ignora erros do client e continua para próximo fallback", async () => {
    mockedSearch
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(withComponents([{ key: "n-key", name: "Plateia" }]));

    const result = await resolveProjectKey({
      projectName: "Plateia",
      zabbixQueryJenkinsJob: "SME-Plateia/master",
    });

    expect(result).toBe("n-key");
  });
});
