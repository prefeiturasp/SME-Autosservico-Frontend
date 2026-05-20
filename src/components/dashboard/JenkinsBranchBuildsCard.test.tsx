import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { UseQueryResult } from "@tanstack/react-query";
import JenkinsBranchBuildsCard from "./JenkinsBranchBuildsCard";
import type { JenkinsMetricsApiResponse } from "@/types/jenkins-metrics";

function query(
  partial: Partial<UseQueryResult<JenkinsMetricsApiResponse, unknown>>,
): UseQueryResult<JenkinsMetricsApiResponse, unknown> {
  return {
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...partial,
  } as unknown as UseQueryResult<JenkinsMetricsApiResponse, unknown>;
}

describe("<JenkinsBranchBuildsCard />", () => {
  it("renderiza métricas no layout do Figma", () => {
    render(
      <JenkinsBranchBuildsCard
        projectName="SME-NovoSGP/master"
        query={query({
          data: {
            found: true,
            data: {
              jobName: "master",
              jobUrl: "https://jenkins.example",
              status: "SUCCESS",
              stabilityPercent: 100,
              lastBuild: {
                number: 53,
                status: "SUCCESS",
                timestampMs: Date.now(),
                timestamp: "01/01/2024 13:37",
                durationMs: 48 * 60 * 1000,
                duration: "48 min",
              },
              lastSuccessfulBuild: {
                number: 53,
                status: "SUCCESS",
                timestampMs: Date.now(),
                timestamp: "01/01/2024 13:37",
                durationMs: 48 * 60 * 1000,
                duration: "48 min",
              },
              lastFailedBuild: {
                number: 42,
                status: "FAILURE",
                timestampMs: new Date(2026, 2, 27, 9, 51).getTime(),
                timestamp: "27/03/2026 09:51",
                durationMs: 1000,
                duration: "1s",
              },
            },
          },
        })}
      />,
    );

    expect(screen.getByText("Jenkins - Branches e Builds")).toBeInTheDocument();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Estabilidade")).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText("Último sucesso")).toBeInTheDocument();
    expect(screen.getAllByText("#53")).toHaveLength(2);
    expect(screen.getByText("Última falha")).toBeInTheDocument();
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("Build atual")).toBeInTheDocument();
    expect(screen.getByText("48 min")).toBeInTheDocument();
    expect(screen.getByText("concluído")).toBeInTheDocument();
  });
});
