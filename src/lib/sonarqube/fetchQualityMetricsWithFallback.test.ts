import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({
  SonarBranchNotFoundError: class SonarBranchNotFoundError extends Error {
    constructor(public readonly branch: string, public readonly projectKey: string) {
      super(`Branch '${branch}' não encontrada no projeto '${projectKey}'`);
      this.name = "SonarBranchNotFoundError";
    }
  },
}));

vi.mock("./fetchQualityMetrics", () => ({
  fetchQualityMetrics: vi.fn(),
}));

import { fetchQualityMetricsWithFallback } from "./fetchQualityMetricsWithFallback";
import { fetchQualityMetrics } from "./fetchQualityMetrics";
import { SonarBranchNotFoundError } from "./client";

const mocked = vi.mocked(fetchQualityMetrics);

const sampleMetrics = {
  projectKey: "k",
  projectName: "n",
  qualityGate: { status: "OK", failedConditions: [] },
  measures: {
    bugs: 0,
    vulnerabilities: 0,
    codeSmells: 0,
    coverage: 0,
    duplicatedLinesDensity: 0,
    securityHotspots: 0,
    reliabilityRating: "A",
    securityRating: "A",
    sqaleRating: "A",
    securityReviewRating: "A",
    ncloc: 0,
    uncoveredLines: 0,
    acceptedIssues: 0,
  },
} as const;

describe("fetchQualityMetricsWithFallback", () => {
  beforeEach(() => {
    mocked.mockReset();
  });

  it("chama sem branch quando lista está vazia", async () => {
    mocked.mockResolvedValueOnce({ ...sampleMetrics } as never);
    const result = await fetchQualityMetricsWithFallback("k", []);

    expect(result.found).toBe(true);
    expect(mocked).toHaveBeenCalledWith("k");
    expect(result.triedBranches).toEqual([]);
  });

  it("retorna primeira branch que resolve", async () => {
    mocked.mockResolvedValueOnce({ ...sampleMetrics, branch: "master" } as never);

    const result = await fetchQualityMetricsWithFallback("k", ["master", "main"]);

    expect(result.found).toBe(true);
    expect(mocked).toHaveBeenCalledTimes(1);
    expect(mocked).toHaveBeenCalledWith("k", "master");
    expect(result.triedBranches).toEqual(["master"]);
  });

  it("faz fallback master→main quando master não existe", async () => {
    mocked
      .mockRejectedValueOnce(new SonarBranchNotFoundError("master", "k"))
      .mockResolvedValueOnce({ ...sampleMetrics, branch: "main" } as never);

    const result = await fetchQualityMetricsWithFallback("k", ["master", "main"]);

    expect(result.found).toBe(true);
    expect(mocked).toHaveBeenCalledTimes(2);
    expect(mocked).toHaveBeenNthCalledWith(1, "k", "master");
    expect(mocked).toHaveBeenNthCalledWith(2, "k", "main");
    expect(result.triedBranches).toEqual(["master", "main"]);
  });

  it("retorna found=false quando todas as branches falham com BranchNotFound", async () => {
    mocked
      .mockRejectedValueOnce(new SonarBranchNotFoundError("master", "k"))
      .mockRejectedValueOnce(new SonarBranchNotFoundError("main", "k"));

    const result = await fetchQualityMetricsWithFallback("k", ["master", "main"]);

    expect(result.found).toBe(false);
    if (!result.found) {
      expect(result.triedBranches).toEqual(["master", "main"]);
    }
  });

  it("propaga erros não relacionados a branch", async () => {
    mocked.mockRejectedValueOnce(new Error("network"));

    await expect(
      fetchQualityMetricsWithFallback("k", ["master"]),
    ).rejects.toThrow(/network/);
  });
});
