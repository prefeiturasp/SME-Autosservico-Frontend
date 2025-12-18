import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseQueryResult } from "@tanstack/react-query";

import JenkinsJobCard from "./JenkinsJobCard";
import type { JenkinsJobSummary } from "@/types/jenkins";

vi.mock("@/components/ui/skeleton", () => {
  function Skeleton(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div data-testid="skeleton" {...props} />;
  }

  return { Skeleton };
});

vi.mock("@/components/ui/button", () => {
  const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >(function Button({ children, ...rest }, ref) {
    return (
      <button ref={ref} {...rest}>
        {children}
      </button>
    );
  });
  Button.displayName = "Button";

  return { Button };
});

type LiteQuery = {
  data?: JenkinsJobSummary;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  refetch?: () => void;
};

const asQuery = (partial: LiteQuery) =>
  partial as unknown as UseQueryResult<JenkinsJobSummary, unknown>;

const makeQuery = (overrides: LiteQuery = {}) =>
  asQuery({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  });

describe("<JenkinsJobCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o hint quando projectName está ausente", () => {
    render(
      <JenkinsJobCard
        title="Versões"
        className="bg-muted p-3"
        query={makeQuery()}
        emptyProjectHint="Selecione um projeto por favor"
      />
    );

    expect(screen.getByText("Versões")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto por favor")).toBeInTheDocument();
  });

  it("renderiza estado de loading", () => {
    render(
      <JenkinsJobCard
        title="Versões"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({ isLoading: true })}
      />
    );

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza erro e chama refetch ao clicar em 'Tentar novamente'", async () => {
    const refetch = vi.fn();
    render(
      <JenkinsJobCard
        title="Versões"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({ isError: true, refetch })}
      />
    );

    expect(screen.getByText("Não foi possível carregar os dados.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Tentar novamente/i }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso sem builds -> mostra mensagem de ausência de dados", () => {
    render(
      <JenkinsJobCard
        title="Versões"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({ data: {} })}
      />
    );

    expect(screen.getByText("Sem dados de versão para este projeto.")).toBeInTheDocument();
  });

  it("sucesso -> lista as versões disponíveis", () => {
    render(
      <JenkinsJobCard
        title="Versões"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({
          data: {
            lastBuild: {
              number: 11,
              status: "SUCCESS",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
          },
        })}
      />
    );

    expect(screen.getAllByText("Versão atual").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Versão #11/)).toBeInTheDocument();
    expect(screen.getByText(/26\/01\/2024 10:22/)).toBeInTheDocument();
    expect(screen.getByText("Sucesso")).toBeInTheDocument();
    expect(screen.getByText("Histórico")).toBeInTheDocument();
    expect(screen.getByText("Sem histórico disponível.")).toBeInTheDocument();
  });

  it("abre modal de detalhes da versão ao clicar no botão de informação da linha", async () => {
    render(
      <JenkinsJobCard
        title="Versões"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({
          data: {
            lastBuild: {
              number: 12,
              status: "FAILURE",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
            lastSuccessfulBuild: {
              number: 11,
              status: "SUCCESS",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
            lastFailedBuild: {
              number: 10,
              status: "FAILURE",
              timestampMs: 1704216262092,
              timestamp: "02/01/2024 17:04",
              durationMs: 133777,
              duration: "2m 13s",
            },
          },
        })}
      />
    );

    expect(screen.getByText("Versão atual")).toBeInTheDocument();
    expect(screen.getByText("Última versão com sucesso")).toBeInTheDocument();
    expect(screen.getByText("Última versão com falha")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Ver detalhes da versão #10" }));

    expect(await screen.findByText("Detalhes da versão #10")).toBeInTheDocument();
    expect(screen.getAllByText("Última versão com falha").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("#10")).toBeInTheDocument();
    expect(screen.getAllByText("Falha").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Timestamp (ms)")).toBeInTheDocument();
    expect(screen.getByText("Duração (ms)")).toBeInTheDocument();
  });
});
