import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./client", () => ({
  fetchProjectStatus: vi.fn(),
  fetchMeasures: vi.fn(),
}));

import { fetchQualityMetrics, __test__ } from "./fetchQualityMetrics";
import { fetchProjectStatus, fetchMeasures } from "./client";

const mockedStatus = vi.mocked(fetchProjectStatus);
const mockedMeasures = vi.mocked(fetchMeasures);

describe("toRating", () => {
  it.each([
    [undefined, "A"],
    ["1", "A"],
    ["1.0", "A"],
    ["2", "B"],
    ["3", "C"],
    ["4", "D"],
    ["5", "E"],
    ["99", "E"],
  ])("valor '%s' → %s", (input, expected) => {
    expect(__test__.toRating(input)).toBe(expected);
  });
});

describe("toNumber", () => {
  it("retorna fallback quando valor é vazio/undefined/inválido", () => {
    expect(__test__.toNumber(undefined)).toBe(0);
    expect(__test__.toNumber("")).toBe(0);
    expect(__test__.toNumber("abc")).toBe(0);
  });

  it("converte strings numéricas", () => {
    expect(__test__.toNumber("42")).toBe(42);
    expect(__test__.toNumber("3.14")).toBe(3.14);
  });
});

describe("extractLastAnalysisDate", () => {
  it("retorna period.date quando presente", () => {
    expect(
      __test__.extractLastAnalysisDate({
        projectStatus: {
          status: "OK",
          conditions: [],
          period: { mode: "PREVIOUS_VERSION", date: "2026-01-01T00:00:00+0000" },
        },
      }),
    ).toBe("2026-01-01T00:00:00+0000");
  });

  it("usa periods[0].date como fallback", () => {
    expect(
      __test__.extractLastAnalysisDate({
        projectStatus: {
          status: "OK",
          conditions: [],
          periods: [{ date: "2025-12-31T00:00:00+0000" }],
        },
      }),
    ).toBe("2025-12-31T00:00:00+0000");
  });

  it("retorna undefined quando nenhum período presente", () => {
    expect(
      __test__.extractLastAnalysisDate({
        projectStatus: { status: "OK", conditions: [] },
      }),
    ).toBeUndefined();
  });
});

describe("fetchQualityMetrics", () => {
  beforeEach(() => {
    mockedStatus.mockReset();
    mockedMeasures.mockReset();
  });

  it("monta SonarQualityMetrics agregando status + measures", async () => {
    mockedStatus.mockResolvedValueOnce({
      projectStatus: {
        status: "ERROR",
        conditions: [
          { metricKey: "coverage", comparator: "LT", status: "ERROR", errorThreshold: "80", actualValue: "70" },
          { metricKey: "bugs", comparator: "GT", status: "OK" },
        ],
        period: { mode: "PREVIOUS_VERSION", date: "2026-05-12T10:00:00+0000" },
      },
    });
    mockedMeasures.mockResolvedValueOnce({
      component: {
        key: "SME-Foo",
        name: "Foo",
        branch: "master",
        measures: [
          { metric: "bugs", value: "1" },
          { metric: "vulnerabilities", value: "2" },
          { metric: "code_smells", value: "3" },
          { metric: "coverage", value: "70.5" },
          { metric: "duplicated_lines_density", value: "5.1" },
          { metric: "security_hotspots", value: "0" },
          { metric: "reliability_rating", value: "2" },
          { metric: "security_rating", value: "3" },
          { metric: "sqale_rating", value: "1" },
          { metric: "security_review_rating", value: "5" },
          { metric: "ncloc", value: "12345" },
          { metric: "uncovered_lines", value: "200" },
          { metric: "accepted_issues", value: "4" },
        ],
      },
    });

    const result = await fetchQualityMetrics("SME-Foo");

    expect(result.projectKey).toBe("SME-Foo");
    expect(result.projectName).toBe("Foo");
    expect(result.qualityGate.status).toBe("ERROR");
    expect(result.qualityGate.failedConditions).toHaveLength(1);
    expect(result.qualityGate.failedConditions[0].metricKey).toBe("coverage");
    expect(result.measures.bugs).toBe(1);
    expect(result.measures.coverage).toBe(70.5);
    expect(result.measures.reliabilityRating).toBe("B");
    expect(result.measures.securityRating).toBe("C");
    expect(result.measures.sqaleRating).toBe("A");
    expect(result.measures.securityReviewRating).toBe("E");
    expect(result.lastAnalysisAt).toBe("2026-05-12T10:00:00+0000");
    expect(result.branch).toBe("master");
  });

  it("propaga branch para client e exibe no resultado", async () => {
    mockedStatus.mockResolvedValueOnce({
      projectStatus: { status: "OK", conditions: [] },
    });
    mockedMeasures.mockResolvedValueOnce({
      component: { key: "k", name: "n", branch: "test", measures: [] },
    });

    const result = await fetchQualityMetrics("k", "test");

    expect(mockedStatus).toHaveBeenCalledWith("k", "test");
    expect(mockedMeasures).toHaveBeenCalledWith(
      "k",
      __test__.METRIC_KEYS,
      "test",
    );
    expect(result.branch).toBe("test");
  });

  it("usa branch do parâmetro quando component não traz", async () => {
    mockedStatus.mockResolvedValueOnce({
      projectStatus: { status: "OK", conditions: [] },
    });
    mockedMeasures.mockResolvedValueOnce({
      component: { key: "k", name: "n", measures: [] },
    });

    const result = await fetchQualityMetrics("k", "homolog");
    expect(result.branch).toBe("homolog");
  });

  it("lastAnalysisAt vem de periods[0] como fallback", async () => {
    mockedStatus.mockResolvedValueOnce({
      projectStatus: {
        status: "OK",
        conditions: [],
        periods: [{ date: "2026-01-01" }],
      },
    });
    mockedMeasures.mockResolvedValueOnce({
      component: { key: "k", name: "n", measures: [] },
    });

    const result = await fetchQualityMetrics("k");
    expect(result.lastAnalysisAt).toBe("2026-01-01");
  });

  it("retorna zeros e ratings A quando não há measures", async () => {
    mockedStatus.mockResolvedValueOnce({
      projectStatus: { status: "OK", conditions: [] },
    });
    mockedMeasures.mockResolvedValueOnce({
      component: { key: "k", name: "n", measures: [] },
    });

    const result = await fetchQualityMetrics("k");
    expect(result.measures.bugs).toBe(0);
    expect(result.measures.reliabilityRating).toBe("A");
    expect(result.lastAnalysisAt).toBeUndefined();
  });
});
