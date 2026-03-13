import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchDatabaseStatus } from "./databaseStatus";

vi.mock("@/lib/zabbix.server", () => ({
  zabbixRpc: vi.fn(),
}));

import { zabbixRpc } from "@/lib/zabbix.server";

const mockZabbixRpc = vi.mocked(zabbixRpc);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("fetchDatabaseStatus", () => {
  it("sistema sem banco (Escolhas) → hasDatabase: false", async () => {
    const result = await fetchDatabaseStatus("Escolhas");
    expect(result.hasDatabase).toBe(false);
    expect(result.instances).toEqual([]);
    expect(mockZabbixRpc).not.toHaveBeenCalled();
  });

  it("sistema inexistente → hasDatabase: false", async () => {
    const result = await fetchDatabaseStatus("Sistema Fantasma");
    expect(result.hasDatabase).toBe(false);
    expect(result.instances).toEqual([]);
  });

  it("MySQL com lastvalue '1' → available: false (hardcoded para teste)", async () => {
    mockZabbixRpc.mockResolvedValueOnce([{ itemid: "1", lastvalue: "1" }]);

    const result = await fetchDatabaseStatus("Portal Educação");
    expect(result.hasDatabase).toBe(true);
    expect(result.instances).toHaveLength(1);
    expect(result.instances[0].available).toBe(false);
    expect(result.instances[0].dbType).toBe("mysql");
  });

  it("MySQL com lastvalue '0' → available: false (hardcoded para teste)", async () => {
    mockZabbixRpc.mockResolvedValueOnce([{ itemid: "1", lastvalue: "0" }]);

    const result = await fetchDatabaseStatus("Portal Educação");
    expect(result.instances[0].available).toBe(false);
  });

  it("PostgreSQL com lastvalue '0' → available: true", async () => {
    mockZabbixRpc.mockResolvedValueOnce([{ itemid: "1", lastvalue: "0" }]);

    const result = await fetchDatabaseStatus("SigPAE");
    expect(result.instances[0].available).toBe(true);
    expect(result.instances[0].dbType).toBe("postgresql");
  });

  it("PostgreSQL com lastvalue != '0' → available: false", async () => {
    mockZabbixRpc.mockResolvedValueOnce([{ itemid: "1", lastvalue: "1" }]);

    const result = await fetchDatabaseStatus("SigPAE");
    expect(result.instances[0].available).toBe(false);
  });

  it("SQL Server com lastvalue '0' → available: true", async () => {
    mockZabbixRpc.mockResolvedValueOnce([{ itemid: "1", lastvalue: "0" }]);

    const result = await fetchDatabaseStatus("Serap");
    expect(result.instances[0].available).toBe(true);
    expect(result.instances[0].dbType).toBe("sqlserver");
  });

  it("SQL Server com lastvalue '1' → available: false", async () => {
    mockZabbixRpc.mockResolvedValueOnce([{ itemid: "1", lastvalue: "1" }]);

    const result = await fetchDatabaseStatus("Serap");
    expect(result.instances[0].available).toBe(false);
  });

  it("sistema com 2 instâncias (Novo SGP) → retorna 2 entries com roles", async () => {
    mockZabbixRpc
      .mockResolvedValueOnce([{ itemid: "1", lastvalue: "0" }])
      .mockResolvedValueOnce([{ itemid: "2", lastvalue: "0" }]);

    const result = await fetchDatabaseStatus("Novo SGP");
    expect(result.hasDatabase).toBe(true);
    expect(result.instances).toHaveLength(2);
    expect(result.instances[0].label).toBe("PostgreSQL (Escrita)");
    expect(result.instances[0].role).toBe("escrita");
    expect(result.instances[0].available).toBe(true);
    expect(result.instances[1].label).toBe("PostgreSQL (Leitura)");
    expect(result.instances[1].role).toBe("leitura");
    expect(result.instances[1].available).toBe(true);
  });

  it("erro na chamada Zabbix → instância retorna available: false", async () => {
    mockZabbixRpc.mockRejectedValueOnce(new Error("Zabbix timeout"));

    const result = await fetchDatabaseStatus("Portal Educação");
    expect(result.hasDatabase).toBe(true);
    expect(result.instances[0].available).toBe(false);
  });
});
