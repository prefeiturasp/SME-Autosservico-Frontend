import { describe, it, expect, vi, beforeEach } from "vitest";

describe("Axios Instance", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  it("deve configurar a baseURL a partir da variável de ambiente", async () => {
    const mockUrl = "https://api.test.com";
    process.env.AUTENTICA_CORESSO_API_URL = mockUrl;

    const { autenticaCoreSSO } = await import("@/lib/axios");

    // Verificações corrigidas
    expect(autenticaCoreSSO.defaults.baseURL).toBe(mockUrl);
    expect(autenticaCoreSSO.defaults.timeout).toBe(0); // Valor padrão do Axios
  });

  it("deve ter baseURL undefined quando variável não está definida", async () => {
    delete process.env.AUTENTICA_CORESSO_API_URL;

    const { autenticaCoreSSO } = await import("@/lib/axios");

    expect(autenticaCoreSSO.defaults.baseURL).toBeUndefined();
  });

  it("deve manter outras configurações padrão do Axios", async () => {
    process.env.AUTENTICA_CORESSO_API_URL = "https://api.test.com";

    const { autenticaCoreSSO } = await import("@/lib/axios");

    // Verificações realistas
    expect(autenticaCoreSSO.defaults.timeout).toBe(0);
    expect(autenticaCoreSSO.defaults.headers).toBeInstanceOf(Object);
    expect(autenticaCoreSSO.defaults.headers.common).toHaveProperty("Accept", "application/json, text/plain, */*");
  });
});
