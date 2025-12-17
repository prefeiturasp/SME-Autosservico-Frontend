import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useJenkinsJob } from "./useJenkinsJob";

type JenkinsJobSummary = {
  lastBuild?: { number: number };
  lastSuccessfulBuild?: { number: number };
  lastFailedBuild?: { number: number };
};

const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Infinity },
      },
    });
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useJenkinsJob", () => {
  it("não faz fetch quando projectName é vazio (enabled = false)", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch");

    renderHook(
      () =>
        useJenkinsJob({
          endpoint: "/api/zabbix/jenkins/job",
          keyPrefix: "zabbix-jenkins-job",
          projectName: "",
        }),
      { wrapper }
    );

    await waitFor(() => expect(fetchSpy).not.toHaveBeenCalled());
  });

  it("faz fetch com sucesso (querystring com project)", async () => {
    const wrapper = createWrapper();
    const mockData: JenkinsJobSummary = { lastBuild: { number: 11 } };

    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useJenkinsJob({
          endpoint: "/api/zabbix/jenkins/job",
          keyPrefix: "zabbix-jenkins-job",
          projectName: "SME-NovoSGP-Docs/master",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = (fetchSpy.mock.calls[0][0] as string) || "";
    const calledInit = (fetchSpy.mock.calls[0][1] as RequestInit) || {};
    expect(calledUrl).toBe("/api/zabbix/jenkins/job?project=SME-NovoSGP-Docs%2Fmaster");
    expect(calledInit.cache).toBe("no-store");
    expect(result.current.data).toEqual(mockData);
  });

  it('retorna erro quando res.ok === false (Error("Falha ao buscar dados do Jenkins"))', async () => {
    const wrapper = createWrapper();

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useJenkinsJob({
          endpoint: "/api/zabbix/jenkins/job",
          keyPrefix: "zabbix-jenkins-job",
          projectName: "Projeto X/master",
        }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe("Falha ao buscar dados do Jenkins");
  });
});

