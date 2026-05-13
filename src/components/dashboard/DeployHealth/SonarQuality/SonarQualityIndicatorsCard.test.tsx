import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SonarMetricsApiResponse } from "@/types/sonarqube";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));
vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button data-testid="retry-button" {...rest}>
      {children}
    </button>
  ),
}));

type MockQueryResult = {
  data?: SonarMetricsApiResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult = {
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
};

vi.mock("@/hooks/useSonarQualityMetrics", () => ({
  useSonarQualityMetrics: () => mockQueryResult,
}));

import SonarQualityIndicatorsCard from "./SonarQualityIndicatorsCard";

const fullSuccess: SonarMetricsApiResponse = {
  found: true,
  data: {
    projectKey: "SME-Plateia",
    projectName: "Plateia",
    branch: "master",
    qualityGate: {
      status: "ERROR",
      failedConditions: [
        { metricKey: "coverage", comparator: "LT", status: "ERROR" },
      ],
    },
    measures: {
      bugs: 2,
      vulnerabilities: 1,
      codeSmells: 7,
      coverage: 75.5,
      duplicatedLinesDensity: 3.2,
      securityHotspots: 4,
      reliabilityRating: "B",
      securityRating: "C",
      sqaleRating: "A",
      securityReviewRating: "E",
      ncloc: 12345,
      uncoveredLines: 1200,
      acceptedIssues: 6,
    },
    lastAnalysisAt: "2026-05-12T10:00:00+0000",
  },
};

describe("<SonarQualityIndicatorsCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem projectName → mostra 'Selecione um projeto'", () => {
    render(<SonarQualityIndicatorsCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading → mostra skeleton", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<SonarQualityIndicatorsCard projectName="Plateia" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  it("erro → mostra mensagem + botão de retry funcional", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<SonarQualityIndicatorsCard projectName="Plateia" />);

    expect(
      screen.getByText("Não foi possível carregar as métricas do SonarQube."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("projeto não encontrado no Sonar → mostra mensagem amigável", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { found: false, message: "Projeto não encontrado no SonarQube" },
    };
    render(<SonarQualityIndicatorsCard projectName="X" />);
    expect(
      screen.getByText(/Projeto não encontrado no SonarQube/),
    ).toBeInTheDocument();
  });

  it("sucesso → renderiza quality gate, métricas, ratings e rodapé", () => {
    mockQueryResult = { ...mockQueryResult, data: fullSuccess };
    render(<SonarQualityIndicatorsCard projectName="Plateia" />);

    expect(screen.getByText("SonarQube - Indicadores de qualidade")).toBeInTheDocument();
    expect(screen.getByText("Reprovado")).toBeInTheDocument();
    expect(screen.getByText("1 critério com falha")).toBeInTheDocument();

    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText("Cobertura de testes")).toBeInTheDocument();
    expect(screen.getByText("Código duplicado")).toBeInTheDocument();
    expect(screen.getByText("Vulnerabilidades")).toBeInTheDocument();
    expect(screen.getByText("Code Smells")).toBeInTheDocument();
    expect(screen.getByText("Pontos de atenção em segurança")).toBeInTheDocument();

    expect(screen.getByText("75,5%")).toBeInTheDocument();
    expect(screen.getByText("3,2%")).toBeInTheDocument();

    expect(screen.getByText("Mínimo: 80%")).toBeInTheDocument();
    expect(screen.getByText("Máximo: 5%")).toBeInTheDocument();
    expect(screen.getByText("Dentro do limite")).toBeInTheDocument();
    expect(screen.getByText("1 problema encontrado")).toBeInTheDocument();
    expect(screen.getByText("12,3k linhas")).toBeInTheDocument();
    expect(screen.getByText("Trechos que requerem revisão")).toBeInTheDocument();

    expect(screen.getByLabelText("Confiabilidade: B")).toBeInTheDocument();
    expect(screen.getByLabelText("Segurança: C")).toBeInTheDocument();
    expect(screen.getByLabelText("Manutenção: A")).toBeInTheDocument();

    expect(screen.getByText("6 problemas aceitos")).toBeInTheDocument();
    expect(screen.getByText(/1,2k linhas sem cobertura/)).toBeInTheDocument();
    expect(screen.getByText("Branch: master")).toBeInTheDocument();
  });

  it("sucesso com quality gate OK → mostra 'Aprovado' + 'Critérios sem falhas'", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        found: true,
        data: {
          ...fullSuccess.data!,
          qualityGate: { status: "OK", failedConditions: [] },
        },
      } as SonarMetricsApiResponse,
    };
    render(<SonarQualityIndicatorsCard projectName="Plateia" />);
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
    expect(screen.getByText("Critérios sem falhas")).toBeInTheDocument();
    expect(screen.queryByText(/critério com falha/)).not.toBeInTheDocument();
  });
});
