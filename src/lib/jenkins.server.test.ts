import { describe, it, expect, vi, beforeEach } from "vitest";

let getMock: ReturnType<typeof vi.fn> | undefined;
let createMock: ReturnType<typeof vi.fn> | undefined;

vi.mock("axios", () => {
  getMock = vi.fn();
  createMock = vi.fn(() => ({ get: getMock }));
  return {
    default: {
      create: createMock,
    },
  };
});

describe("jenkins client", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.JENKINS_URL = "https://jenkins.example/";
    process.env.JENKINS_USERNAME = "reader";
    process.env.JENKINS_API_TOKEN = "token-123";
    delete process.env.JENKINS_TIMEOUT_MS;
    getMock?.mockReset();
    createMock?.mockClear();
  });

  it("cria cliente com baseURL sem trailing slash e Basic Auth", async () => {
    const mod = await import("./jenkins.server");
    mod.jenkinsClient();

    expect(createMock).toHaveBeenCalledTimes(1);
    const config = createMock!.mock.calls[0][0] as Record<string, unknown>;
    expect(config.baseURL).toBe("https://jenkins.example");
    expect(config.timeout).toBe(10000);

    const headers = config.headers as Record<string, string>;
    expect(headers.Authorization).toBe(
      `Basic ${Buffer.from("reader:token-123").toString("base64")}`,
    );
    expect(headers.Accept).toBe("application/json");
  });

  it("converte fullName multibranch para path aninhado do Jenkins", async () => {
    const mod = await import("./jenkins.server");
    expect(mod.jenkinsFullNameToJobPath("SME-NovoSGP/master")).toBe(
      "/job/SME-NovoSGP/job/master",
    );
  });

  it("codifica segmentos do path sem perder a hierarquia", async () => {
    const mod = await import("./jenkins.server");
    expect(mod.jenkinsFullNameToJobPath("Pasta A/feature/teste 1")).toBe(
      "/job/Pasta%20A/job/feature/job/teste%201",
    );
  });

  it("fetchJenkinsJob consulta api/json com tree enxuto", async () => {
    const mod = await import("./jenkins.server");
    getMock!.mockResolvedValueOnce({ data: { name: "master" } });

    const res = await mod.fetchJenkinsJob("SME-NovoSGP/master");

    expect(getMock).toHaveBeenCalledWith("/job/SME-NovoSGP/job/master/api/json", {
      params: {
        tree: expect.stringContaining("healthReport[score,description]"),
      },
    });
    expect(res.name).toBe("master");
  });
});
