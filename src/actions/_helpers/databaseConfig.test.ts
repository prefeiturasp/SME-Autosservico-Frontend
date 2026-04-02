import { describe, it, expect } from "vitest";
import { getDatabaseConfigForSystem, systemHasNoDatabase } from "./databaseConfig";

describe("getDatabaseConfigForSystem", () => {
  it("retorna config correta para sistema MySQL (Portal Educação)", () => {
    const config = getDatabaseConfigForSystem("Portal Educação");
    expect(config).not.toBeNull();
    expect(config).toHaveLength(1);
    expect(config![0].dbType).toBe("mysql");
    expect(config![0].hostid).toBe("10641");
    expect(config![0].key).toBe("mysql.ping");
  });

  it("retorna config correta para sistema PostgreSQL com role (Novo SGP → 2 entries)", () => {
    const config = getDatabaseConfigForSystem("Novo SGP");
    expect(config).not.toBeNull();
    expect(config).toHaveLength(2);
    expect(config![0].dbType).toBe("postgresql");
    expect(config![0].role).toBe("escrita");
    expect(config![0].label).toBe("PostgreSQL (Escrita)");
    expect(config![1].role).toBe("leitura");
    expect(config![1].label).toBe("PostgreSQL (Leitura)");
  });

  it("retorna config correta para SQL Server (Serap)", () => {
    const config = getDatabaseConfigForSystem("Serap");
    expect(config).not.toBeNull();
    expect(config).toHaveLength(1);
    expect(config![0].dbType).toBe("sqlserver");
    expect(config![0].hostid).toBe("10711");
  });

  it("retorna null para sistema sem banco (Escolhas)", () => {
    const config = getDatabaseConfigForSystem("Escolhas");
    expect(config).toBeNull();
  });

  it("retorna null para sistema inexistente", () => {
    const config = getDatabaseConfigForSystem("Sistema Fantasma");
    expect(config).toBeNull();
  });
});

describe("systemHasNoDatabase", () => {
  it("retorna true para Escolhas (config vazia)", () => {
    expect(systemHasNoDatabase("Escolhas")).toBe(true);
  });

  it("retorna false para sistema inexistente", () => {
    expect(systemHasNoDatabase("Sistema Fantasma")).toBe(false);
  });

  it("retorna false para sistema com banco", () => {
    expect(systemHasNoDatabase("Novo SGP")).toBe(false);
  });
});

describe("isOk validation rules", () => {
  it("MySQL: lastvalue '1' → true, '0' → false", () => {
    const config = getDatabaseConfigForSystem("Portal Educação")!;
    expect(config[0].isOk("1")).toBe(true);
    expect(config[0].isOk("0")).toBe(false);
  });

  it("PostgreSQL: lastvalue '0' → true, '1' → false", () => {
    const config = getDatabaseConfigForSystem("SigPAE")!;
    expect(config[0].isOk("0")).toBe(true);
    expect(config[0].isOk("1")).toBe(false);
  });

  it("SQL Server: lastvalue '0' → true, '1' → false", () => {
    const config = getDatabaseConfigForSystem("Serap")!;
    expect(config[0].isOk("0")).toBe(true);
    expect(config[0].isOk("1")).toBe(false);
  });
});
