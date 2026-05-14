import { describe, it, expect, vi, beforeEach } from "vitest";

const fetchJenkinsJobMock = vi.fn();

vi.mock("@/lib/jenkins.server", () => ({
  fetchJenkinsJob: fetchJenkinsJobMock,
  isJenkinsNotFound: (error: unknown) =>
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404,
}));

describe("jenkins metrics action", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchJenkinsJobMock.mockReset();
  });

  it("busca master quando o projeto vem sem branch", async () => {
    const { getJenkinsBranchBuildMetrics } = await import("./jenkins-metrics");
    fetchJenkinsJobMock.mockResolvedValueOnce({
      name: "master",
      url: "https://jenkins.example/job/SME/job/master/",
      healthReport: [{ score: 80, description: "ok" }],
      lastBuild: { number: 10, result: "SUCCESS", duration: 48000, timestamp: 1711814400000 },
      lastSuccessfulBuild: {
        number: 10,
        result: "SUCCESS",
        duration: 48000,
        timestamp: 1711814400000,
      },
    });

    const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

    expect(fetchJenkinsJobMock).toHaveBeenCalledWith("SME-NovoSGP/master");
    expect(result.found).toBe(true);
    if (result.found) {
      expect(result.data.stabilityPercent).toBe(80);
      expect(result.data.status).toBe("SUCCESS");
      expect(result.data.lastBuild?.number).toBe(10);
    }
  });

  it("tenta branches de homologação quando ambiente é homolog", async () => {
    const { getJenkinsBranchBuildMetrics } = await import("./jenkins-metrics");
    fetchJenkinsJobMock
      .mockRejectedValueOnce({ response: { status: 404 } })
      .mockResolvedValueOnce({
        name: "hml",
        builds: [
          { number: 2, result: "SUCCESS", duration: 1000, timestamp: 1711814400000 },
          { number: 1, result: "FAILURE", duration: 1000, timestamp: 1711814300000 },
        ],
        lastBuild: { number: 2, result: "SUCCESS", duration: 1000, timestamp: 1711814400000 },
      });

    const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP", "homolog");

    expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(1, "SME-NovoSGP/homolog");
    expect(fetchJenkinsJobMock).toHaveBeenNthCalledWith(2, "SME-NovoSGP/homologacao");
    expect(result.found).toBe(true);
    if (result.found) expect(result.data.stabilityPercent).toBe(50);
  });

  it("retorna not found quando todos candidatos dão 404", async () => {
    const { getJenkinsBranchBuildMetrics } = await import("./jenkins-metrics");
    fetchJenkinsJobMock.mockRejectedValue({ response: { status: 404 } });

    const result = await getJenkinsBranchBuildMetrics("SME-NovoSGP");

    expect(result).toEqual({
      found: false,
      message: "Job não encontrado no Jenkins (tentado: SME-NovoSGP/master, SME-NovoSGP/main)",
    });
  });
});
