import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSonarQualityMetrics } from "./useSonarQualityMetrics";

const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: Infinity } },
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

describe("useSonarQualityMetrics", () => {
  it("não faz fetch quando projectName é vazio", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch");

    const { result } = renderHook(
      () => useSonarQualityMetrics({ projectName: "" }),
      { wrapper },
    );

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });
    expect(result.current.isFetching).toBe(false);
  });

  it("faz fetch com sucesso e propaga todos os parâmetros incluindo environment", async () => {
    const wrapper = createWrapper();
    const mockData = {
      found: true,
      data: { projectKey: "SME-Plateia" },
    };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useSonarQualityMetrics({
          projectName: "Plateia",
          sonarProjectKey: "custom",
          zabbixQueryJenkinsJob: "SME-Plateia/master",
          environment: "homologacao",
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = fetchSpy.mock.calls[0][0] as string;
    expect(url).toContain("projectName=Plateia");
    expect(url).toContain("sonarProjectKey=custom");
    expect(url).toContain("zabbixQueryJenkinsJob=SME-Plateia%2Fmaster");
    expect(url).toContain("environment=homologacao");
    expect(result.current.data).toEqual(mockData);
  });

  it("omite parâmetros opcionais ausentes na query string", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ found: false, message: "x" }),
    } as unknown as Response);

    const { result } = renderHook(
      () => useSonarQualityMetrics({ projectName: "Plateia" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const url = fetchSpy.mock.calls[0][0] as string;
    expect(url).not.toContain("sonarProjectKey");
    expect(url).not.toContain("zabbixQueryJenkinsJob");
    expect(url).not.toContain("environment");
  });

  it("lança erro quando res.ok === false", async () => {
    const wrapper = createWrapper();
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const { result } = renderHook(
      () => useSonarQualityMetrics({ projectName: "Plateia" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toMatch(/Sonar/);
  });
});
