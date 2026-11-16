import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("jose", () => ({
  importPKCS8: vi.fn().mockResolvedValue({}),
  SignJWT: class {
    setProtectedHeader() { return this; }
    setIssuer() { return this; }
    setAudience() { return this; }
    setIssuedAt() { return this; }
    setExpirationTime() { return this; }
    async sign() { return "jwt-assinado"; }
  },
}));

import {
  AnalyticsNaoConfiguradoError,
  resetGoogleAnalyticsCache,
  runRealtimeReport,
  runReport,
} from "./client.server";

const CREDENCIAL = Buffer.from(
  JSON.stringify({
    client_email: "sa@projeto.iam.gserviceaccount.com",
    private_key: "chave",
    token_uri: "https://oauth2.example/token",
  }),
).toString("base64");

const respostaToken = { ok: true, json: async () => ({ access_token: "tok", expires_in: 3600 }) };
const respostaRelatorio = {
  ok: true,
  json: async () => ({
    rows: [{ dimensionValues: [{ value: "desktop" }], metricValues: [{ value: "42" }] }],
  }),
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  resetGoogleAnalyticsCache();
  vi.stubEnv("GA_SGP_PROPERTY_ID", "123");
  vi.stubEnv("GA_SGP_CREDENTIALS_BASE64", CREDENCIAL);
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("cliente do Google Analytics", () => {
  it("autentica com a service account e converte as linhas do relatório", async () => {
    fetchMock.mockResolvedValueOnce(respostaToken).mockResolvedValueOnce(respostaRelatorio);

    const rows = await runReport("SGP", { metrics: [{ name: "activeUsers" }] });

    expect(rows).toEqual([{ dimensions: ["desktop"], metrics: [42] }]);
    expect(fetchMock.mock.calls[0][0]).toBe("https://oauth2.example/token");
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://analyticsdata.googleapis.com/v1beta/properties/123:runReport",
    );
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBe("Bearer tok");
  });

  it("reaproveita o token e o resultado em cache", async () => {
    fetchMock
      .mockResolvedValueOnce(respostaToken)
      .mockResolvedValueOnce(respostaRelatorio)
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) });

    await runReport("SGP", { a: 1 });
    await runReport("SGP", { a: 1 });
    const realtime = await runRealtimeReport("SGP", { a: 1 });

    expect(realtime).toEqual([]);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2][0]).toContain(":runRealtimeReport");
  });

  it("não guarda em cache uma consulta que falhou", async () => {
    fetchMock
      .mockResolvedValueOnce(respostaToken)
      .mockResolvedValueOnce({ ok: false, status: 403 })
      .mockResolvedValueOnce(respostaRelatorio);

    await expect(runReport("SGP", { a: 1 })).rejects.toThrow("respondeu 403");
    await expect(runReport("SGP", { a: 1 })).resolves.toHaveLength(1);
  });

  it("falha quando o Google recusa a autenticação", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 401 });
    await expect(runReport("SGP", {})).rejects.toThrow("Falha ao autenticar no Google (401)");
  });

  it("sinaliza sistema sem integração ou sem variáveis configuradas", async () => {
    await expect(runReport("GIPE", {})).rejects.toBeInstanceOf(AnalyticsNaoConfiguradoError);
    vi.stubEnv("GA_SGP_PROPERTY_ID", "");
    await expect(runReport("SGP", {})).rejects.toThrow("GA_SGP_PROPERTY_ID");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
