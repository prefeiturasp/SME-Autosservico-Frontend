import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/sonarqube/resolveProjectKey", () => ({
  resolveProjectKey: vi.fn(),
}));
vi.mock("@/lib/sonarqube/fetchQualityMetricsWithFallback", () => ({
  fetchQualityMetricsWithFallback: vi.fn(),
}));

import { GET } from "./route";
import { auth } from "@/lib/auth";
import { resolveProjectKey } from "@/lib/sonarqube/resolveProjectKey";
import { fetchQualityMetricsWithFallback } from "@/lib/sonarqube/fetchQualityMetricsWithFallback";
import type { NextRequest } from "next/server";

const mockedAuth = vi.mocked(auth);
const mockedResolve = vi.mocked(resolveProjectKey);
const mockedFetch = vi.mocked(fetchQualityMetricsWithFallback);

function makeReq(qs: string): NextRequest {
  return { url: `http://localhost/api/sonarqube/metrics?${qs}` } as unknown as NextRequest;
}

const sampleData = {
  projectKey: "SME-Plateia",
  projectName: "Plateia",
  qualityGate: { status: "OK", failedConditions: [] },
  measures: {
    bugs: 0,
    vulnerabilities: 0,
    codeSmells: 0,
    coverage: 90,
    duplicatedLinesDensity: 1,
    securityHotspots: 0,
    reliabilityRating: "A",
    securityRating: "A",
    sqaleRating: "A",
    securityReviewRating: "A",
    ncloc: 1000,
    uncoveredLines: 10,
    acceptedIssues: 0,
  },
} as const;

describe("GET /api/sonarqube/metrics", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedResolve.mockReset();
    mockedFetch.mockReset();
  });

  it("retorna 401 quando não autenticado", async () => {
    mockedAuth.mockResolvedValueOnce(null as never);
    const res = await GET(makeReq("projectName=Plateia"));
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("Unauthorized");
  });

  it("retorna 400 quando projectName ausente", async () => {
    mockedAuth.mockResolvedValueOnce({ user: { id: "1" } } as never);
    const res = await GET(makeReq(""));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/projectName/);
  });

  it("retorna 400 quando environment é inválido", async () => {
    mockedAuth.mockResolvedValueOnce({ user: { id: "1" } } as never);
    const res = await GET(makeReq("projectName=Plateia&environment=invalid"));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/environment/);
  });

  it("retorna found=false quando resolveProjectKey retorna null", async () => {
    mockedAuth.mockResolvedValueOnce({ user: { id: "1" } } as never);
    mockedResolve.mockResolvedValueOnce(null);

    const res = await GET(makeReq("projectName=Inexistente"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.found).toBe(false);
    expect(body.message).toMatch(/não encontrado/i);
  });

  it("retorna found=true com data e usa branches do ambiente selecionado", async () => {
    mockedAuth.mockResolvedValueOnce({ user: { id: "1" } } as never);
    mockedResolve.mockResolvedValueOnce("SME-SIGPAE-FrontEnd");
    mockedFetch.mockResolvedValueOnce({
      found: true,
      data: { ...sampleData, branch: "master" } as never,
      triedBranches: ["master"],
    });

    const res = await GET(makeReq("projectName=SigPAE&environment=producao"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.found).toBe(true);
    expect(body.data.branch).toBe("master");
    expect(mockedFetch).toHaveBeenCalledWith(
      "SME-SIGPAE-FrontEnd",
      ["master", "main"],
    );
  });

  it("retorna found=false com mensagem citando branches tentadas", async () => {
    mockedAuth.mockResolvedValueOnce({ user: { id: "1" } } as never);
    mockedResolve.mockResolvedValueOnce("SME-X");
    mockedFetch.mockResolvedValueOnce({
      found: false,
      triedBranches: ["master", "main"],
    });

    const res = await GET(makeReq("projectName=X&environment=producao"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.found).toBe(false);
    expect(body.message).toMatch(/master, main/);
  });

  it("retorna 500 quando fetchQualityMetricsWithFallback lança", async () => {
    mockedAuth.mockResolvedValueOnce({ user: { id: "1" } } as never);
    mockedResolve.mockResolvedValueOnce("SME-Plateia");
    mockedFetch.mockRejectedValueOnce(new Error("boom"));

    const res = await GET(makeReq("projectName=Plateia"));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("boom");
  });
});
